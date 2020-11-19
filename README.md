# PhotoOrganizer
CLI to organize photos from a folder into distinct folders grouped by year and month. Developed with nodejs.

## Installation
You can download the source code and run on the cmd in the projects directory:
```
npm install -g
```

## Usage

Open the cmd in your computer and digit the command `photo-organizer`. 
You will see something like this:
![Choose a folder screen](/images/first-screen.png)
You can navigate through your directory to pick the folder you want to organize.

After that, the program will ask you if you want to group by year or group by month.
![Choose a group-by criteria](/images/second-screen.png)

Press *enter* and wait until, magically, your folder will be organized by the criteria you chose. :clap::clap:

*Obs.: The program will create a default folder to put the files it does not find any date information*


## Future feature :nerd_face:
- [X] Transform the script into a CLI.
- [X] There will be no need to copy and paste all the path to the program. It will be possible to install it globally with npm.
- [X] There will be no need to copy and paste all the path to source folder. Add navigation feature.
- [ ] Apply unit testing to all the program with **jest**

## Contributing
If you think this is a good thing and want to help, great! Just open an issue and let's do great things! :smile:
