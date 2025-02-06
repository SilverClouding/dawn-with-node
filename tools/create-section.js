const fs = require("fs-extra");
const path = require("path");

// Get the section name from the command line argument
const sectionName = process.argv[2];

if (!sectionName) {
  console.error("❌ Please provide a section name.");
  process.exit(1);
}

// Convert section name to kebab-case (optional)
const fileName = sectionName.replace(/\s+/g, "-").toLowerCase();

// Define file paths relative to the tools folder
const rootDir = path.join(__dirname, ".."); // Go up one level to the project root
const sectionsDir = path.join(rootDir, "sections");
const assetsDir = path.join(rootDir, "assets");
const liquidFilePath = path.join(sectionsDir, `${fileName}.liquid`);
const cssFilePath = path.join(assetsDir, `${fileName}.css`);

// Ensure directories exist
fs.ensureDirSync(sectionsDir);
fs.ensureDirSync(assetsDir);

// Section content
const liquidContent = `
{%- style -%}
  .section-{{ section.id }}-padding {
    padding-top: calc({{ section.settings.padding_top }}px * 0.75);
    padding-bottom: calc({{ section.settings.padding_bottom }}px  * 0.75);
  }

  @media screen and (min-width: 750px) {
    .section-{{ section.id }}-padding {
      padding-top: {{ section.settings.padding_top }}px;
      padding-bottom: {{ section.settings.padding_bottom }}px;
    }
  }
{%- endstyle -%}
<div class="color-{{ section.settings.color_scheme }} gradient">
  <div class="section-{{ section.id }}-padding">
    {{ section.settings.custom_liquid }}
  </div>
</div>

{% schema %}
{
  "name": "t:sections.custom-liquid.name",
  "tag": "section",
  "class": "section",
  "settings": [
    {
      "type": "liquid",
      "id": "custom_liquid",
      "label": "t:sections.custom-liquid.settings.custom_liquid.label",
      "info": "t:sections.custom-liquid.settings.custom_liquid.info"
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "t:sections.all.colors.label",
      "default": "scheme-1"
    },
    {
      "type": "header",
      "content": "t:sections.all.padding.section_padding_heading"
    },
    {
      "type": "range",
      "id": "padding_top",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "label": "t:sections.all.padding.padding_top",
      "default": 40
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "label": "t:sections.all.padding.padding_bottom",
      "default": 52
    }
  ],
  "presets": [
    {
      "name": "t:sections.custom-liquid.presets.name"
    }
  ]
}
{% endschema %}

`;

// CSS content
const cssContent = `.${fileName}-section {
  text-align: center;
  padding: 20px;
  background-color: #f8f8f8;
}`;

try {
  // Write the section file
  fs.writeFileSync(liquidFilePath, liquidContent);
  console.log(`✅ Section created: ${liquidFilePath}`);

  // Write the CSS file
  fs.writeFileSync(cssFilePath, cssContent);
  console.log(`✅ CSS file created: ${cssFilePath}`);
} catch (error) {
  console.error("❌ Error creating files:", error);
}
