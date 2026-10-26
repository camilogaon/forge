import { commands, type ForgeCommand } from "./commands";

export function showHelp(): void {
  console.log("Forge - local repository inspector");
  console.log("");
  console.log("Usage: forge <command>");
  console.log("");
  console.log("Commands:");

  for (const command of commands) {
    console.log(formatCommand(command));
  }
}

function formatCommand(command: ForgeCommand): string {
  const columnWidth: number = 34;
  let padding: number = columnWidth - command.usage.length;

  if (padding < 1) {
    padding = 1;
  }

  return "  " + command.usage + " ".repeat(padding) + command.description;
}