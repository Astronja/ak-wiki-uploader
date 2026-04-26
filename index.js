import Upload from "./uploads/upload.js";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    const upload = new Upload({
        operators: ["Botani", "Ukusik", "Zima_the_Raging_Tide"]
    });
    await upload.init();
    await upload.upload();
})();