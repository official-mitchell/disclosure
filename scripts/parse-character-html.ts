import * as cheerio from "cheerio";
import fs from "fs";

interface CharacterData {
  displayName: string;
  nationalityBloc: string;
  occupation: string;
  covertOccupation?: string;
  publicReputation: string;
  archetypeTitle: string;
  permissions: string[];
  restrictions: string[];
  backstory: string;
  motivations: { label: string; description: string }[];
  formalAuthority: string[];
  informalFears: string[];
  safelyIgnore: string[];
  exposureConsequences: string;
  privateWant: string;
  disclosureBelief: string;
  canDiscuss: string[];
  mustConceal: string[];
}

export function parseCharacterHtml(filePath: string): CharacterData {
  const html = fs.readFileSync(filePath, "utf-8");
  const $ = cheerio.load(html);

  // Helper: find section by header text pattern
  const getSection = (pattern: RegExp) => {
    // Try to find h1, h2, or h3 headers
    let header = $("h1, h2, h3")
      .filter((_, el) => pattern.test($(el).text()))
      .first();

    // If not found, try details > summary (alternative Notion export format)
    if (header.length === 0) {
      header = $("summary")
        .filter((_, el) => pattern.test($(el).text()))
        .first();

      if (header.length > 0) {
        // For details/summary, get the content within the details tag
        return header.siblings(".indented");
      }
    }

    return header.parent().nextUntil(":has(> h1, > h2, > h3)");
  };

  // Helper: convert HTML to markdown-like text with bold preserved
  const htmlToText = (html: string): string => {
    // Replace <strong> and <b> tags with markdown bold syntax
    return html
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
      .replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**")
      .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
      .replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*")
      .replace(/<[^>]+>/g, "") // Remove all other HTML tags
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .trim();
  };

  // Helper: extract bullet points from a selection
  const getBullets = ($el: cheerio.Cheerio<any>) => {
    return $el
      .find("li")
      .map((_, li) => htmlToText($(li).html() || ""))
      .get();
  };

  // Helper: extract field from "Label: Value" bullet
  const extractField = (bullets: string[], prefix: string) => {
    const line = bullets.find((b) =>
      b.toLowerCase().startsWith(prefix.toLowerCase())
    );
    return line?.split(":").slice(1).join(":").trim() || "";
  };

  // === SECTION 0: Header ===
  const $header = getSection(/0\.\s*Header/i);
  const headerBullets = getBullets($header);

  const displayName = extractField(headerBullets, "Name");
  const nationalityBloc = extractField(headerBullets, "Nationality");
  const occupation = extractField(headerBullets, "Occupation");
  const covertOccupation = extractField(headerBullets, "Covert Occupation") || undefined;
  const publicReputation = extractField(headerBullets, "Public Reputation");

  // === SECTION 1: Roles & Permissions ===
  const $roles = getSection(/1\.\s*Roles/i);
  const rolesText = $roles.text();

  // First non-empty paragraph is the archetype designation (e.g., "You are **Journalist / Media**.")
  let archetypeTitle = "";
  $roles.find("p").each((_, p) => {
    const text = htmlToText($(p).html() || "").trim();
    if (text && !archetypeTitle) {
      archetypeTitle = text;
      return false; // Break out of loop
    }
  });

  // Split on "However" to separate permissions from restrictions
  const allRolesBullets = getBullets($roles);
  const howeverIdx = rolesText.toLowerCase().indexOf("however");

  let permissions: string[] = [];
  let restrictions: string[] = [];

  if (howeverIdx > -1) {
    let passedHowever = false;
    $roles.children().each((_, el) => {
      const text = $(el).text();
      if (text.toLowerCase().includes("however")) {
        passedHowever = true;
        return;
      }
      if ($(el).is("ul")) {
        const bullets = getBullets($(el));
        if (passedHowever) {
          restrictions.push(...bullets);
        } else {
          permissions.push(...bullets);
        }
      }
    });
  } else {
    permissions = allRolesBullets;
  }

  // === SECTION 2: Backstory ===
  const $backstory = getSection(/2\.\s*Backstory/i);
  const backstory = $backstory
    .find("p")
    .map((_, p) => htmlToText($(p).html() || ""))
    .get()
    .filter((text) => text.length > 0)
    .join("\n\n");

  // === SECTION 3: Motivations ===
  const $motivations = getSection(/3\.\s*What do you care about/i);
  const motivations: { label: string; description: string }[] = [];

  $motivations.find("li, p").each((_, el) => {
    const text = htmlToText($(el).html() || "");
    const colonIdx = text.indexOf(":");
    if (colonIdx > 0 && colonIdx < 30) {
      // Strip markdown formatting from label (remove ** for bold)
      const label = text.slice(0, colonIdx).trim().replace(/\*\*/g, '');
      motivations.push({
        label: label,
        description: text.slice(colonIdx + 1).trim(),
      });
    }
  });

  // === SECTION 4: Authority ===
  const $authority = getSection(/4\.\s*Who do you answer to/i);

  // Extract bullet lists under each subheader
  let formalAuthority: string[] = [];
  let informalFears: string[] = [];
  let safelyIgnore: string[] = [];

  // Look for paragraphs with strong tags (questions) and collect following ul elements
  let currentCategory = "";

  // For <details><summary> structure, getSection returns the .indented div
  // We need to iterate over its children instead
  let $elementsToProcess = $authority;
  if ($authority.length === 1 && $authority.first().hasClass("indented")) {
    $elementsToProcess = $authority.children();
  }

  $elementsToProcess.each((_, el) => {
    const $el = $(el);

    // Check if this div has a direct ul > li structure
    const $directUl = $el.find("> ul");
    let isBreaStyle = false;
    let isOscarStyle = false;

    if ($directUl.length > 0) {
      const firstLi = $directUl.children("li").first();

      // Check for Brea-style: li has direct strong child with category header
      const strongInLi = firstLi.children("strong").first();
      if (strongInLi.length > 0) {
        const strongText = strongInLi.text().toLowerCase();
        // It's a Brea-style header if it ends with ":" or contains category keywords
        if (strongText.endsWith(":") ||
            (strongText.includes("formal") || strongText.includes("informal") ||
             strongText.includes("influence") || strongText.includes("ignore"))) {
          isBreaStyle = true;
        }
      }

      // Check for Oscar-style: li contains plain text question followed by nested ul
      if (!isBreaStyle) {
        // Get the direct text of the li (not including nested elements)
        const liText = firstLi.clone().children().remove().end().text().toLowerCase().trim();
        // Oscar-style if the text looks like a question
        if (liText.includes("formal") || liText.includes("informal") ||
            liText.includes("fear") || liText.includes("ignore") || liText.includes("who")) {
          isOscarStyle = true;
        }
      }
    }

    if (isOscarStyle) {
      // STRUCTURE 3: Oscar-style (div > ul > li with plain text question + nested ul)
      $directUl.children("li").each((_, li) => {
        const $li = $(li);
        // Get the question text (direct text of the li, excluding nested elements)
        const questionText = $li.clone().children().remove().end().text().toLowerCase().trim();

        // Determine category from the question text
        let category = "";
        // Check "informal" before "formal" since "informally" contains "formal"
        if (questionText.includes("informal") || questionText.includes("fear") || questionText.includes("rely")) {
          category = "informal";
        } else if (questionText.includes("formal")) {
          category = "formal";
        } else if (questionText.includes("ignore")) {
          category = "ignore";
        }

        // Extract nested bullets (in nested div > ul > li structure)
        if (category) {
          const nestedBullets = $li.find("> div > ul > li, > ul > li")
            .map((_, nestedLi) => htmlToText($(nestedLi).html() || ""))
            .get()
            .filter(text => text.length > 0);

          if (category === "formal") {
            formalAuthority.push(...nestedBullets);
          } else if (category === "informal") {
            informalFears.push(...nestedBullets);
          } else if (category === "ignore") {
            safelyIgnore.push(...nestedBullets);
          }
        }
      });
    } else if (isBreaStyle) {
      // STRUCTURE 2: Brea-style (div > ul > li > strong + nested ul with bullets)
      $directUl.children("li").each((_, li) => {
        const $li = $(li);
        const strongText = $li.children("strong").first().text().toLowerCase();

        // Determine category from the strong text
        let category = "";
        if (strongText.includes("informal") || strongText.includes("influence") || strongText.includes("pressure") || strongText.includes("fear") || strongText.includes("rely")) {
          category = "informal";
        } else if (strongText.includes("formal")) {
          category = "formal";
        } else if (strongText.includes("ignore")) {
          category = "ignore";
        }

        // Extract nested bullets
        if (category) {
          const nestedBullets = $li.find("> div > ul > li, > ul > li")
            .map((_, nestedLi) => htmlToText($(nestedLi).html() || ""))
            .get()
            .filter(text => text.length > 0);

          if (category === "formal") {
            formalAuthority.push(...nestedBullets);
          } else if (category === "informal") {
            informalFears.push(...nestedBullets);
          } else if (category === "ignore") {
            safelyIgnore.push(...nestedBullets);
          }
        }
      });
    } else {
      // STRUCTURE 1: Bernardo-style (div > p with question OR div > ul with bullets)
      // Check for paragraph with strong tag (question header)
      const $p = $el.find("p");
      if ($p.length > 0) {
        const strongText = $p.find("strong").text().toLowerCase();

        // Check "informal" before "formal" since "informally" contains "formal"
        if (strongText.includes("informal") || strongText.includes("fear") || strongText.includes("rely")) {
          currentCategory = "informal";
        } else if (strongText.includes("formal")) {
          currentCategory = "formal";
        } else if (strongText.includes("ignore")) {
          currentCategory = "ignore";
        }
      }

      // Handle bulleted lists following category headers
      if ($el.find("ul").length > 0 && currentCategory) {
        const bullets = $el.find("ul > li")
          .map((_, li) => htmlToText($(li).html() || ""))
          .get()
          .filter(text => text.length > 0);

        // Add to appropriate category
        if (currentCategory === "formal") {
          formalAuthority.push(...bullets);
        } else if (currentCategory === "informal") {
          informalFears.push(...bullets);
        } else if (currentCategory === "ignore") {
          safelyIgnore.push(...bullets);
        }
      }
    }
  });

  // === SECTION 5: Exposure ===
  const $exposure = getSection(/5\.\s*What happens.*exposed/i);
  const exposureConsequences = $exposure
    .find("p")
    .map((_, p) => htmlToText($(p).html() || ""))
    .get()
    .filter((text) => text.length > 0)
    .join("\n\n");

  // === SECTION 6: Private Want ===
  const $private = getSection(/6\.\s*What do you privately want/i);
  const privateWant = $private
    .find("p")
    .map((_, p) => htmlToText($(p).html() || ""))
    .get()
    .filter((text) => text.length > 0)
    .join("\n\n");

  // === SECTION 7: Disclosure ===
  const $disclosure = getSection(/7\.\s*What is Disclosure/i);
  const disclosureBelief = $disclosure
    .find("p")
    .map((_, p) => htmlToText($(p).html() || ""))
    .get()
    .filter((text) => text.length > 0)
    .join("\n\n");

  // === SECTION 8: Boundaries ===
  const $boundaries = getSection(/8\.\s*What you know/i);

  let canDiscuss: string[] = [];
  let mustConceal: string[] = [];
  let foundConceal = false;

  $boundaries.children().each((_, el) => {
    const text = $(el).text().toLowerCase();
    if (text.includes("conceal")) foundConceal = true;

    if ($(el).is("ul")) {
      const bullets = getBullets($(el));
      if (foundConceal) {
        mustConceal.push(...bullets);
      } else {
        canDiscuss.push(...bullets);
      }
    }
  });

  return {
    displayName,
    nationalityBloc,
    occupation,
    covertOccupation,
    publicReputation,
    archetypeTitle,
    permissions,
    restrictions,
    backstory,
    motivations,
    formalAuthority,
    informalFears,
    safelyIgnore,
    exposureConsequences,
    privateWant,
    disclosureBelief,
    canDiscuss,
    mustConceal,
  };
}
