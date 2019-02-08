"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var chalk_1 = __importDefault(require("chalk"));
var pluralize_1 = __importDefault(require("pluralize"));
function isAcceptedName(name, type) {
    if (type === void 0) { type = ""; }
    name = name.replace(new RegExp(type, "gi"), "");
    var pattern = /(?:[^a-zA-Z0-9\-])/g;
    if (name.match(pattern)) {
        var unWantedChars = /(?:[^a-zA-Z0-9])/.exec(name);
        console.error(chalk_1.default.bgRed(" ERROR ") + " The character " + unWantedChars + " is not accepted in a " + type + " name");
        return;
    }
    else {
        return true;
    }
}
exports.isAcceptedName = isAcceptedName;
function getFormattedName(name, cmd, type) {
    if (type === void 0) { type = ""; }
    var names = name.split(/(?=[A-Z])|\-/g);
    if (cmd.plural) {
        names = names.map(function (name) { return lodash_1.default.capitalize(name); });
        var lastName = names[names.length - 1];
        names[names.length - 1] = pluralize_1.default(lastName);
    }
    else {
        names = names.map(function (name) { return lodash_1.default.capitalize(name); });
    }
    name = names.join("").replace(/\-/g, "") + lodash_1.default.capitalize(type);
    return name;
}
exports.getFormattedName = getFormattedName;
