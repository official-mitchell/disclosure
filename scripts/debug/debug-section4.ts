import * as cheerio from "cheerio";
import fs from "fs";

const html = fs.readFileSync("characters/Catastrophic Disclosure Character Sheet — Bernardo.html", "utf-8");
const $ = cheerio.load(html);

// Find section 4 header
const section4Header = $("h1, h2, h3")
  .filter((_, el) => /4\.\s*Who do you answer to/i.test($(el).text()))
  .first();

console.log("Section 4 header found:", section4Header.length > 0);
console.log("Section 4 header text:", section4Header.text());

// Get elements after the header
const afterHeader = section4Header.parent().nextUntil(":has(> h1, > h2, > h3)");
console.log("\nElements after header:", afterHeader.length);

// Log each element
afterHeader.each((i, el) => {
  const $el = $(el);
  console.log(`\nElement ${i}:`);
  console.log("  Tag:", el.name);
  console.log("  Text:", $el.text().substring(0, 100));

  // Check what's inside the div
  const $p = $el.find("p");
  const $ul = $el.find("ul");

  console.log("  Contains <p>:", $p.length);
  console.log("  Contains <ul>:", $ul.length);

  if ($p.length > 0) {
    const strongText = $p.find("strong").text();
    console.log("  Strong text in p:", strongText);
  }

  if ($ul.length > 0) {
    const bullets = $ul.find("li").map((_, li) => $(li).text()).get();
    console.log("  Bullets:", bullets);
  }
});
