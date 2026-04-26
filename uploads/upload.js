import wiki from "../imports/getwiki.js";
import { edit } from "../imports/editor.js";
import source from "../source.js";
import template from "../utils/template.js";


export default class Upload {
    constructor (task) {
        this.task = task;
        this.data = {};
    }

    async init () {
        this.data.operators = {};
        for (let op of this.task.operators) {
            this.data.operators[op] = await source.readOperatorFile(op);
        }
    }
    
    /**
     * @param {Object} config - The configuration object for the upload process.
     * @param {boolean} config.upMain - Whether to upload the main page.
     * @param {boolean} config.upFile - Whether to upload the file page.
     * @param {boolean} config.upGallery - Whether to upload the gallery page.
     * @param {boolean} config.upDialogue - Whether to upload the dialogue page.
     */
    async upload (config) {
        for (let op of this.task.operators) {
            console.log(`Uploading ${op}...`);

            if (config) {
                if (config.upMain) await this.upOpMain(op);
                if (config.upFile) await this.upOpFile(op);
                if (config.upGallery) await this.upOpGallery(op);
                if (config.upDialogue) await this.upOpDialogue(op);
            } else {
                console.log(await this.upOpMain(op));
                //console.log(await this.upOpFile(op));
                //console.log(await this.upOpGallery(op));
                //console.log(await this.upOpDialogue(op));
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
        const wikitext = template.op_gallery_skin(name, data, original);
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