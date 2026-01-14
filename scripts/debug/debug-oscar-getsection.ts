import * as cheerio from "cheerio";
import fs from "fs";

const html = fs.readFileSync("characters/Catastrophic Disclosure Character Sheet — Oscar.html", "utf-8");
const $ = cheerio.load(html);

// Replicate getSection logic
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
      const siblings = header.siblings(".indented");
      console.log("Found via summary, .indented siblings:", siblings.length);
      return siblings;
    }
  }

  return header.parent().nextUntil(":has(> h1, > h2, > h3)");
};

const $authority = getSection(/4\.\s*Who do you answer to/i);

console.log("=== getSection result ===");
console.log("Length:", $authority.length);

$authority.each((i, el) => {
  const $el = $(el);
  console.log(`\nElement ${i}:`);
  console.log("  Tag:", el.name);
  console.log("  Text:", $el.text().trim().substring(0, 80));
});

console.log("\n=== Now checking children ===");
$authority.children().slice(0, 10).each((i, el) => {
  const $el = $(el);
  console.log(`\nChild ${i}:`);
  console.log("  Tag:", el.name);
  console.log("  Text:", $el.text().trim().substring(0, 80));

  const $p = $el.find("p");
  if ($p.length > 0) {
    console.log("  Has <p>:", $p.length);
    const strongText = $p.find("strong").text();
    if (strongText) {
      console.log("    Strong text:", strongText);
    }
  }
});
