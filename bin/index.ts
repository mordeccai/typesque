#!/usr/bin/env node
import program from 'commander';
import pluralize from 'pluralize';
import _ from 'lodash';
import * as  path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import { isAcceptedName, getFormattedName, destinationExists, isTypesqueProject } from '../main';
import  ora from 'ora';
import npm from 'npm-programmatic';


program
  .version('0.1.0', '-v --version')
  .description('A node framework on top of express with superpowers')

program
  .command('new <name>')
  .description('Create a new typesque project')
  .action(newProject)

program
  .command('make:model <name>')
  .description('Make a model')
  .option('-p --plural', 'Make the name plural')
  .action(makeModel)
  
  program
  .command('make:controller <name>')
  .description('Make a controller')
  .option('-p --plural', 'Make controller name plural')
  .action(makeController)

  program
  .command('make:middleware <name>')
  .description('Make a middleware')
  .action(makeMiddleware)

  program
  .command('serve')
  .description('Serve project')
  .option('-d --dev', 'Serve dev version')
  .action(serve)
/*   program
  .command('make:ehandler <name>')
  .action(makeEHandler) */
 
program.parse(process.argv)

async function newProject(name: string, cmd: any){
    name = getFormattedName(name, cmd);
    let projectName: any = name.split(/(?=[A-Z])|\-/g);
    projectName[projectName.length -1] = projectName[projectName.length-1];
    name = projectName.join('-').toLowerCase();
    const git = require('simple-git/promise')(process.cwd()).silent(true);
    const spinner = ora('Creating project').start('Generating project blueprint');
    git.clone('https://github.com/mordeccai/sequelize-typescript-api-starter.git', name).then(async ()=> {
        await fs.remove(path.join(process.cwd(), name, '.git'));
        spinner.start("Configuring project")
        let packageJsonFilePath = path.join(process.cwd(), name, 'package.json');
        let packageJSON = JSON.parse(await fs.readFile(packageJsonFilePath, 'utf-8'))
        packageJSON["name"] = name;
        spinner.start("Copying "+ chalk.blue(".env")+ " file");
        await fs.copy(path.join(process.cwd(), name, '.env.example'), path.join(process.cwd(), name, '.env'))
        await fs.writeFile(packageJsonFilePath, JSON.stringify(packageJSON, null, 4));
        spinner.start("Installing project packages")
        npm.install([''], {
            cwd: path.join(process.cwd(), name),
            save:true
        })
        .then(function(){
            spinner.succeed("Packages installed successfuly");
            spinner.succeed(`Project ${chalk.green(name)} created successfully`)
            console.log(`Dev (With watch) ${chalk.blue("npm run start:dev")} \nProd (Without watch) ${chalk.blue("npm run start")}`)
            console.log("Commands are subject to future changes");
        })
        .catch(function(){
            spinner.fail("Unable to install packages");
            spinner.succeed(`Project ${chalk.green(name)} created`)
            console.log("You can try installing modules manualy")
        });
    }).catch((err: any)=>{
        spinner.fail('Failed to create project.');
    }); 
}

async function makeModel(name: string, cmd: any){
    let type = 'model';
    if(!await isTypesqueProject()){
        console.error(`${chalk.bgRed(" ERROR ")} Make sure you are inside a Typesque project to run the make:model command`);
        return;
    };
    if (!isAcceptedName(name, type)) return;
    name = getFormattedName(name, cmd, type);
    let templateFile = path.join(__dirname, '..', 'templates', `${type}.tsq`);
    let destinationFile = path.join(process.cwd(), 'src', 'app', `${pluralize(type)}`, `${name}.ts`);
    if(await destinationExists(destinationFile)) return;
    let tableName: any = name.split(/(?=[A-Z])|\-/g);
    tableName[tableName.length -1] = pluralize(tableName[tableName.length-1]);
    tableName = tableName.join('_').toLowerCase();
    let template = await fs.readFile(templateFile,'utf-8');
    template = template.replace(/\$\$modelName\$\$/g, name);
    template = template.replace(/\$\$tableName\$\$/g, tableName);
    await fs.writeFile(destinationFile, template);
    console.log(`${chalk.green('√ Created '+type+':')} ${name} `);
}

async function makeController(name: string, cmd: any){
    let type = 'controller';
    if(!await isTypesqueProject()){
        console.error(`${chalk.bgRed(" ERROR ")} Make sure you are inside a Typesque project to run the make:controller command`);
        return;
    };
    if (!isAcceptedName(name, type)) return;
    name = getFormattedName(name, cmd, type, true);
    let templateFile = path.join(__dirname, '..', 'templates', `${type}.tsq`);
    let destinationFile = path.join(process.cwd(), 'src', 'app', `${pluralize(type)}`, `${name}.ts`);
    if(await destinationExists(destinationFile)) return;
    let template = await fs.readFile(templateFile, 'utf-8');
    template = template.replace(/\$\$controllerName\$\$/g, name);
    await fs.writeFile(destinationFile, template);
    console.log(`${chalk.green('√ Created '+type+':')} ${name} `);
}

async function makeMiddleware(name:string, cmd:any){
    let type = 'middleware';
    if(!await isTypesqueProject()){
        console.error(`${chalk.bgRed(" ERROR ")} Make sure you are inside a Typesque project to run the make:middleware command`);
        return;
    };
    if (!isAcceptedName(name, type)) return;
    name = getFormattedName(name, cmd, type);
    name = _.camelCase(name);
    let templateFile = path.join(__dirname, '..', 'templates', `${type}.tsq`);
    let destinationFile = path.join(process.cwd(), 'src', 'app', `${pluralize(type)}`, `${name}.ts`);
    if(await destinationExists(destinationFile)) return;
    let template = await fs.readFile(templateFile, 'utf-8');
    template = template.replace(/\$\$middlewareName\$\$/g, name);
    await fs.writeFile(destinationFile, template);
    console.log(`${chalk.green('√ Created '+type+':')} ${name} `);
}

function makeEHandler(name: string, cmd:any){
  console.log('My e handler:'+ name)
}


async function serve(name: string, cmd:any){
    if(!await isTypesqueProject()){
        console.error(`${chalk.bgRed(" ERROR ")} Make sure you are inside a Typesque project to run the serve command`);
        return;
    };
    console.log(`Feature will be available soon use ${chalk.blue("npm run start:dev")} or ${chalk.blue("npm run start")} instead`)
}