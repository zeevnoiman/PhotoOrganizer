const fs = require('fs');
const path = require('path');
const mv = require('mv');
const date_fns = require('date-fns')
const exiftool = require('node-exiftool')
const exiftoolBin = require('dist-exiftool');
var CLI = require('clui'),

const ep = new exiftool.ExiftoolProcess(exiftoolBin)

async function moveFilesToCorrectDirectories(files, source_path){
    files.map(file => {
        const dir = path.join('./', file.creationTarget);

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        mv(path.join('./', file.FileName),path.join(source_path, file.creationTarget, file.FileName), function(err) {
          })  
    });
}

async function getCreationMonth(ctx){
    const files = ctx.filteredFiles;
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

    ctx.filesSerialized = filesSerialized;
}

async function getCreationYear(files){
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

async function filterOnlyMediaFormats(filesData){
    // const files_data = await getFilesInfo()
    const filtered_files = filesData.filter(file => file.FileType == 'JPEG' || file.FileType == 'MP4' );
    return filtered_files;
}

async function getFilesInfo(source_path){
    await ep.open();
      // read directory
    const {data, error} = await ep.readMetadata(source_path, ['CreateDate', 'FileType', 'FileName', 'FileModifyDate']);

    await ep.close()

    return data;

}


export function organizePhotos(targetData){
    console.log(targetData);
    
    Spinner = CLI.Spinner;
    var spinner = new Spinner('Processing your photos...');
    spinner.start();

    getFilesInfo(targetData.source_path)
    .then(data => {
        return filterOnlyMediaFormats(data)
    })
    .then(filteredFiles => {
        if(targetData.year_or_month == 'year'){
            return getCreationYear(filteredFiles)
        } else{
            return getCreationMonth(filteredFiles)
        }
    })
    .then(filesSerialized => {
        return moveFilesToCorrectDirectories(filesSerialized, targetData.source_path)
    })
    .catch(err => console.log(err))
    .finally(spinner.stop());

    // await tasks.run();
    // console.log('%s Project ready', chalk.green.bold('DONE'));
    return true;
}

