import fs from 'fs/promises';

import source from './source.js';


let newops = [];
let newskins = [];

class Compiler {

    static compile (sections) {
        let list = []; 
        for (let op of sections[0]) {
            list.push(...this.newop(op));
        }
        for (let skin of sections[1]) {
            list.push(...this.newskin(skin));
        }
        return list;
    }

    static newop (name) {
        return [
            {
                type: "opmain",
                page: name
            },
            {
                type: "opfile",
                page: name
            },
            {
                type: "opgal",
                page: name
            },
            {
                type: "opdial",
                page: name
            },
        ];
    }

    static newskin (name) {
        return [{
            type: "opgalskin",
            page: name
        }];
    }
}


async function interpret (txt) {
    let sections = txt.split("===");
    for (var i = 0; i < sections.length; i++) {
        sections[i] = sections[i].split("\n").filter(line => line.trim() !== "");
    }
    return sections;
}

async function main () {
    const file = await fs.readFile('./event.txt', 'utf-8');
    const analyzed = await interpret(file);
    const compiled = Compiler.compile(analyzed);
    await source.writeTasks(compiled);
    console.log(compiled);
}

await main();
console.log("Compilation complete!");
