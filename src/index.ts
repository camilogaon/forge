import { showHelp } from "./help";
import { inspectDirectory } from "./inspect";

const command: string | undefined = process.argv[2];
const targetPath: string | undefined = process.argv[3];

if (command === undefined || command === "help") {
  showHelp();
} else if (command === "inspect") {
  if (targetPath === undefined) {
    console.error("Usage: forge inspect <directory>");
    process.exitCode = 1;
  } else {
    inspectDirectory(targetPath);
  }
} else {
  console.error("Unknown command: " + command);
  process.exitCode = 1;
}