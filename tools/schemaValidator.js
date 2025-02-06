const fs = require('fs');
const path = require('path');
const jsonlint = require('jsonlint');
const colors = require('colors/safe');

const lintSections = specificPath => {
  const sectionFolder = path.resolve('./sections');
  const configFolder = path.resolve('./config');

  const validateFile = (folder, file) => {
    // console.log(file);
    const rawContents = fs.readFileSync(path.resolve(`${folder}/${file}`), 'utf8');

    // remove prefix content
    if (rawContents.indexOf('{% schema %}') > -1 || file.indexOf('.json') > -1) {
      const schema = rawContents.split('{% schema %}').pop().split('{% endschema %}')[0];
      console.log('Testing: ', colors.blue(file));
      jsonlint.parse(schema);
      console.log(colors.green('OK : Test Passed'));
    } else {
      console.log('Testing: ', colors.blue(file));
      console.log('Non-existent schema');
      console.log(colors.green('OK : Test Skipped'));
    }
  };

  fs.readdirSync(sectionFolder).forEach(file => {
    validateFile(sectionFolder, file);
  });

  fs.readdirSync(configFolder).forEach(file => {
    validateFile(configFolder, file);
  });
};

lintSections();
