// @todo This is not working anymore and needs updating to create shopify 2.0 templates

// USAGE:
// npm run create:template -- --name=your-template-name
// you can use the --open flag to open the files `npm run create:template -- --name=your-template-name --open`
// OR
// npm run create:template -- --name=your-template-name --folder=your-scss-folder-name

const fs = require('fs-extra');
const args = require('yargs').argv;
const open = require('open');
const chalk = require('chalk');
const path = require('path');

const createTemplate = () => {
  if (!args.name) {
    console.log(chalk.red('!!!! Error : a name is required !!!'));
    console.log(`use ${chalk.blue('npm run create:template -- --name=your-template-name')} replacing the name value`);
    return;
  }

  const templateContent = `{
  "wrapper": "div.${args.name}-template",
  "sections": {
    "main": {
      "type": "${args.name}-main"
    }
  },
  "order": [
    "main"
  ]
}`;
  const stylesContent = `\n.${args.name}-template { \n\n }\n`;
  const stylesBase = './src/styles/theme.scss';
  const templateFile = `./templates/${args.name}.json`;
  let styleInclude = '';
  let stylesFile = '';

  if (args.folder) {
    styleInclude = `\n@import './templates/${args.folder}/${args.name}';`;
    stylesFile = `./src/styles/templates/${args.folder}/_${args.name}.scss`;

    fs.mkdir(`./src/templates/${args.folder}`, { recursive: true }, err => {
      if (err) throw err;
    });

    fs.mkdir(`./src/styles/templates/${args.folder}`, { recursive: true }, err => {
      if (err) throw err;
    });

    fs.mkdir('./src/styles/templates', { recursive: true }, err => {
      if (err) throw err;
    });
  } else {
    styleInclude = `\n@import './templates/${args.name}';`;
    stylesFile = `./src/styles/templates/_${args.name}.scss`;
  }

  fs.access(templateFile, fs.F_OK, err => {
    if (!err) {
      throw 'Template already exists';
    }
  });

  fs.access(stylesFile, fs.F_OK, err => {
    if (!err) {
      throw 'SCSS file already exists';
    }
  });

  fs.writeFile(templateFile, templateContent, function (err) {
    if (err) throw err;
  });

  fs.writeFile(stylesFile, stylesContent, function (err) {
    if (err) throw err;
  });

  fs.appendFile(stylesBase, styleInclude, function (err) {
    if (err) {
      throw err;
    }
  });

  const openFile = async () => {
    // Opens the image in the default image viewer and waits for the opened app to quit.
    await open(stylesFile, { wait: true });
    await open(templateFile, { wait: true });
  };

  if (args.open) {
    openFile();
  }

  console.log(chalk.green('!!!! Section created successfully !!!'));
  console.log('you can open the files by CTRL + Click or CMD + Click if your terminal and editor are linked.');
  console.log(
    chalk.blue(`
    ${path.resolve(stylesFile)}
    ${path.resolve(templateFile)}
  `)
  );
};

createTemplate();
