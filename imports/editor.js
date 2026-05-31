import source from '../source.js';
import fs from 'fs/promises';

const baseUrl = 'https://arknights.wiki.gg/api.php';

let cookies = '';

const delay = () => new Promise(resolve => setTimeout(resolve, 1000));

/** 
 * Execute edit action on wiki page.
 * @param {object} data The source code needed to be uploaded to wiki, including config & other params sepcified below.
 * @param {string} data.page_name The name of the page that needs to be modified, the page can be not yet created.
 * @param {string} data.wikitext The wikitext needs to be uploaded to the page
 * @param {string} data.summary The comment you want to leave for this edit, maybe you want to indicate that this is a bot edit.
 * @returns {Promise<object>} The edit result rertrieved from the wiki.
 */
export async function edit (data) {
    try {
        await login();
        await delay();
        const editToken = await getToken('csrf');
        await delay();
        const params = new URLSearchParams({
            action: 'edit',
            title: data.page_name,
            text: data.wikitext,
            summary: "[Ptilopsis]" + data.summary,
            bot: true,
            minor: true,
            token: editToken,
            format: 'json'
        });
        const response = await fetch(baseUrl + "?", {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookies,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'Origin': 'https://arknights.wiki.gg',
                'Referer': `https://arknights.wiki.gg/wiki/${encodeURIComponent(data.page_name)}`,
                'Accept': 'application/json, */*',
                'Accept-Encoding': 'gzip, deflate, br',
                'X-Requested-With': 'XMLHttpRequest',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin'
            }
        });
        const result = await response.json();
        if (result.edit && result.edit.result === 'Success') {
            console.log(`Edit successful:`, result);
            return {
                success: true,
                newRevId: result.edit.newrevid
            };
        } else {
            console.error('Edit failed:', result);
            return {
                success: false,
                error: result.error || result.edit
            };
        }
    } catch (error) {
        console.error('Edit error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Upload a local file to wiki.
 * @param {string} path The path of the file to be uploaded.
 * @param {string} name The presented file name on wiki.
 * @return {Promise<Object>} The result of the upload.
 */
export async function uploadFromLocal (path, name) {
    try {
        await login();
        await delay();
        const uploadToken = await getToken('csrf');
        await delay();
        const fileContent = await fs.readFile(path);
        const fileName = name.replace("File:", "");
        const queryParams = new URLSearchParams({
            action: 'upload',
            format: 'json'
        });
        const formData = new FormData();
        formData.append('filename', fileName);
        formData.append('token', uploadToken);
        formData.append('ignorewarnings', '1');
        formData.append('file', new Blob([fileContent]), fileName);
        const response = await fetch(baseUrl + "?" + queryParams, {
            method: 'POST',
            body: formData,
            headers: {
                'Cookie': cookies,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'Origin': 'https://arknights.wiki.gg',
                'Referer': 'https://arknights.wiki.gg/wiki/Special:Upload',
                'Accept': 'application/json, */*',
                'Accept-Encoding': 'gzip, deflate, br',
                'X-Requested-With': 'XMLHttpRequest',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin'
            }
        });
        const result = await response.json();
        if (result.upload && result.upload.result === 'Success') {
            console.log(`Upload successful: ${fileName}`);
            return {
                success: true,
                result: result.upload
            };
        } else {
            console.error('Upload failed:', result);
            return {
                success: false,
                error: result.error || result.upload
            };
        }
    } catch (err) {
        console.error(err);
        return {
            success: false,
            error: err.message
        };
    }
}


/**
 * Upload file to wiki.
 * @param {string} file_name The name of the file to be uploaded.
 * @param {string} file_url The url of a file that is publicly accessible.
 */
export async function upload (file_name, file_url) {
    try {
        await login();
        await delay();
        const uploadToken = await getToken('csrf');
        await delay();
        const params = {
            action: 'upload',
            format: 'json',
            filename: file_name.replace("File:", ""),
            url: file_url,
            token: uploadToken,
            ignorewarnings: 1
        }
        const temp = {
            token: uploadToken
        }
        const response = await fetch(baseUrl + "?" + new URLSearchParams(params), {
            method: 'POST',
            body: temp,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookies,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'Origin': 'https://arknights.wiki.gg',
                'Referer': 'https://arknights.wiki.gg/wiki/Special:Upload',
                'Accept': 'application/json, */*',
                'Accept-Encoding': 'gzip, deflate, br',
                'X-Requested-With': 'XMLHttpRequest',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin'
            }
        });
        const result = await response.json();
        if (result.upload && result.upload.result === 'Success') {
            console.log(`Upload successful: ${file_name}`);
        }
        return result;
    } catch (err) {
        console.error(err);
    }
}

/**
 * Remove an existing page on wiki.
 * @param {string} page_name The certain wiki page name on wiki.
 * @param {string} reason The reason why this page/file is tend to be removed.
 */
export async function remove (page_name, reason) {
    try {
        await login();
        await delay();
        const csrfToken = await getToken('csrf');
        await delay();
        const params = {
            action: "delete",
            title: page_name,
            reason: reason,
            token: csrfToken,
            format: "json"
        }
        const temp = {
            token: csrfToken
        }
        const response = await fetch(baseUrl + "?" + new URLSearchParams(params), {
            method: 'POST',
            body: temp,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookies,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'Origin': 'https://arknights.wiki.gg',
                'Referer': 'https://arknights.wiki.gg/wiki/Special:Upload',
                'Accept': 'application/json, */*',
                'Accept-Encoding': 'gzip, deflate, br',
                'X-Requested-With': 'XMLHttpRequest',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin'
            }
        });
        const result = await response.json();
        return result;
    } catch (err) {
        console.error(err);
    }
}

async function login () {
    await setCookies();
    const loginToken = await getToken('login');
    const lgParams = new URLSearchParams({
        action: 'login',
        lgname: source.env("wiki_username"),
        lgpassword: source.env("wiki_password"),
        lgtoken: loginToken,
        format: 'json'
    });
    const lgResponse = await fetch(baseUrl + "?", {
        method: 'POST',
        body: lgParams,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookies,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
            'Origin': 'https://arknights.wiki.gg',
            'Referer': 'https://arknights.wiki.gg/w/index.php?title=Special:UserLogin',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
            'Connection': 'keep-alive',
            'X-Requested-With': 'XMLHttpRequest',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
            'TE': 'trailers'
        }
    });
    const ck = lgResponse.headers.getSetCookie();
    cookies = ck;
    return;
}


async function setCookies () {
    const lgParams = new URLSearchParams({
        action: 'login',
        lgname: 'xxx',
        lgpassword: 'xxx',
        logintoken: 'xxx',
        format: 'json'
    });
    const getResponse = await fetch(baseUrl, {
        method: 'POST',
        body: lgParams,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',    
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0'
        }
    });
    const ck = getResponse.headers.getSetCookie();
    cookies = ck;
    return;
}


/**
 * You will retrieve an acess token from this.
 * @param {string} type The type of token you want to retrieve from the wiki, it could either be 'login' or 'csrf', 'csrf' for the majorities of the cases.
 * @returns {Promise<string>} The eventual token retrieved from the wiki, it is not processed by encodeURIComponents().
 */
async function getToken (type) {
    const tkParams = new URLSearchParams({
        action: 'query',
        meta: 'tokens',
        type: type,
        format: 'json'
    });
    // Construct proper URL with parameters
    const tokenUrl = `${baseUrl}?${tkParams.toString()}`;
    const response = await fetch(tokenUrl, {
        headers: {
            'Cookie': cookies,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
        }
    });
    const result = await response.json();
    const rawToken = result.query.tokens[`${type}token`];
    return rawToken;
}

// only for test use