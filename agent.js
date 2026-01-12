const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
const http = require('http');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let MODEL = 'qwen2.5-coder:latest';
const MSG_HISTORY = [];

const SYSTEM_PROMPT = `You are "AI Agent", a world-class autonomous Senior Software Engineer and "Coding Doctor".
You possess full administrative access to this system via your internal "Nodes".

YOUR OPERATING PROTOCOLS:
1. NEVER ASK for permission to write files or run commands. JUST DO IT.
2. NEVER provide code for the user to copy. You must write it to disk yourself using fs_node.
3. If you need to build an Electron app:
   - Use 'fs_node:writeFile' for package.json, main.js, and index.html.
   - Use 'exec_node:runCommand' for 'npm install' and 'npm run dist'.
4. If a command fails (like npm), analyze the error and fix the configuration files immediately.
5. You are an expert in Windows deployment and NSIS installers.

AVAILABLE NODES:
- fs_node: { "action": "readFile" | "writeFile" | "listDir", "path": "path/to/file", "content": "text or base64", "encoding": "utf8" | "base64" }
- exec_node: { "action": "runCommand", "command": "...", "cwd": "..." }

INTERACTION FORMAT:
You MUST respond with a JSON block for every action:
\`\`\`json
{
  "tool": "node_name",
  "args": { ... }
}
\`\`\`
Always start by listing the directory: fs_node listDir "."
`;

MSG_HISTORY.push({ role: 'system', content: SYSTEM_PROMPT });

function ollamaRequest(endpoint, payload = {}, method = 'POST') {
    return new Promise((resolve, reject) => {
        const data = method === 'POST' ? JSON.stringify(payload) : '';
        const options = {
            hostname: 'localhost', port: 11434, path: endpoint, method: method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (method === 'POST') options.headers['Content-Length'] = Buffer.byteLength(data);
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (c) => body += c);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) { try { resolve(JSON.parse(body)); } catch (e) { reject(e); } }
                else reject(new Error(`Ollama Error: ${res.statusCode} ${body}`));
            });
        });
        req.on('error', (e) => reject(e));
        if (method === 'POST') req.write(data);
        req.end();
    });
}

const TOOLS = {
    fs_node: (req) => {
        try {
            const targetPath = req.path ? path.resolve(req.path) : null;
            if (!targetPath) throw new Error("Path required");
            if (req.action === 'readFile') return { status: 'success', content: fs.readFileSync(targetPath, 'utf8') };
            if (req.action === 'writeFile') {
                const dir = path.dirname(targetPath);
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                const encoding = req.encoding === 'base64' ? 'base64' : 'utf8';
                fs.writeFileSync(targetPath, req.content || '', encoding);
                return { status: 'success', message: 'Written: ' + targetPath };
            }
            if (req.action === 'listDir') {
                const files = fs.readdirSync(targetPath).map(f => {
                    const s = fs.statSync(path.join(targetPath, f));
                    return { name: f, type: s.isDirectory() ? 'dir' : 'file' };
                });
                return { status: 'success', files };
            }
            return { status: 'error', message: 'Unknown action' };
        } catch (e) { return { status: 'error', message: e.message }; }
    },
    exec_node: (req) => {
        try {
            const cwd = req.cwd || process.cwd();
            const stdout = execSync(req.command, { cwd, encoding: 'utf8', stdio: 'pipe' });
            return { status: 'success', stdout };
        } catch (e) { return { status: 'failed', stderr: e.stderr || e.message }; }
    }
};

function parseToolCalls(content) {
    const blocks = [...content.matchAll(/```json\s*(\{[\s\S]*?\})\s*```/g)];
    const tools = [];
    for (const b of blocks) {
        try { const j = JSON.parse(b[1]); if (j.tool && j.args) tools.push(j); } catch (e) { }
    }
    if (tools.length === 0) {
        try {
            const s = content.indexOf('{'), e = content.lastIndexOf('}');
            if (s !== -1 && e > s) {
                const j = JSON.parse(content.substring(s, e + 1));
                if (j.tool && j.args) tools.push(j);
            }
        } catch (e) { }
    }
    return tools;
}

const C = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[92m",
    yellow: "\x1b[93m",
    blue: "\x1b[94m",
    magenta: "\x1b[95m",
    cyan: "\x1b[96m",
    red: "\x1b[91m",
    white: "\x1b[97m"
};

async function main() {
    console.log(`\n${C.bright}${C.cyan}--- Standalone AI Coding Agent (v1.3 - Colorful Edition) ---${C.reset}`);
    try {
        const res = await ollamaRequest('/api/tags', {}, 'GET');
        const models = res.models ? res.models.map(m => m.name) : [];
        if (models.length) {
            console.log(`${C.white}Found Models:${C.reset} ${models.join(', ')}`);
            MODEL = models.find(m => m.includes('coder')) || models[0];
            console.log(`${C.green}Selected Model:${C.reset} ${C.bright}${MODEL}${C.reset}`);
        }
    } catch (e) { console.log(`${C.red}Ollama not detected on localhost:11434${C.reset}`); }

    const loop = () => {
        rl.question(`\n${C.bright}${C.magenta}User:${C.reset} `, async (input) => {
            if (input === 'exit') process.exit();
            if (input.startsWith('/model ')) {
                MODEL = input.split(' ')[1];
                console.log(`${C.blue}Switched model to:${C.reset} ${C.bright}${MODEL}${C.reset}`);
                loop();
                return;
            }

            MSG_HISTORY.push({ role: 'user', content: input });
            let active = true;
            while (active) {
                process.stdout.write(`${C.yellow}Thinking...${C.reset} `);
                try {
                    const res = await ollamaRequest('/api/chat', { model: MODEL, messages: MSG_HISTORY, stream: false });
                    process.stdout.write("\r\x1b[K"); // Clear Thinking... line
                    const content = res.message.content;
                    const tools = parseToolCalls(content);

                    if (tools.length) {
                        MSG_HISTORY.push({ role: 'assistant', content });
                        for (const t of tools) {
                            console.log(`${C.blue}[Executing]${C.reset} ${C.bright}${t.tool}${C.reset}:${C.cyan}${t.args.action || 'cmd'}${C.reset}`);
                            const out = await TOOLS[t.tool](t.args);
                            const statusColor = out.status === 'success' ? C.green : C.red;
                            console.log(`${C.blue}[Result]${C.reset} ${statusColor}${out.status}${C.reset}`);
                            MSG_HISTORY.push({ role: 'user', content: `Tool Output (${t.tool}): ${JSON.stringify(out)}` });
                        }
                    } else {
                        console.log(`\n${C.bright}${C.green}AI:${C.reset}\n${content}`);
                        MSG_HISTORY.push({ role: 'assistant', content });
                        active = false;
                    }
                } catch (e) { console.log(`\n${C.red}Error:${C.reset} ${e.message}`); active = false; }
            }
            loop();
        });
    };
    loop();
}
main();
