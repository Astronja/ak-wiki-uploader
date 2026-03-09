import fs from 'fs/promises';

export default async function reference (name) {
    const file = JSON.parse(await fs.readFile('./Ptilopsis/sources/reference.json', 'utf8'));
    return file[name];
}