const fs = require("fs-extra");
const path = require("path");

// Get the snippet name from the command line argument
const snippetName = process.argv[2];

if (!snippetName) {
  console.error("❌ Please provide a snippet name.");
  process.exit(1);
}

// Convert snippet name to kebab-case (optional)
const fileName = snippetName.replace(/\s+/g, "-").toLowerCase();

// Define file paths relative to the tools folder
const rootDir = path.join(__dirname, ".."); // Go up one level to the project root
const snippetsDir = path.join(rootDir, "snippets");
const snippetFilePath = path.join(snippetsDir, `${fileName}.liquid`);

// Ensure the snippets directory exists
fs.ensureDirSync(snippetsDir);

// Snippet content
const snippetContent = `<div class="${fileName}-snippet">
  <p>This is the ${snippetName} snippet.</p>
</div>`;

try {
  // Write the snippet file
  fs.writeFileSync(snippetFilePath, snippetContent);
  console.log(`✅ Snippet created: ${snippetFilePath}`);
} catch (error) {
  console.error("❌ Error creating the snippet file:", error);
}
