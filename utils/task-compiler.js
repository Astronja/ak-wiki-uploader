import source from "../source.js";

export default async function compileTask (operator) {
    /*
    await source.pushTask({
        uploadtype: "operator_main",
        opname: operator,
    });
    */
    await source.pushTask({
        uploadtype: "operator_file",
        opname: operator,
    });
    await source.pushTask({
        uploadtype: "operator_dialogue",
        opname: operator,
    });
    await source.pushTask({
        uploadtype: "operator_gallery",
        opname: operator,
    });
}

async function start () {
    await compileTask("Varkaris");
    await compileTask("Perfumer the Distilled");
    await compileTask("Titi");
}

//start();