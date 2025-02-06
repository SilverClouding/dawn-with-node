/**
 * Usage:
 * yarn create:static-page -- --num=1
 *
 * `num` will be the number of new templates to create. Default is 1.
 * `fix` will override the content of the existing templates
 */

const path = require('path');
const fs = require('fs-extra');
const args = require('yargs').argv;

const templatePath = path.resolve('./templates');
const sectionPath = path.resolve('./sections');

/**
 * Determines the index of the last brand static page created.
 */
const findLastTemplate = async () => {
  let num = 0;
  let foundLast = false;
  while (!foundLast && num < 50) {
    num++;
    let fileExists = await fs.pathExists(`${templatePath}/page.static-${num}.liquid`);
    if (!fileExists) {
      foundLast = true;
    }
  }

  return num;
};

/**
 * Copies the static master template and creates X amount of new duplicates
 */
const copyStaticMasterTemplate = async () => {
  const times = args.num ? args.num : 1;
  const currentFileIndex = args.fix ? 1 : await findLastTemplate();

  for (let count = 0; count < times; ++count) {
    const fileIndex = currentFileIndex + count;

    const newTemplateFileName = `${templatePath}/page.static-${fileIndex}.liquid`;
    const newSectionFileName = `${sectionPath}/page-static-${fileIndex}.liquid`;

    // Create new Template
    if (!args.fix) {
      fs.copySync(`${templatePath}/page.static-master.liquid`, newTemplateFileName, {
        errorOnExists: true
      });

      // Create Section
      fs.copySync(`${sectionPath}/page-static-master.liquid`, newSectionFileName, {
        errorOnExists: true
      });

      // Write section import
      fs.writeFileSync(newTemplateFileName, `{% section 'page-static-${fileIndex}' %}`);
    } else {
      // If we are updating the existing templates, don't create new files
      fs.copySync(`${sectionPath}/page-static-master.liquid`, newSectionFileName, {
        errorOnExists: true
      });
    }
  }
};

copyStaticMasterTemplate();
