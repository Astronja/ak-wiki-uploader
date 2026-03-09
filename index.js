import Upload from "./uploads/upload.js";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    const upload = new Upload({
        operators: ["Ripresa", "Bellone"]
    });
    await upload.init();
    //await delay(1000);
    await upload.upload();
})();