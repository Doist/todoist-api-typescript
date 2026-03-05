#!/usr/bin/env node

const { config: dotenvConfig } = require('dotenv');

function printHelp() {
    console.log(`
Usage:
  npm run api:request -- --method <METHOD> --path <PATH> [options]

Required:
  --path <PATH>                 API path (e.g. /api/v1/tasks) or full URL

Options:
  --method, -X <METHOD>         HTTP method (default: GET)
  --query <JSON|querystring>    Query params as JSON object or query string
  --body, --data, -d <JSON>     JSON payload body
  --header, -H "K: V"           Additional header (repeatable)
  --raw                          Print response body as plain text
  --help, -h                    Show this message

Auth:
  Reads TODOIST_API_TOKEN from .env and sends Authorization: Bearer <token>.
  You may also pass your own Authorization header via --header.

Base URL:
  Uses TODOIST_API_BASE_URL from env file, or defaults to https://api.todoist.com.

Examples:
  npm run api:request -- --path /api/v1/tasks
  npm run api:request -- --method POST --path /api/v1/tasks --body '{"content":"API smoke test"}'
  npm run api:request -- --method POST --path /api/v1/tasks/123 --body '{"due_string":"no date"}'
  npm run api:request -- --path /api/v1/tasks --query '{"project_id":"123","limit":10}'
`);
}

function requireValue(flag, value) {
    if (value === undefined) {
        throw new Error(`Missing value for ${flag}.`);
    }
    return value;
}

function parseArgs(argv) {
    const args = {
        method: 'GET',
        path: undefined,
        query: undefined,
        body: undefined,
        headers: {},
        raw: false,
        help: false,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];

        if (token === '--help' || token === '-h') {
            args.help = true;
            continue;
        }

        if (token === '--method' || token === '-X') {
            args.method = requireValue(token, argv[index + 1]).toUpperCase();
            index += 1;
            continue;
        }

        if (token === '--path') {
            args.path = requireValue(token, argv[index + 1]);
            index += 1;
            continue;
        }

        if (token === '--query') {
            args.query = requireValue(token, argv[index + 1]);
            index += 1;
            continue;
        }

        if (token === '--body' || token === '--data' || token === '-d') {
            args.body = requireValue(token, argv[index + 1]);
            index += 1;
            continue;
        }

        if (token === '--header' || token === '-H') {
            const headerValue = argv[index + 1];
            if (headerValue === undefined) {
                throw new Error('Missing value for --header. Use "Key: Value".');
            }
            if (!headerValue.includes(':')) {
                throw new Error(`Invalid header format "${headerValue}". Use "Key: Value".`);
            }
            const separatorIndex = headerValue.indexOf(':');
            const key = headerValue.slice(0, separatorIndex).trim();
            const value = headerValue.slice(separatorIndex + 1).trim();
            args.headers[key] = value;
            index += 1;
            continue;
        }

        if (token === '--raw') {
            args.raw = true;
            continue;
        }

        if (token.startsWith('--')) {
            throw new Error(`Unknown option "${token}".`);
        }

        if (!args.path) {
            args.path = token;
            continue;
        }

        throw new Error(`Unexpected positional argument "${token}".`);
    }

    return args;
}


function parseJson(label, value) {
    try {
        return JSON.parse(value);
    } catch (error) {
        throw new Error(`Invalid ${label} JSON: ${(error && error.message) || String(error)}`);
    }
}

function appendQueryObject(url, queryObject) {
    if (Array.isArray(queryObject) || typeof queryObject !== 'object' || queryObject === null) {
        throw new Error('--query JSON must be an object.');
    }

    for (const [key, value] of Object.entries(queryObject)) {
        if (value === undefined || value === null) {
            continue;
        }
        if (Array.isArray(value) || typeof value === 'object') {
            url.searchParams.set(key, JSON.stringify(value));
            continue;
        }
        url.searchParams.set(key, String(value));
    }
}

function buildUrl(args) {
    const baseUrl = process.env.TODOIST_API_BASE_URL || 'https://api.todoist.com';
    const isAbsolute = /^https?:\/\//u.test(args.path);
    const url = new URL(args.path, isAbsolute ? undefined : baseUrl);

    if (!args.query) {
        return url;
    }

    const queryText = args.query.trim();
    if (queryText.startsWith('{')) {
        appendQueryObject(url, parseJson('query', queryText));
    } else {
        const extraParams = new URLSearchParams(queryText);
        for (const [key, value] of extraParams.entries()) {
            url.searchParams.append(key, value);
        }
    }

    return url;
}

function hasAuthorizationHeader(headers) {
    return Object.keys(headers).some((key) => key.toLowerCase() === 'authorization');
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
        printHelp();
        return;
    }

    if (!args.path) {
        throw new Error('Missing required --path.');
    }

    dotenvConfig({ quiet: true });

    const headers = { ...args.headers };
    if (!hasAuthorizationHeader(headers)) {
        const token = process.env.TODOIST_API_TOKEN;
        if (!token) {
            throw new Error(
                'Missing TODOIST_API_TOKEN. Add it to .env or pass Authorization header via --header.',
            );
        }
        headers.Authorization = `Bearer ${token}`;
    }

    let bodyText;
    if (args.body !== undefined) {
        parseJson('body', args.body);
        bodyText = args.body;
        if (!Object.keys(headers).some((key) => key.toLowerCase() === 'content-type')) {
            headers['Content-Type'] = 'application/json';
        }
    }

    const url = buildUrl(args);
    const response = await fetch(url, {
        method: args.method,
        headers,
        body: bodyText,
    });

    const responseText = await response.text();

    console.error(`${response.status} ${response.statusText}`);

    if (args.raw) {
        process.stdout.write(responseText + '\n');
    } else {
        let parsed;
        try {
            parsed = responseText ? JSON.parse(responseText) : null;
        } catch {
            parsed = responseText;
        }

        const output = {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            data: parsed,
        };

        process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
    }

    if (!response.ok) {
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error(error.message || String(error));
    printHelp();
    process.exitCode = 1;
});
