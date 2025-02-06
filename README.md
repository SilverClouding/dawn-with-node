## Extension Guidelines

### Creating Sections and Snippets

Dawn includes CLI commands to generate new sections and snippets with the correct file structure and boilerplate code:

```bash
# Create a new section
npm run create:section -- "My Custom Section"

# Create a new snippet
npm run create:snippet -- "My Custom Snippet"

```

This will:
1. Create the Liquid template with proper stylesheet inclusion
2. Generate the CSS file with BEM structure
3. Set up responsive breakpoints
4. Add standard padding/margin variables

Generated files follow this structure:

```text
sections/
└── my-section-name.liquid
assets/
    └── my-section-name.css
```
