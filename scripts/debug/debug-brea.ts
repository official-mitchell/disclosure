import * as cheerio from "cheerio";
import fs from "fs";

const html = fs.readFileSync("characters/Catastrophic Disclosure Character Sheet — Brea.html", "utf-8");
const $ = cheerio.load(html);

// Find section 4 header
const section4Header = $("h1, h2, h3")
  .filter((_, el) => /4\.\s*Who do you answer to/i.test($(el).text()))
  .first();

console.log("Section 4 header found:", section4Header.length > 0);
console.log("Section 4 header text:", section4Header.text().trim());

// Get elements after the header
const afterHeader = section4Header.parent().nextUntil(":has(> h1, > h2, > h3)");
console.log("\nElements after header:", afterHeader.length);

// Log each element's structure
afterHeader.each((i, el) => {
  const $el = $(el);
  console.log(`\n=== Element ${i} ===`);
  console.log("Tag:", el.name);

  // Check for direct ul
  const $directUl = $el.find("> ul");
  console.log("Has direct <ul>:", $directUl.length);

  if ($directUl.length > 0) {
    $directUl.each((_, ul) => {
      const $ul = $(ul);
      console.log("\nUL found:");

      // Check top-level li items
      $ul.children("li").each((liIdx, li) => {
        const $li = $(li);
        const strongText = $li.children("strong").first().text();
        console.log(`  LI ${liIdx}: Strong text = "${strongText}"`);

        // Check for nested ul elements
        const nestedUls = $li.find("> div > ul, > ul");
        console.log(`    Nested ULs: ${nestedUls.length}`);

        nestedUls.each((_, nestedUl) => {
          const bullets = $(nestedUl).find("> li").map((_, nestedLi) => $(nestedLi).text().trim()).get();
          console.log(`      Bullets:`, bullets);
        });
      });
    });
  }
});
