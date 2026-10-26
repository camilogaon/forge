export type ForgeCommand = {
  name: string;
  usage: string;
  description: string;
};

export const commands: ForgeCommand[] = [
  {
    name: "help",
    usage: "help",
    description: "Show how to use Forge",
  },
  {
    name: "inspect",
    usage: "inspect <directory> [depth]",
    description: "List entries up to a depth from 1 to 5",
  },
  {
    name: "read",
    usage: "read <file>",
    description: "Show the text inside a file",
  },
  {
    name: "search",
    usage: "search <directory> <text> [depth]",
    description: "Find text up to a depth of 5",
  },
];