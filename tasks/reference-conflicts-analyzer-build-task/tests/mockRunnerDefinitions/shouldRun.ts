import runTestTask from "./shared/testTaskRunner";
import * as path from "path";

runTestTask({
    workingFolder: path.resolve(__dirname, "..", "shouldRun")
});