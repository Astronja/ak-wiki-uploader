import closure from './imports/closure-wiki.js';
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

export default class source {
    static env (key) {
        console.log(`${key}: ${process.env[key]}`);
        return process.env[key];
    }

    static async getTasks () {
        return JSON.parse(await fs.readFile("./tasks.json", 'utf8'));
    }

    static async writeTasks (obj) {
        await fs.writeFile("./tasks.json", JSON.stringify(obj, null, 2), 'utf8');
    }

    static async writeOperatorFile (operator) {
        const content = await closure.getOperatorData(operator);
        console.log(content);
        await fs.writeFile("./sources/buffers/operators/" + operator + ".json", JSON.stringify(content, null, 2), 'utf8');
        return true;
    }

    static async readOperatorFile (operator) {
        return JSON.parse(await fs.readFile("./sources/buffers/operators/" + operator.replace(".json", "") + ".json", 'utf8'));
    }

    static async readReference (name) {
        return JSON.parse(await fs.readFile("./sources/reference.json", 'utf8'))[name];
    }
}

/*
(async () => {
    await source.writeOperatorFile("Nasti");
})();
*/