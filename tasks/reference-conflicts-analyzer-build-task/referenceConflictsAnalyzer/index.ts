import * as child_process from "child_process";
import * as path from "path";
import * as fs from "fs";
import { reportConflicts } from "./conflictReporter";
import { convertDgmlToImage } from "./dgmlToImageConverter";

const executeReferenceConflictsAnalyzerCli = async (workingFolder: string, pathOfFileToAnalyze: string, ignoreSystemAssemblies: boolean, pathOfConfigFile?: string) => {
    const cliPath = path.resolve(workingFolder, "ReferenceConflictAnalyzer.CommandLine.exe");
    let commandToExecute = `${cliPath} -file="${pathOfFileToAnalyze}"`;

    if (pathOfConfigFile) {
        commandToExecute = `${commandToExecute} -config="${pathOfConfigFile}"`;
    }

    if (!ignoreSystemAssemblies) {
        commandToExecute = `${commandToExecute} -ignoreSystemAssemblies`;
    }

    commandToExecute = `${commandToExecute} -output="${workingFolder}"`;

    return new Promise((resolve, reject) => {
        console.log(`Executing command: ${commandToExecute}`);
        child_process.exec(commandToExecute, (error: Error, stdout: string) => {
            if (error) {
                reject(error);
            }

            console.log(stdout);
            resolve();
        });
    });
};

export const analyzeReferenceConflicts =
    async (workingFolder: string, taskDisplayName: string, treatConflictsAs: string, pathOfFileToAnalyze: string, ignoreSystemAssemblies: boolean, pathOfConfigFile?: string) => {
        console.log("Running reference conflicts analyzer...");

        await executeReferenceConflictsAnalyzerCli(workingFolder, pathOfFileToAnalyze, ignoreSystemAssemblies, pathOfConfigFile);

        const files = fs.readdirSync(workingFolder);

        for (const file of files) {
            if (file.endsWith(".dgml")) {
                console.log(path.resolve(workingFolder, file));
                fs.renameSync(path.resolve(workingFolder, file), path.resolve(workingFolder, "rca.dgml"));
                reportConflicts(workingFolder, treatConflictsAs);
                await convertDgmlToImage(workingFolder, taskDisplayName);
            }
        }
    };
