#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var chalk_1 = __importDefault(require("chalk"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var main_1 = require("../main");
var ora = require('ora');
commander_1.default
    .version('0.1.0', '-v --version')
    .description('A node framework on top of express with superpowers');
commander_1.default
    .command('new <name>')
    .description('Create a new typesque project')
    .action(newProject);
commander_1.default
    .command('make:model <name>')
    .description('Make a model')
    .option('-p --plural', 'Make the name plural')
    .action(makeModel);
commander_1.default
    .command('make:controller <name>')
    .description('Make a controller')
    .option('-p --plural', 'Make controller name plural')
    .action(makeController);
commander_1.default
    .command('make:middleware <name>')
    .description('Make a middleware')
    .action(makeMiddleware);
commander_1.default
    .command('make:ehandler <name>')
    .action(makeEHandler);
commander_1.default.parse(process.argv);
function newProject(name, cmd) {
    var git = require('simple-git/promise')(process.cwd()).silent(true);
    var spinner = ora('Creating project').start('Cloning project blueprint');
    git.clone('https://github.com/mordeccai/sequelize-typescript-api-starter.git', name).then(function () {
        spinner.succeed("Project " + chalk_1.default.green(name) + " created successfully");
    }).catch(function (err) {
        spinner.fail('Failed to load clone the project. Please check your connection');
    });
}
function makeModel(name, cmd) {
    return __awaiter(this, void 0, void 0, function () {
        var type, templateFile, destinationFile, tableName, template;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    type = 'model';
                    if (!main_1.isAcceptedName(name, type))
                        return [2 /*return*/];
                    name = main_1.getFormattedName(name, cmd, type);
                    templateFile = path.join(__dirname, '..', 'templates', type + ".tsq");
                    destinationFile = path.join(process.cwd(), 'src', 'app', "" + pluralize_1.default(type), name + ".ts");
                    return [4 /*yield*/, main_1.destinationExists(destinationFile)];
                case 1:
                    if (_a.sent())
                        return [2 /*return*/];
                    tableName = name.split(/(?=[A-Z])|\-/g);
                    tableName[tableName.length - 1] = pluralize_1.default(tableName[tableName.length - 1]);
                    tableName = tableName.join('_').toLowerCase();
                    return [4 /*yield*/, fs_extra_1.default.readFile(templateFile, 'utf-8')];
                case 2:
                    template = _a.sent();
                    template = template.replace(/\$\$modelName\$\$/g, name);
                    template = template.replace(/\$\$tableName\$\$/g, tableName);
                    return [4 /*yield*/, fs_extra_1.default.writeFile(destinationFile, template)];
                case 3:
                    _a.sent();
                    console.log(chalk_1.default.green('🗸 Created ' + type + ':') + " " + name + " ");
                    return [2 /*return*/];
            }
        });
    });
}
function makeController(name, cmd) {
    return __awaiter(this, void 0, void 0, function () {
        var type, templateFile, destinationFile, template;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    type = 'controller';
                    if (!main_1.isAcceptedName(name, type))
                        return [2 /*return*/];
                    name = main_1.getFormattedName(name, cmd, type, true);
                    templateFile = path.join(__dirname, '..', 'templates', type + ".tsq");
                    destinationFile = path.join(process.cwd(), 'src', 'app', "" + pluralize_1.default(type), name + ".ts");
                    return [4 /*yield*/, main_1.destinationExists(destinationFile)];
                case 1:
                    if (_a.sent())
                        return [2 /*return*/];
                    return [4 /*yield*/, fs_extra_1.default.readFile(templateFile, 'utf-8')];
                case 2:
                    template = _a.sent();
                    template = template.replace(/\$\$controllerName\$\$/g, name);
                    return [4 /*yield*/, fs_extra_1.default.writeFile(destinationFile, template)];
                case 3:
                    _a.sent();
                    console.log(chalk_1.default.green('🗸 Created ' + type + ':') + " " + name + " ");
                    return [2 /*return*/];
            }
        });
    });
}
function makeMiddleware(name, cmd) {
    return __awaiter(this, void 0, void 0, function () {
        var type, templateFile, destinationFile, template;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    type = 'middleware';
                    if (!main_1.isAcceptedName(name, type))
                        return [2 /*return*/];
                    name = main_1.getFormattedName(name, cmd, type);
                    name = lodash_1.default.camelCase(name);
                    templateFile = path.join(__dirname, '..', 'templates', type + ".tsq");
                    destinationFile = path.join(process.cwd(), 'src', 'app', "" + pluralize_1.default(type), name + ".ts");
                    return [4 /*yield*/, main_1.destinationExists(destinationFile)];
                case 1:
                    if (_a.sent())
                        return [2 /*return*/];
                    return [4 /*yield*/, fs_extra_1.default.readFile(templateFile, 'utf-8')];
                case 2:
                    template = _a.sent();
                    template = template.replace(/\$\$middlewareName\$\$/g, name);
                    return [4 /*yield*/, fs_extra_1.default.writeFile(destinationFile, template)];
                case 3:
                    _a.sent();
                    console.log(chalk_1.default.green('🗸 Created ' + type + ':') + " " + name + " ");
                    return [2 /*return*/];
            }
        });
    });
}
function makeEHandler(name, cmd) {
    console.log('My e handler:' + name);
}
