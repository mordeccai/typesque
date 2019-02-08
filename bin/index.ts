#!/usr/bin/env node
import program from 'commander';
import pluralize from 'pluralize';
import _ from 'lodash';
import * as  path from 'path';
import chalk from 'chalk';
import { isAcceptedName, getFormattedName } from '../main';


  program
  .version('0.1.0', '-v --version')
  .description('A node framework on top of express with superpowers')
  .command('new <name>', 'Create a new typesque app')
  .action(newProject)
  .command('make:model <name>', 'Make a model')
  .option('-p --plural', 'Make the name plural')
  .action(makeModel)
  .command('make:controller <name>')
  .option('-p --plural', 'Make controller name plural')
  .action(makeController)
  .command('make:middleware <name>', 'Make a middleware')
  .action(makeMiddleware)
  .command('make:ehandler <name>')
  .action(makeEHandler)
 
program.parse(process.argv)

function newProject(name: string, cmd: any){

}

function makeModel(name: string, cmd: any){
  if(cmd.plural){
    name = _.capitalize(pluralize(name));
  } else {
    name = _.capitalize(pluralize.singular(name));
  }

}

function makeController(name: string, cmd: any){
    let type = 'controller';
    if (!isAcceptedName(name, type)) return;
    name = getFormattedName(name, cmd, type);
    let fileLocation = path.join(process.cwd(), 'src', 'app', `${type}s`, `${name}.ts`);
    console.log(fileLocation);
    
/*     if((_.last(names) as string).toLowerCase() == "controller") {
        
    }
    if(cmd.plural){
        name = _.capitalize(pluralize(name))+ 'Controller';
    } else {
        name = _.capitalize(pluralize.singular(name))+ 'Controller';
    }
  
  console.log(`New controller at: ${x}`); */

  /* fs.writeFile('', 'Hey there!', function(err) {
    if(err) {
        return console.log(err);
    }

    console.log('The file was saved!');
});  */
}

function makeMiddleware(name:string, cmd:any){

}

function makeEHandler(name: string, cmd:any){
  console.log('My e handler:'+ name)
}