/**
 * Closure Wiki API Wrapper
 * @version 0.2.1 (Nov 3, 2025)
 * @note The getModuleData method is currently unavailable and returns 404 (as of Nov 3, 2025)
 * @example
 * import closure from './closure-wiki.js';
 * const response = await closure.getCharPortrait("char_127_estell@epoque#50");
 * const response = await closure.getSkinData("char_127_estell@epoque#50");
 * const response = await closure.getOperatorData("Estelle");
 * const response = await closure.getModuleImage("uniequip_002_estell");
 * const response = await closure.getCharThumbnail("char_127_estell@epoque#50");
 */

import slugify from 'slugify';
const apiurl = "https://api.closure.wiki/v2/en/";
const staticurl = "https://static.closure.wiki/v2/";

export default class closure {
    /**
     * Get the url of the module image.
     * @param {string} moduleId The moduleId of the module.
     * @returns {Promise<string>} The url of the module image.
     */
    static async getModuleImage (moduleId) {
        const param = `modules/${encodeURIComponent(moduleId)}.png`;
        const response = await fetch(staticurl + param);
        const result = await handleResponse(response, 'png');
        return result.image;
    }

    /**
     * Get the url of the operation map preview.
     * @param {string} operationId The operationId of the operation.
     * @returns {Promise<string>} The url of the operation map preview.
     */
    static async getOperationMapPreview (operationId) {
        const param = `mappreviews/${encodeURIComponent(operationId)}.png`;
        const response = await fetch(staticurl + param);
        const result = await handleResponse(response, 'png');
        return result.image;
    }

    /**
     * Get the url of the enemy thumbnail.
     * @param {string} enemyId The enemyId of the enemy.
     * @returns {Promise<string>} The url of the enemy thumbnail.
     */
    static async getEnemyThumbnail (enemyId) {
        const param = `enemies/${encodeURIComponent(enemyId)}.png`;
        const response = await fetch(staticurl + param);
        const result = await handleResponse(response, 'png');
        return result.image;
    }

    /**
     * Get the url of the story background image.
     * @param {string} imageId The imageId of the story background image.
     * @returns {Promise<string>} The url of the story background image.
     */
    static async getStoryBackgroundImage (imageId) {
        const param = `avg/backgrounds/${encodeURIComponent(imageId)}.png`;
        const response = await fetch(staticurl + param);
        const result = await handleResponse(response, 'png');
        return result.image;
    }

    /**
     * Get the url of the story image.
     * @param {string} imageId The image imageId of the story image.
     * @returns {Promise<string>} The url of the story image.
     */
    static async getStoryImage (imageId) {
        const param = `avg/images/${encodeURIComponent(imageId)}.png`;
        const response = await fetch(staticurl + param);
        const result = await handleResponse(response, 'png');
        return result.image;
    }

    /**
     * Get the url of the operator portrait.
     * @param {string} ID The charId or the skinId of the operator.
     * @returns {Promise<string>} The url of the operator or skin portrait.
     */
    static async getCharPortrait (ID) {
        const param = `characters/${encodeURIComponent(ID.replaceAll("@", "_"))}.png`;
        const response = await fetch(staticurl + param);
        const result = await handleResponse(response, 'png');
        return result.image;
    }

    /**
     * Get the url of the operator thumbnail.
     * @param {string} ID The charId or the skinId of the operator.
     * @returns {Promise<string>} The url of the operator or skin thumbnail.
     */
    static async getCharThumbnail (ID) {
        const param = `charavatars/${encodeURIComponent(ID.replaceAll("@", "_"))}.png`;
        const response = await fetch(staticurl + param);
        const result = await handleResponse(response, 'png');
        return result.image;
    }

    /**
     * Gets data of operator by name.
     * @param {string} name The targeted operator name on Closure Wiki.
     * @returns {Promise<object>} The data of the targeted operator.
     */
    static async getOperatorData (name) {
        const param = `operators/${formatName(name)}`;
        const response = await fetch(apiurl + param);
        const result = await handleResponse(response, 'json');
        return result.data;
    }

    /**
     * Gets data of enemy by enemyId.
     * @param {string} enemyId The targeted enemyId in game files.
     * @returns {Promise<object>} The data of the targeted enemy.
     */
    static async getEnemyData (enemyId) {
        const param = `enemies/${encodeURIComponent(enemyId)}`;
        const response = await fetch(apiurl + param);
        const result = await handleResponse(response, 'json');
        return result.data;
    }

    /**
     * Gets data of operation by operationId.
     * @param {string} operationId The targeted operationId in game files.
     * @returns {Promise<object>} The data of the targeted operation.
     */
    static async getOperationData (operationId) {
        const param = `operations/${encodeURIComponent(operationId)}`;
        const response = await fetch(apiurl + param);
        const result = await handleResponse(response, 'json');
        return result.data;
    }

    /**
     * NOTE: THIS FUNCTION IS NOT AVAILABLE YET, IT WILL CONSISTENTLY RETURN 404. (Nov 3, 2025)
     * Gets data of module by moduleId.
     * @param {string} name The targeted moduleId on Closure Wiki.
     * @returns {Promise<object>} The data of the targeted module.
     */
    static async getModuleData (moduleId) {
        const param = `modules/${encodeURIComponent(moduleId)}`;
        const response = await fetch(apiurl + param);
        const result = await handleResponse(response, 'json');
        return result.data;
    }

    /**
     * Gets data of skin by skinId.
     * @param {string} skinId The targeted skinId in game files.
     * @returns {Promise<object>} The data of the targeted skinId.
     */
    static async getSkinData (skinId) {
        const param = `outfits/${encodeURIComponent(skinId)}`;
        const response = await fetch(apiurl + param);
        const result = await handleResponse(response, 'json');
        return result.data;
    }
}

/**
 * Formats the given string that functions as page name in closure.wiki.
 * @param {string} name The unformatted page name 
 * @returns {string} The formatted page name that is valid in closure.wiki
 */
const formatName = (name) => {
    switch (name) {
        case "Gummy":
            return "gum";
        case "Pozëmka":
            return "pozyomka";
        case "THRM-EX":
            return "thermal-ex";
    }
    const result = slugify(name.replaceAll(" ", ""), { lower: true, strict: true });
    return result;
}

/**
 * Reads result from the web response and return data, throws error is http code is not 200.
 * @param {object} response http response object created by fetch()
 * @param {string} dataType The type of data trying to obtain, available choices: 1. json 2. png 3. html
 * @returns {Promise<object>} Result from Closure Wiki, access result.data or result.url depending on your need.
 */
const handleResponse = async (response, dataType) => {
    let result = {};
    result.ok = response.ok;
    result.url = response.url;
    result.param = response.url.replace(apiurl, '').replace(staticurl, '');
    result.domain = response.url.replace(result.param, '');
    if (response.status != 200) {
        result.error = `${response.status} ${response.statusText}`;
        switch (response.status) {
            case 404:
                result.message = "Page or static resource not found, please check the availability of the page.";
                break;
            case 429:
                result.message = "Too many requests had been sent to Closure Wiki!";
                break;
            case 500: 
                result.message = "Something is wrong with Closure Wiki at this moment, please try again later!";
                break;
            default:
                result.message = "Unknown error occurred.";
                break;
        }
        throw new Error(`${result.error}\n${result.message}\nRequest URL: ${result.url}`);
    } else {
        switch (dataType) {
            case "json":
                result.data = await response.json();
                break;
            case "png":
                result.image = result.url;
                break;
            case "html":
                result.html = await result.text();
                break;
            default:
                result.error = "[Closure] Unsupported data";
                result.message = `Invalid data type "${dataType}" declared, available data types are 1. "json", 2. "png", 3. "html".`;
                throw new Error(`${result.error}\n${result.message}\nRequest URL: ${result.url}`);
        }
    }
    return result;
}