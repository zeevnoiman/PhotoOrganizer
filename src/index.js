const fs = require('fs');
const path = require('path');
const mv = require('mv');
const date_fns = require('date-fns')
const exiftool = require('node-exiftool')
const exiftoolBin = require('dist-exiftool')
const Listr = require('listr')

const ep = new exiftool.ExiftoolProcess(exiftoolBin)

const sortByMonth = process.argv[2];



//moveFilesToCorrectDirectories(sortByMonth);

async function moveFilesToCorrectDirectories(sortByMonth){
    let files;
    
    if(sortByMonth){
        files = await getCreationMonth();
    }
    else{
        files = await getCreationYear();
    }
    
    files.map(file => {
        const dir = path.join('./', file.creationTarget);

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        mv(path.join('./', file.FileName),path.join('./', file.creationTarget, file.FileName), function(err) {
          })  
    });
}

async function getCreationMonth(){
    const files = await filterOnlyMediaFormats();
    console.log(files);
    
    const filesSerialized = files.map(file => {
        let creationDate;
        if(file.CreateDate && file.CreateDate !== '0000:00:00 00:00:00'){
            console.log('CreateDate');
            
            creationDate = date_fns.parse(file.CreateDate, 'y:MM:dd HH:mm:ss', new Date());
        }
        else{
            console.log('FileModify');
            creationDate = date_fns.parse(file.FileModifyDate, 'y:MM:dd HH:mm:ssXXX', new Date());
        }
        console.log(creationDate);
        
        return({
            ...file,
            creationTarget: date_fns.format(creationDate, 'MMMM')
        })
    })

    return filesSerialized;
}

async function getCreationYear(){
    const files = await filterOnlyMediaFormats();
    const filesSerialized = files.map(file => {

        let creationDate;

        if(file.CreateDate  && file.CreateDate !== '0000:00:00 00:00:00'){
            creationDate = date_fns.parse(file.CreateDate, 'y:MM:dd HH:mm:ss', new Date());
        }
        else{
            creationDate = date_fns.parse(file.FileModifyDate, 'y:MM:dd HH:mm:ssXXX', new Date());
        }
        console.log(creationDate);
        
        return({
            ...file,
            creationTarget: creationDate.getFullYear().toString()
        })
    })

    return filesSerialized;
    

}

async function filterOnlyMediaFormats(){
    const files_data = await getFilesInfo()
    const filtered_files = files_data.filter(file => file.FileType == 'JPEG' || file.FileType == 'MP4' );
    return filtered_files;
}

async function getFilesInfo(){
await ep.open();
  // read directory
const {data, error} = await ep.readMetadata('./', ['CreateDate', 'FileType', 'FileName', 'FileModifyDate']);

await ep.close()

return data;

}


export default function organizePhotos(){

    
    const tasks = new Listr([
        {
          title: 'Copy project files',
          task: () => copyTemplateFiles(options),
        },
        {
          title: 'Initialize git',
          task: () => initGit(options),
          enabled: () => options.git,
        },
        {
          title: 'Install dependencies',
          task: () =>
            projectInstall({
              cwd: options.targetDirectory,
            }),
          skip: () =>
            !options.runInstall
              ? 'Pass --install to automatically install dependencies'
              : undefined,
        },
    ]);


  await tasks.run();
  console.log('%s Project ready', chalk.green.bold('DONE'));
  return true;
}




