import * as fs from "fs";
import * as os from "os";
import version from "./version";

function updateVersionInackageJsonFile(packageJsonFilePath: string): void {
    const packageJsonContent = fs.readFileSync(packageJsonFilePath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);

    packageJson.version = version;

    fs.writeFileSync(packageJsonFilePath, JSON.stringify(packageJson, null, 2).concat(os.EOL));
}

function updateVersionInVssExtensionJsonFile(vssExtensionJsonFilePath: string): void {
    const vssExtensionJsonContent = fs.readFileSync(vssExtensionJsonFilePath, "utf8");
    const vssExtensionJson = JSON.parse(vssExtensionJsonContent);

    vssExtensionJson.version = version.split("-")[0];

    fs.writeFileSync(vssExtensionJsonFilePath, JSON.stringify(vssExtensionJson, null, 4).concat(os.EOL));
}

function updateVersionInTaskJsonFile(taskJsonFilePath: string): void {
    const taskJsonContent = fs.readFileSync(taskJsonFilePath, "utf8");
    const taskJson = JSON.parse(taskJsonContent);

    const splittedVersion = version.split(".");
    taskJson.version.Major = Number(splittedVersion[0]);
    taskJson.version.Minor = Number(splittedVersion[1]);
    taskJson.version.Patch = Number(splittedVersion[2].split("-")[0]);

    const Preview = "Preview";

    if (version.split("-").length > 1 && !taskJson.visibility.includes(Preview)) {
        taskJson.visibility.push(Preview);
    }

    if (version.split("-").length === 1 && taskJson.visibility.includes(Preview)) {
        const index = taskJson.visibility.indexOf(Preview, 0);

        if (index > -1) {
            taskJson.visibility.splice(index, 1);
        }
    }

    fs.writeFileSync(taskJsonFilePath, JSON.stringify(taskJson, null, 4).concat(os.EOL));
}

updateVersionInackageJsonFile("./package.json");
updateVersionInackageJsonFile("./tasks/reference-conflicts-analyzer-build-task/package.json");
updateVersionInVssExtensionJsonFile("./vss-extension.json");
updateVersionInTaskJsonFile("./tasks/reference-conflicts-analyzer-build-task/task.json");
