import * as cheerio from "cheerio";
import fs from "fs";

const html = fs.readFileSync("characters/Catastrophic Disclosure Character Sheet — Bernardo.html", "utf-8");
const $ = cheerio.load(html);

const htmlToText = (html: string): string => {
  return html
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**")
    .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
    .replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
};

const section4Header = $("h1, h2, h3")
  .filter((_, el) => /4\.\s*Who do you answer to/i.test($(el).text()))
  .first();

const afterHeader = section4Header.parent().nextUntil(":has(> h1, > h2, > h3)");

let currentCategory = "";

afterHeader.each((i, el) => {
  const $el = $(el);
  console.log(`\n=== Element ${i} ===`);

  // Check for Brea-style
  const $directUl = $el.find("> ul");
  let isBreaStyle = false;

  if ($directUl.length > 0) {
    const firstLi = $directUl.children("li").first();
    const hasStrongChild = firstLi.children("strong").length > 0;
    console.log(`Has direct UL: yes`);
    console.log(`First LI has strong child: ${hasStrongChild}`);
    isBreaStyle = hasStrongChild;
  } else {
    console.log(`Has direct UL: no`);
  }

  console.log(`Is Brea-style: ${isBreaStyle}`);

  if (!isBreaStyle) {
    // Check for paragraph
    const $p = $el.find("p");
    if ($p.length > 0) {
      const strongText = $p.find("strong").text().toLowerCase();
      console.log(`Found <p> with strong: "${strongText}"`);

      if (strongText.includes("informal") || strongText.includes("fear") || strongText.includes("rely")) {
        currentCategory = "informal";
      } else if (strongText.includes("formal")) {
        currentCategory = "formal";
      } else if (strongText.includes("ignore")) {
        currentCategory = "ignore";
      }
      console.log(`Set category to: ${currentCategory}`);
    }

    // Check for UL with bullets
    if ($el.find("ul").length > 0 && currentCategory) {
      const bullets = $el.find("ul > li")
        .map((_, li) => htmlToText($(li).html() || ""))
        .get()
        .filter(text => text.length > 0);
      console.log(`Found ${bullets.length} bullets for category "${currentCategory}"`);
      bullets.forEach(b => console.log(`  - ${b.substring(0, 60)}...`));
    }
  }
});
