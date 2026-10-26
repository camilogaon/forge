# Forge

Forge is a local command-line tool for inspecting a repository and finding evidence in its files.

It can list a directory, read a text file, and search for text. It does not call an AI model, and it does not modify files.

## Requirements

- Node.js 24
- npm 11

## Setup

    npm install
    npm test

`npm test` compiles TypeScript and runs the tests against the JavaScript in `dist`.

To use the `forge` command from any directory:

    npm link

Without that link, run the compiled program directly:

    npm run build
    node dist/index.js help

## Commands

    forge help
    forge inspect K:\forge 2
    forge read K:\forge\package.json
    forge search K:\forge readSourceFile
    forge ask K:\forge readSourceFile

Replace `K:\forge` with the directory you want to inspect.

`inspect` lists entries up to the given depth. The default depth is 1. `search` looks for text and its default depth is 5. Both accept a depth from 1 to 5.

## Limits

- `inspect` hides `node_modules` and `.git`.
- `search` also hides `dist`, because those files are generated from `src`.
- `read` and `search` refuse files larger than 100000 bytes.
- Search is case-sensitive.
- A binary file can still be printed as broken text. Forge does not detect file types yet.

## Status

Version 0.1.0 is an early slice of the tool. `ask` only reports lines that contain the given text. It does not answer open questions, and it does not use an AI model.