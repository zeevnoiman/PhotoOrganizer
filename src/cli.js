const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');

const {organizePhotos} = require('./index.js');

async function promptForPhotosFolder(options) {
    
    const questions = [];
      questions.push({
        type: 'input',
        name: 'source_path',
        message: 'Please write a complete path of the folder to organize: ',
      });
    
      questions.push({
        type: 'list',
        name: 'year_or_month',
        message: 'Do you want me to organize for year or month?',
        choices: ['Year', 'Month']
      });
    
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