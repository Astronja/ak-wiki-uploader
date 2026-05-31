const url = 'https://arknights.wiki.gg/api.php?';

export default class /*GetWiki*/ wiki {

    static async getWikiText (page_name) {
        const params = {
            action: 'parse',
            prop: 'wikitext',
            page: page_name,
            format: 'json'
        }
        const response = await (await fetch(url + new URLSearchParams(params))).json();
        if (response.error) {
            return response.error.info;
        } else {
            return response.parse.wikitext["*"];
        }
    }
    
    static async listCategoryMembers (category_name) {
        if (!category_name.startsWith('Category:')) {
            category_name = 'Category:' + category_name;
        }
        const params = {
            action: 'query',
            list: 'categorymembers',
            cmtitle: category_name,
            cmlimit: 500,
            format: 'json'
        }
        const response = await (await fetch(url + new URLSearchParams(params))).json();
        console.log(url + new URLSearchParams(params));
        if (response.error) {
            return response.error.info;
        } else {
            return response.query.categorymembers;
        }
    }
    
    static async getImageURL (file_name) {
        
        let fn = file_name.replace(".png", "");
        if (!file_name.startsWith('File:')) {
            fn = 'File:' + fn;
        }
        const params = {
            action: 'query',
            prop: 'imageinfo',
            titles: fn + ".png",
            iiprop: 'url',
            format: 'json'
        }
        const response = await (await fetch(url + new URLSearchParams(params))).json();
        if (response.error) {
            return response.error.info;
        } else {
            const pageid = Object.keys(response.query.pages)[0];
            return response.query.pages[pageid].imageinfo[0].url;
        }
    }

    static async getInfo(page_name) {
        const params = {
            action: 'parse',
            page: page_name,
            format: 'json'
        }
        const response = await (await fetch(url + new URLSearchParams(params))).json();
        if (response.error) {
            return response.error.info;
        } else {
            let result = {};
            for (let item of response.parse.properties) {
                if (item.name == 'description') {
                    result.desc = item['*'];
                } else if (item.name == 'page_image_free') {
                    console.log(item['*']);
                    result.thumbnail = await this.getImageURL(item['*']);
                }
            }
            return result;
        }
    }
}

// For testing use only
async function test () {
    console.log(await wiki.getInfo("Pramanix"));
}

//test();