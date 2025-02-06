const sass = require("sass");
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const chokidar = require("chokidar");

const args = process.argv.slice(2);
const mode =
  args.find((arg) => arg.startsWith("--mode="))?.split("=")[1] || "development";
const watch = args.includes("--watch");
const isBaseline = args.includes("--baseline");

function compileSass(file) {
  const outputStyle = mode === "production" ? "compressed" : "expanded";
  const result = sass.renderSync({
    file: file,
    outputStyle: outputStyle,
    includePaths: [path.join(process.cwd(), "src", "styles")],
    loadPaths: [
      path.join(process.cwd(), "src/styles"),
      isBaseline ? path.join(process.cwd(), "baseline/styles") : null,
    ].filter(Boolean),
  });

  let outputPath;
  if (file.includes("/sections/")) {
    // For section files, output to assets/section-*.css
    const filename = path.basename(file, ".scss").replace("_", "");
    outputPath = path.join(process.cwd(), "assets", `section-${filename}.css`);
  } else if (file.includes("/snippets/")) {
    // For snippet files, output to assets/component-*.css
    const filename = path.basename(file, ".scss").replace("_", "");
    outputPath = path.join(
      process.cwd(),
      "assets",
      `component-${filename}.css`
    );
  } else {
    // For other files, keep existing behavior
    const relativePath = path.relative("src", file);
    outputPath = path.join(
      process.cwd(),
      relativePath.replace(".scss", ".css").replace("_", "")
    );
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, result.css);

  console.log(
    `✨ Compiled: ${file} → ${path.relative(process.cwd(), outputPath)}`
  );
}

function build() {
  const pattern = isBaseline
    ? "src/**/*.scss"
    : "{src/styles/**/*.scss,src/sections/**/*.scss,src/snippets/**/*.scss}";
  const files = glob.sync(pattern);
  files.forEach(compileSass);
}

if (watch) {
  const pattern = isBaseline
    ? "src/**/*.scss"
    : "{src/styles/**/*.scss,src/sections/**/*.scss,src/snippets/**/*.scss}";
  // Run initial build before starting watch
  build();
  // Then start watching for changes
  chokidar.watch(pattern).on("change", compileSass);
  console.log(
    `👀 Watching for changes... (${isBaseline ? "baseline" : "theme"} mode)`
  );
} else {
  build();
}
