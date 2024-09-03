import { Command } from 'commander';
import translateToSQL from './index';
import { displayHistory } from './history';

const program = new Command();

const frames = ['|', '/', '-', '\\'];
let i = 0;

function updateSpinner(text: string) {
	process.stdout.write(`\r${frames[i = ++i % frames.length]} ${text}`);
}

function clearSpinner() {
	process.stdout.write('\r\x1b[K');
}

program
	.version('0.1.0')
	.name('htsql')
	.usage('<query>')
	.argument('[query]', 'The natural language query to translate to SQL')
	.option('-s, --schema <schema>', 'Provide a table schema for context')
	.option('--history', 'Display query history')
	.action(async (query, options) => {
		if (options.history) {
			displayHistory();
			return;
		}

		if (!query) {
			console.error('Error: Query is required unless using --history option');
			program.help();
			return;
		}

		const spinnerInterval = setInterval(() => updateSpinner('Translating to SQL...'), 100);
		try {
			const result = await translateToSQL(query, options.schema);
			clearInterval(spinnerInterval);
			clearSpinner();
			console.log('✔ Translation complete');
			console.log(`Human language: ${query}`);
			console.log(`Title: ${result.title}`);
			console.log('SQL Query:');
			console.log(result.sql);
		} catch (error) {
			clearInterval(spinnerInterval);
			clearSpinner();
			console.error('✖ Translation failed');
			if (error instanceof Error) {
				console.error('Error:', error.message);
			} else {
				console.error('An unexpected error occurred');
			}
			process.exit(1);
		}
	});

program.parse(process.argv);