// USAGE:
// you can use the --open flag to open the files automatically if supported.
// npm run create:snippet -- --name=your-snippet-name

const fs = require('fs-extra');
const args = require('yargs').argv;
const open = require('open');
const chalk = require('chalk');
const path = require('path');

const createSnippet = () => {
  if (!args.name) {
    console.log(chalk.red('!!!! Error : a name is required !!!'));
    console.log(`use ${chalk.blue('npm run create:snippet -- --name=your-snippet-name')} replacing the name value`);
    return;
  }

  const snippetContent = `{%- comment -%}
  {% render '${args.name}' %}
{%- endcomment -%}

<section class="${args.name}">

</section>`;
  const themeDir = fs.existsSync('./theme') ? 'theme' : 'theme-base';
  const snippetFile = `./${themeDir}/snippets/${args.name}.liquid`;
  const stylesContent = `.${args.name} {\n\n}`;
  const stylesFile = `./src/styles/snippets/_${args.name}.scss`;
  const stylesBase = './src/styles/theme.scss';
  const styleInclude = `\n@import './snippets/${args.name}';`;

  fs.access(snippetFile, fs.F_OK, err => {
    if (!err) {
      throw 'Snippet already exists';
    }
  });

  fs.access(stylesFile, fs.F_OK, err => {
    if (!err) {
      throw 'SCSS file already exists';
    }
  });

  fs.writeFile(snippetFile, snippetContent, function (err) {
    if (err) throw err;
  });

  fs.writeFile(stylesFile, stylesContent, function (err) {
    if (err) throw err;
  });

  fs.readFile(stylesBase, 'utf8', function (err, data) {
    if (err) {
      throw err;
    }

    const commentIndex = data.indexOf('// Snippets ✂');
    if (commentIndex === -1) {
      throw 'Comment "// Snippets ✂" not found in the file';
    }

    const beforeComment = data.slice(0, commentIndex + '// Snippets ✂'.length); // remove +1 to exclude the newline after the comment
    const afterComment = data.slice(commentIndex + '// Snippets ✂'.length);

    const newData = beforeComment + '\n' + styleInclude + '\n' + afterComment.trim(); // add a newline before and after the new import

    fs.writeFile(stylesBase, newData, function (err) {
      if (err) throw err;
    });
  });

  const openFile = async filePath => {
    // Opens the image in the default image viewer and waits for the opened app to quit.
    await open(stylesFile, { wait: true });
    await open(snippetFile, { wait: true });
  };

  if (args.open) {
    openFile();
  }

  console.log(chalk.green('!!!! Section created successfully !!!'));
  console.log('you can open the files by CTRL + Click or CMD + Click if your terminal and editor are linked.');
  console.log(
    chalk.blue(`
    ${path.resolve(stylesFile)}
    ${path.resolve(snippetFile)}
  `)
  );
};

createSnippet();
