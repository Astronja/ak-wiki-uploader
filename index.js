import Upload from "./uploads/upload.js";
import source from "./source.js";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


(async () => {
    const upload = new Upload(await source.readTasks());
    await upload.init();
    await upload.upload();
})();