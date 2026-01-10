import * as fs from 'fs';
import * as path from 'path';

const CHARACTERS_DIR = path.join(__dirname, '..', 'characters');
const MERGED_DIR = path.join(__dirname, '..', 'characters', 'Merged');
const OUTPUT_FILE = path.join(MERGED_DIR, 'merged-character-sheets-01.html');

// Create Merged directory if it doesn't exist
if (!fs.existsSync(MERGED_DIR)) {
  fs.mkdirSync(MERGED_DIR, { recursive: true });
}

// Get all HTML files from characters directory
const characterFiles = fs.readdirSync(CHARACTERS_DIR)
  .filter(file => file.endsWith('.html'))
  .sort();

console.log(`Found ${characterFiles.length} character sheets to merge...`);

// Extract character name from filename
function getCharacterName(filename: string): string {
  const match = filename.match(/— (.+)\.html$/);
  return match ? match[1] : filename.replace('.html', '');
}

// Extract the style section from the first file
const firstFile = fs.readFileSync(path.join(CHARACTERS_DIR, characterFiles[0]), 'utf-8');
const styleMatch = firstFile.match(/<style>([\s\S]*?)<\/style>/);
const sharedStyle = styleMatch ? styleMatch[1] : '';

// Build merged HTML
let mergedHTML = `<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>Catastrophic Disclosure - All Character Sheets</title>
<style>
${sharedStyle}

/* Additional styles for merged document */
.character-sheet {
  page-break-after: always;
  margin-bottom: 3em;
  border-bottom: 3px solid #ccc;
  padding-bottom: 2em;
}

.character-sheet:last-child {
  page-break-after: auto;
  border-bottom: none;
}

.toc {
  margin: 2em 0;
  padding: 2em;
  background: #f5f5f5;
  border-radius: 8px;
}

.toc h2 {
  margin-top: 0;
}

.toc ul {
  list-style-type: none;
  padding-left: 0;
}

.toc li {
  margin: 0.5em 0;
}

.toc a {
  text-decoration: none;
  color: rgb(56, 125, 201);
  font-weight: 500;
}

.toc a:hover {
  text-decoration: underline;
}

@media print {
  .toc {
    page-break-after: always;
  }
}
</style>
</head>
<body>
<div class="page sans">
<h1 style="text-align: center; font-size: 3rem; margin: 1em 0;">Catastrophic Disclosure</h1>
<h2 style="text-align: center; font-weight: 400; color: #666; margin-bottom: 2em;">Complete Character Sheets</h2>

<div class="toc">
<h2>Table of Contents</h2>
<ul>
`;

// Create table of contents entries
characterFiles.forEach((filename, index) => {
  const charName = getCharacterName(filename);
  mergedHTML += `  <li><a href="#character-${index}">${charName}</a></li>\n`;
});

mergedHTML += `</ul>
</div>

`;

// Extract and append each character sheet
characterFiles.forEach((filename, index) => {
  const charName = getCharacterName(filename);
  console.log(`Processing: ${charName}`);

  const filePath = path.join(CHARACTERS_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract the article content (everything between <article> and </article>)
  const articleMatch = content.match(/<article[^>]*>([\s\S]*?)<\/article>/);

  if (articleMatch) {
    const articleContent = articleMatch[1];

    mergedHTML += `<div class="character-sheet" id="character-${index}">
${articleContent}
</div>

`;
  }
});

// Close the HTML
mergedHTML += `</div>
</body>
</html>`;

// Write the merged file
fs.writeFileSync(OUTPUT_FILE, mergedHTML, 'utf-8');

console.log(`\n✓ Successfully merged ${characterFiles.length} character sheets!`);
console.log(`✓ Output saved to: ${OUTPUT_FILE}`);
