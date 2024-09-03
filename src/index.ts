import fetch from "isomorphic-unfetch";
import { format } from 'sql-formatter';
import { addToHistory } from './history';

interface TranslationResult {
	sql: string;
	title: string;
}

const extractJsonFromResponse = (response: string): string => {
	const match = response.match(/<result>([\s\S]*?)<\/result>/);
	return match ? match[1].trim() : '';
};

const translateToSQL = async (query: string, tableSchema = ""): Promise<TranslationResult> => {
	// Validate inputs
	if (!query) {
		throw new Error("Missing query.");
	}

	const prompt = `You are a data chatbot. You take in a user query, translate it to SQL, and output several other pieces of metadata that are used to visualize the output of the SQL.\n\nYour output must be in valid JSON. Do not output anything other than the JSON.\n\nHere is the user query to use:\n\n"${query}"\n\nPlease,translate the user query to sql, and add it to the JSON with the key "sql".${tableSchema && `Use this table schema:\n\n${tableSchema}\n\n`}\n\nFinally, create a title for the visualization, and add it to the JSON with the key "title".\n\nSurround your JSON output with <result></result> tags.`;

	try {
		const response = await fetch("http://localhost:11434/api/generate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				model: "mistral",
				prompt: prompt,
				stream: false,
				temperature: 0,
				max_tokens: 100,
				stop: [
					"---",
					"END_OF_QUERY"
				],
				frequency_penalty: 0,
				presence_penalty: 0
			}),
		});

		if (!response.ok) {
			throw new Error("Failed to get a response from the translation service.");
		}

		const data = await response.json();

		if (!data.response) {
			throw new Error("Received an empty response from the translation service.");
		}

		const jsonString = extractJsonFromResponse(data.response);
		if (!jsonString) {
			throw new Error("Failed to extract valid JSON from the response.");
		}

		const parsedResponse = JSON.parse(jsonString);
		let { sql, title } = parsedResponse;

		if (!sql || !title) {
			throw new Error("The response is missing required fields (SQL or title).");
		}

		try {
			sql = format(sql);
		} catch (formattingError) {
			console.warn("Warning: Could not format SQL due to syntax error. Using unformatted SQL.");
		}

		// Add the query, SQL, and title to history
		addToHistory(query, sql, title);

		return { sql, title };
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes("ECONNREFUSED")) {
				throw new Error("Unable to connect to the translation service. Please check if the service is running.");
			} else {
				throw new Error(`An error occurred during translation: ${error.message}`);
			}
		} else {
			throw new Error("An unexpected error occurred during translation.");
		}
	}
};

export default translateToSQL;