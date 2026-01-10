import * as cheerio from "cheerio";
import fs from "fs";

const html = fs.readFileSync("characters/Catastrophic Disclosure Character Sheet — Oscar.html", "utf-8");
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

// Replicate getSection
const summary = $("summary")
  .filter((_, el) => /4\.\s*Who do you answer to/i.test($(el).text()))
  .first();

const $authority = summary.siblings(".indented");
console.log("Found .indented:", $authority.length);
console.log("Has class 'indented':", $authority.first().hasClass("indented"));

const $elementsToProcess = $authority.children();
console.log("\nChildren to process:", $elementsToProcess.length);

$elementsToProcess.each((i, el) => {
  const $el = $(el);
  console.log(`\n=== Element ${i} ===`);
  console.log("Tag:", el.name);
  console.log("Classes:", $el.attr("class"));

  // Check for direct p
  const $directP = $el.find("> p");
  console.log("Has direct <p>:", $directP.length);
  if ($directP.length > 0) {
    const text = $directP.text().trim();
    console.log("  P text:", text.substring(0, 80));
    const strongText = $directP.find("strong").text();
    if (strongText) {
      console.log("  Strong in p:", strongText);
    }
  }

  // Check for p anywhere
  const $anyP = $el.find("p");
  console.log("Has any <p>:", $anyP.length);
  if ($anyP.length > 0 && $directP.length === 0) {
    $anyP.each((_, p) => {
      const $p = $(p);
      console.log("  P text:", $p.text().trim().substring(0, 80));
      const strongText = $p.find("strong").text();
      if (strongText) {
        console.log("    Strong:", strongText);
      }
    });
  }

  // Check for ul
  const $ul = $el.find("ul");
  console.log("Has <ul>:", $ul.length);
  if ($ul.length > 0) {
    const bullets = $ul.find("li").map((_, li) => htmlToText($(li).html() || "")).get();
    console.log("  Bullets:", bullets.length);
  }
});
