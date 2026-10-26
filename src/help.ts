const appName: string = "Forge";

export function showHelp(): void {
  console.log(appName + " - local repository inspector");
  console.log("");
  console.log("Usage: forge <command>");
  console.log("");
  console.log("Commands:");
  console.log("  help                 Show how to use Forge");
  console.log("  inspect <directory> [depth]  List entries up to a depth from 1 to 5");
}