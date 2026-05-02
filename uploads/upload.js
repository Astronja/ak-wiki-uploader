import wiki from "../imports/getwiki.js";
import { edit } from "../imports/editor.js";
import source from "../source.js";
import template from "../utils/template.js";


export default class Upload {
    constructor (tasks) {
        this.tasks = tasks;
        this.data = {};
    }

    async init () {
        this.data.operators = {};
        for (let task of this.tasks) {
            if (this.data.operators[task.page]) continue;
            if (!(await source.isOperatorFileExist(task.page))) await source.writeOperatorFile(task.page);
            this.data.operators[task.page] = await source.readOperatorFile(task.page);
        }
    }
    
    async upload () {
        for (let task of this.tasks) {
            switch (task.type) {
                case 'opmain':
                    await this.upOpMain(task.page);
                    break;
                case 'opfile':
                    await this.upOpFile(task.page);
                    break;
                case 'opgal':
                    await this.upOpGallery(task.page);
                    break;
                case 'opdial':
                    await this.upOpDialogue(task.page);
                    break;
                case 'opgalskin':
                    await this.uploadOpSkin(task.page);
                    break;
                default:
                    break;
            }
        }
    }


    /**
     * Update the gallery page of the operator with skins information, with original content read
     * @param {string} name The desired page name of the operator.
     * @return {Promise<string>} The result of the edit operation in JSON format.
     */
    async uploadOpSkin (name) {
        const data = this.data.operators[name];
        const original = await wiki.getWikiText(`${name}/Gallery`);
        const wikitext = template.op_gallery_skin(data, original, name);
        const editResult = await edit({
            page_name: `${name}/Gallery`,
            wikitext: wikitext,
            summary: `Update operator skins for ${name}`,
        });
        return `${JSON.stringify(editResult)}`;
    }

    /**
     * Override the main page of the operator without reading original content
     * @param {string} name The desired page name of the operator.
     * @return {Promise<string>} The result of the edit operation in JSON format.
     */
    async upOpMain (name) {
        const data = this.data.operators[name];
        const wikitext = template.op_main(data, name);
        const editResult = await edit({
            page_name: `${name}`,
            wikitext: wikitext,
            summary: `Upload operator main page for ${name}`,
        });
        return `${JSON.stringify(editResult)}`;
    }

    /**
     * Upload the file page of the operator
     * @param {string} name The desired page name of the operator.
     * @return {Promise<string>} The result of the edit operation in JSON format.
     */
    async upOpFile (name) {
        const original = await wiki.getWikiText(`${name}/File`);
        const data = this.data.operators[name].handbookInfo.storyTextAudio;
        const wikitext = template.op_file(data, original, name);
        const editResult = await edit({
            page_name: `${name}/File`,
            wikitext: wikitext,
            summary: `Upload operator files for ${name}`,
        });
        return `${JSON.stringify(editResult)}`;
    }

    /**
     * Upload the gallery page of the operator
     * @param {string} name The desired page name of the operator.
     * @return {Promise<string>} The result of the edit operation in JSON format.
     */
    async upOpGallery (name) {
        const data = this.data.operators[name].charSkins;
        let noe2 = false;
        if (data.length == 1) noe2 = true;
        const wikitext = template.op_gallery(name, noe2);
        const editResult = await edit({
            page_name: `${name}/Gallery`,
            wikitext: wikitext,
            summary: `Upload operator gallery for ${name}`,
        });
        return `${JSON.stringify(editResult, null, 2)}`;
    }

    /**
     * Upload the dialogue page of the operator
     * @param {string} name The desired page name of the operator.
     * @return {Promise<string>} The result of the edit operation in JSON format.
     */
    async upOpDialogue (name) {
        const data = this.data.operators[name].charWords;
        const wikitext = template.op_dialogue(name, data);
        const editResult = await edit({
            page_name: `${name}/Dialogue`,
            wikitext: wikitext,
            summary: `Upload operator dialogues for ${name}`,
        });
        return `${JSON.stringify(editResult)}`;
    }

    /**
     * Upload the operator introduction to the file page
     * @param {string} name The official Chinese name of the operator.
     * @return {Promise<string>} The result of the edit operation in JSON format, or an error message if the operator does not exist in the reference sheet.
     */
    async upOpIntro (name) {
        const result = template.op_intro(this.data);
        if (await source.readReference(result.name) != undefined) {
            const enOpName = await source.readReference(result.name);
            const editResult = await edit({
                page_name: `${enOpName}/File`,
                wikitext: result.wikitext,
                summary: `Upload operator introduction for ${result.name}`,
            });
            return `\`\`\`${JSON.stringify(editResult, null, 2)}\`\`\``;
        } else {
            console.log(`No such operator named "${result.name}" exist in reference sheet.`);
            return `No such operator named "${result.name}" exist in reference sheet.`;
        }
    }
}