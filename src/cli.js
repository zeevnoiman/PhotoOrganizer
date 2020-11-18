const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');


const {organizePhotos} = require('./index.js');

async function promptForPhotosFolder(options) {
    
    const questions = [];
      questions.push({
        type: 'directory',
        name: 'source_path',
        message: 'Please choose the media folder to organize: ',
        basePath: './'
      });
    
      questions.push({
        type: 'list',
        name: 'year_or_month',
        message: 'Do you want me to organize for year or month?',
        choices: ['Year', 'Month']
      });

    inquirer.registerPrompt('directory', require('inquirer-select-directory'));
    const answers = await inquirer.prompt(questions);

    return answers
}

export async function cli(args) {
    clear()

    console.log(
        chalk.yellow(
          figlet.textSync('PhotoOrganizer', { horizontalLayout: 'full' })
        )
    );
    const answers = await promptForPhotosFolder()
    organizePhotos(answers);
}