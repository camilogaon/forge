const appName: string = "Forge";
const command: string | undefined = process.argv[2];

if (command === undefined || command === "help") {
  console.log(appName + " - local repository inspector");
  console.log("");
  console.log("Usage: forge <command>");
  console.log("");
  console.log("Commands:");
  console.log("  help    Show how to use Forge");
} else {
  console.error("Unknown command: " + command);
  process.exitCode = 1;
}