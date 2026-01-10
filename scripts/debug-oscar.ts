import * as cheerio from "cheerio";
import fs from "fs";

const html = fs.readFileSync("characters/Catastrophic Disclosure Character Sheet — Oscar.html", "utf-8");
const $ = cheerio.load(html);

// Try to find section 4 header
console.log("=== Looking for Section 4 ===\n");

// Method 1: h1/h2/h3
const h1h2h3 = $("h1, h2, h3")
  .filter((_, el) => /4\.\s*Who do you answer to/i.test($(el).text()))
  .first();
console.log("Found via h1/h2/h3:", h1h2h3.length > 0);

// Method 2: summary
const summary = $("summary")
  .filter((_, el) => /4\.\s*Who do you answer to/i.test($(el).text()))
  .first();
console.log("Found via summary:", summary.length > 0);

if (summary.length > 0) {
  console.log("\nSummary text:", summary.text().trim());

  // Check parent structure
  const details = summary.parent();
  console.log("Parent tag:", details.prop("tagName"));

  // Get the .indented div
  const indented = summary.siblings(".indented");
  console.log("Has .indented sibling:", indented.length > 0);

  if (indented.length > 0) {
    console.log("\n=== Content in .indented ===");

    // Get all children
    const children = indented.children();
    console.log("Total children:", children.length);

    children.slice(0, 10).each((i, el) => {
      const $el = $(el);
      console.log(`\nChild ${i}:`);
      console.log("  Tag:", el.name);
      console.log("  Text:", $el.text().trim().substring(0, 80));

      // Check for p with strong
      const $p = $el.find("p");
      if ($p.length > 0) {
        const strongText = $p.find("strong").text();
        if (strongText) {
          console.log("  Has strong in p:", strongText);
        }
      }

      // Check for ul
      const $ul = $el.find("ul");
      if ($ul.length > 0) {
        console.log("  Has ul with", $ul.find("li").length, "items");
      }
    });
  }
}
