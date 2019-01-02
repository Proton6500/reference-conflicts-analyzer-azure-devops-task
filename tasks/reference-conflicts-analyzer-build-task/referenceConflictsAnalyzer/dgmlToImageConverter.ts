import * as path from "path";
import * as child_process from "child_process";
// import * as tl from "azure-pipelines-task-lib/task";

export const convertDgmlToImage = async (workingFolder: string, taskDisplayName: string) => {
    const commandToExecute =
        `${path.resolve(workingFolder, "DgmlImage.1.0.0", "tools", "DgmlImage.exe")} "${path.resolve(workingFolder, "rca.dgml")}" /f:jpg /legend /out:"${workingFolder}"`;

    return new Promise((resolve, reject) => {
        console.log(`Executing command: ${commandToExecute}`);
        child_process.exec(commandToExecute, (error: Error, stdout: string) => {
            if (error) {
                reject(error);
            }

            console.log(stdout);

            // tl.addAttachment("jpg", taskDisplayName, path.resolve(workingFolder, "rca.jpg"));

            resolve();
        });
    });
};
