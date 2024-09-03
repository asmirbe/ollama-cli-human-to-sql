import fs from 'fs';
import path from 'path';
import os from 'os';

interface HistoryEntry {
	timestamp: string;
	query: string;
	sqlTranslation: string;
	title: string;
}

const HISTORY_FILE = path.join(os.homedir(), '.htsql_history.json');

export function addToHistory(query: string, sqlTranslation: string, title: string): void {
	const entry: HistoryEntry = {
		timestamp: new Date().toISOString(),
		query,
		sqlTranslation,
		title
	};

	let history: HistoryEntry[] = [];
	if (fs.existsSync(HISTORY_FILE)) {
		const fileContent = fs.readFileSync(HISTORY_FILE, 'utf-8');
		history = JSON.parse(fileContent);
	}

	history.push(entry);
	fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

export function getHistory(): HistoryEntry[] {
	if (fs.existsSync(HISTORY_FILE)) {
		const fileContent = fs.readFileSync(HISTORY_FILE, 'utf-8');
		return JSON.parse(fileContent);
	}
	return [];
}

export function displayHistory(): void {
	const history = getHistory();
	if (history.length === 0) {
		console.log('No history found.');
		return;
	}

	history.forEach((entry, index) => {
		console.log(`\n--- Entry ${index + 1} ---`);
		console.log(`Timestamp: ${entry.timestamp}`);
		console.log(`Query: ${entry.query}`);
		console.log(`Title: ${entry.title}`);
		console.log(`SQL Translation: ${entry.sqlTranslation}`);
	});
}