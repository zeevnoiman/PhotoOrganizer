const fs = require('fs');
const path = require('path');
const mv = require('mv');
const date_fns = require('date-fns')
const exiftool = require('node-exiftool')
const exiftoolBin = require('dist-exiftool')
const Listr = require('listr')

const ep = new exiftool.ExiftoolProcess(exiftoolBin)

async function moveFilesToCorrectDirectories(ctx){
    const files = ctx.filesSerialized;
    files.map(file => {
        const dir = path.join('./', file.creationTarget);

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        mv(path.join('./', file.FileName),path.join('./', file.creationTarget, file.FileName), function(err) {
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

async function getCreationYear(ctx){
    const files = ctx.filteredFiles;
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

    ctx.filesSerialized = filesSerialized;
    
}

async function filterOnlyMediaFormats(ctx){
    // const files_data = await getFilesInfo()
    const filtered_files = ctx.filesData.filter(file => file.FileType == 'JPEG' || file.FileType == 'MP4' );
    ctx.filteredFiled = filtered_files;
}

async function getFilesInfo(ctx){
    await ep.open();
      // read directory
    const {data, error} = await ep.readMetadata('./', ['CreateDate', 'FileType', 'FileName', 'FileModifyDate']);

    await ep.close()

    ctx.filesData = data;

}


export function organizePhotos(targetData){
    const tasks = new Listr([
        {
          title: 'Get all files info',
          task: ctx => getFilesInfo(ctx),
        },
        {
          title: 'Filter only media formats',
          task: ctx => filterOnlyMediaFormats(ctx),
        },
        {
          title: 'Get creation year',
          task: ctx => getCreationYear(ctx),
          enabled: () => options.git,
        },
        {
          title: 'Get creation month',
          task: ctx => getCreationYear(ctx),
          enabled: () => options.git,
        },
        {
          title: 'Move files to correct folder',
          task: (ctx) => initGit(ctx),
        },
    ]);

    console.log(targetData);
    // await tasks.run();
    // console.log('%s Project ready', chalk.green.bold('DONE'));
    return true;
}

