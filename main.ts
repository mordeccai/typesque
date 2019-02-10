import _ from 'lodash';
import chalk from 'chalk';
import pluralize from 'pluralize';
import fs from 'fs-extra';

export function isAcceptedName(name: string, type: string=""){
    name = name.replace(new RegExp(type, "gi"), "")
    let pattern = /(?:[^a-zA-Z0-9\-])/g;
    if(name.match(pattern)) {
        let unWantedChars = /(?:[^a-zA-Z0-9])/.exec(name);
        console.error(`${chalk.bgRed(" ERROR ")} The character ${unWantedChars} is not accepted in a ${type} name`)
        return 
    } else {
        return true;
    }
}

export async function destinationExists(destinationFile: string): Promise<boolean> {
    if(await fs.pathExists(destinationFile)){
        console.error(`${chalk.bgRed(" ERROR ")} ${destinationFile} already exists`)
        return true;
    } else {
        return false;
    }
}

export function getFormattedName(name: string, cmd: any, type: any="", appendType=false): string {
    let lowerCased = ["middleware"];
    let names = name.split(/(?=[A-Z])|\-/g);
    if(cmd.plural){
        names = names.map((name)=> _.capitalize(name));
        let lastName = names[names.length -1];
        if(lowerCased.includes(type)) names[0] = _.lowerCase(names[0]);
        names[names.length -1]= pluralize(lastName);
    } else {
        names = names.map((name)=> _.capitalize(name));
        let lastName = names[names.length -1];
        if(lowerCased.includes(type)) names[0] = _.lowerCase(names[0]);
        names[names.length -1] = pluralize.singular(lastName);
    }

    if(appendType){
        name = names.join("").replace(/\-/g, "")+_.capitalize(type);
    } else {
        name = names.join("").replace(/\-/g, "");
    }
    
    return name;
}