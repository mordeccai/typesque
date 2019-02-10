#!/usr/bin/env node
import program from 'commander';
import pluralize from 'pluralize';
import _ from 'lodash';
import * as  path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import { isAcceptedName, getFormattedName, destinationExists } from '../main';
const ora = require('ora');


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
  .command('make:ehandler <name>')
  .action(makeEHandler)
 
program.parse(process.argv)

function newProject(name: string, cmd: any){
    const git = require('simple-git/promise')(process.cwd()).silent(true);
    const spinner = ora('Creating project').start('Cloning project blueprint');
    git.clone('https://github.com/mordeccai/sequelize-typescript-api-starter.git', name).then(()=> {
        spinner.succeed(`Project ${chalk.green(name)} created successfully`)
    }).catch((err: any)=>{
        spinner.fail('Failed to load clone the project. Please check your connection');
    }); 
}

async function makeModel(name: string, cmd: any){
    let type = 'model';
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
    console.log(`${chalk.green('🗸 Created '+type+':')} ${name} `);
}

async function makeController(name: string, cmd: any){
    let type = 'controller';
    if (!isAcceptedName(name, type)) return;
    name = getFormattedName(name, cmd, type, true);
    let templateFile = path.join(__dirname, '..', 'templates', `${type}.tsq`);
    let destinationFile = path.join(process.cwd(), 'src', 'app', `${pluralize(type)}`, `${name}.ts`);
    if(await destinationExists(destinationFile)) return;
    let template = await fs.readFile(templateFile, 'utf-8');
    template = template.replace(/\$\$controllerName\$\$/g, name);
    await fs.writeFile(destinationFile, template);
    console.log(`${chalk.green('🗸 Created '+type+':')} ${name} `);
}

async function makeMiddleware(name:string, cmd:any){
    let type = 'middleware';
    if (!isAcceptedName(name, type)) return;
    name = getFormattedName(name, cmd, type);
    name = _.camelCase(name);
    let templateFile = path.join(__dirname, '..', 'templates', `${type}.tsq`);
    let destinationFile = path.join(process.cwd(), 'src', 'app', `${pluralize(type)}`, `${name}.ts`);
    if(await destinationExists(destinationFile)) return;
    let template = await fs.readFile(templateFile, 'utf-8');
    template = template.replace(/\$\$middlewareName\$\$/g, name);
    await fs.writeFile(destinationFile, template);
    console.log(`${chalk.green('🗸 Created '+type+':')} ${name} `);
}

function makeEHandler(name: string, cmd:any){
  console.log('My e handler:'+ name)
}