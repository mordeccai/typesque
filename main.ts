import _ from 'lodash';
import chalk from 'chalk';
import pluralize from 'pluralize';

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

export function getFormattedName(name: string, cmd: any, type: any=""): string {
    let names = name.split(/(?=[A-Z])|\-/g);
    if(cmd.plural){
        names = names.map((name)=> _.capitalize(name));
        let lastName = names[names.length -1];
        names[names.length -1]= pluralize(lastName);
    } else {
        names = names.map((name)=> _.capitalize(name));
    }
    name = names.join("").replace(/\-/g, "")+_.capitalize(type);
    return name;
}