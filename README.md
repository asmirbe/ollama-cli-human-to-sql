# typescript-cli-starter

A simple and zero-opinion typescript starter template for building cross-platform command line applications.

## Description

This project provides a foundation for creating a command-line interface (CLI) application that translates natural language queries into SQL. It uses TypeScript and several popular libraries to offer a robust starting point for CLI development.

## Features

- Natural language to SQL translation
- Command-line interface using Commander.js
- Spinner animation for visual feedback during translation
- SQL formatting for improved readability
- Error handling and informative error messages

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/typescript-cli-starter.git
   cd typescript-cli-starter
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Usage

To run the application in development mode:

```
npm run dev -- <query> [options]
```

To build and run the application:

```
npm run build
node ./dist/cli.js <query> [options]
```

### Options

- `-s, --schema <schema>`: Provide a table schema for context
- `-V, --version`: Output the version number
- `-h, --help`: Display help for command

### Example

```
npm run dev -- "Show me all users who joined last month" -s "Users(id, name, email, join_date)"
```

## Scripts

- `npm run dev`: Run the application in development mode
- `npm run clean`: Remove build artifacts
- `npm run build`: Build the application
- `npm test`: Run tests (currently not implemented)
- `npm run bundle`: Build and package the application for distribution

## Dependencies

- commander: For building the command-line interface
- isomorphic-unfetch: For making HTTP requests
- log-update: For updating console output
- ora: For creating spinners
- sql-formatter: For formatting SQL queries

## Dev Dependencies

- pkg: For packaging the application
- rimraf: For cross-platform directory removal
- ts-node: For running TypeScript files directly

## License

This project is licensed under the MIT License.

## Author

Khalid Zoabi <kzoabi@outlook.com>

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Note

This project uses Ollama API for natural language to SQL translation. Make sure you have Ollama running locally on `http://localhost:11434` with the `mistral` model available.