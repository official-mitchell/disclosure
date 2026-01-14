import * as cheerio from "cheerio";
import fs from "fs";

const html = fs.readFileSync("characters/Catastrophic Disclosure Character Sheet — Bernardo.html", "utf-8");
const $ = cheerio.load(html);

// Helper function
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

// Find section 4
const section4Header = $("h1, h2, h3")
  .filter((_, el) => /4\.\s*Who do you answer to/i.test($(el).text()))
  .first();

const afterHeader = section4Header.parent().nextUntil(":has(> h1, > h2, > h3)");

let formalAuthority: string[] = [];
let informalFears: string[] = [];
let safelyIgnore: string[] = [];
let currentCategory = "";

afterHeader.each((i, el) => {
  const $el = $(el);

  // Check for paragraph with strong tag
  const $p = $el.find("p");
  if ($p.length > 0) {
    const strongText = $p.find("strong").text().toLowerCase();
    console.log(`\nElement ${i}: Found question - "${strongText}"`);

    if (strongText.includes("formal")) {
      currentCategory = "formal";
      console.log(`  -> Set category to: formal`);
    } else if (strongText.includes("informal") || strongText.includes("fear") || strongText.includes("rely")) {
      currentCategory = "informal";
      console.log(`  -> Set category to: informal`);
    } else if (strongText.includes("ignore")) {
      currentCategory = "ignore";
      console.log(`  -> Set category to: ignore`);
    }
  }

  // Check for bulleted list
  const $ul = $el.find("ul");
  if ($ul.length > 0 && currentCategory) {
    const bullets = $ul.find("li")
      .map((_, li) => htmlToText($(li).html() || ""))
      .get()
      .filter(text => text.length > 0);

    console.log(`\nElement ${i}: Found ${bullets.length} bullets for category "${currentCategory}"`);
    bullets.forEach(b => console.log(`  - ${b.substring(0, 60)}...`));

    if (currentCategory === "formal") {
      formalAuthority.push(...bullets);
    } else if (currentCategory === "informal") {
      informalFears.push(...bullets);
    } else if (currentCategory === "ignore") {
      safelyIgnore.push(...bullets);
    }
  }
});

console.log("\n\n=== FINAL RESULTS ===");
console.log("\nFORMAL AUTHORITY:", formalAuthority.length);
formalAuthority.forEach((item, i) => console.log(`  ${i+1}. ${item.substring(0, 60)}...`));
console.log("\nINFORMAL FEARS:", informalFears.length);
informalFears.forEach((item, i) => console.log(`  ${i+1}. ${item.substring(0, 60)}...`));
console.log("\nSAFELY IGNORE:", safelyIgnore.length);
safelyIgnore.forEach((item, i) => console.log(`  ${i+1}. ${item.substring(0, 60)}...`));
