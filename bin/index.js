#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("commander"));
var pluralize_1 = __importDefault(require("pluralize"));
var lodash_1 = __importDefault(require("lodash"));
var path = __importStar(require("path"));
var main_1 = require("../main");
commander_1.default
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
    .action(makeEHandler);
commander_1.default.parse(process.argv);
function newProject(name, cmd) {
}
function makeModel(name, cmd) {
    if (cmd.plural) {
        name = lodash_1.default.capitalize(pluralize_1.default(name));
    }
    else {
        name = lodash_1.default.capitalize(pluralize_1.default.singular(name));
    }
}
function makeController(name, cmd) {
    var type = 'controller';
    if (!main_1.isAcceptedName(name, type))
        return;
    name = main_1.getFormattedName(name, cmd, type);
    var fileLocation = path.join(process.cwd(), 'src', 'app', type, name + ".ts");
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
function makeMiddleware(name, cmd) {
}
function makeEHandler(name, cmd) {
    console.log('My e handler:' + name);
}
