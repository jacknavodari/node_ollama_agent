const fs = require('fs');
const path = require('path');

function handle(req) {
    try {
        const targetPath = req.path ? path.resolve(req.path) : null;

        if (req.action === 'readFile') {
            if (!targetPath) throw new Error("Path is required");
            const content = fs.readFileSync(targetPath, 'utf8');
            return { status: 'success', content: content };

        } else if (req.action === 'writeFile') {
            if (!targetPath) throw new Error("Path is required");
            const dir = path.dirname(targetPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(targetPath, req.content || '', 'utf8');
            return { status: 'success', message: 'File written successfully' };

        } else if (req.action === 'listDir') {
            if (!targetPath) throw new Error("Path is required");
            const files = fs.readdirSync(targetPath);
            const details = files.map(file => {
                try {
                    const stat = fs.statSync(path.join(targetPath, file));
                    return { name: file, type: stat.isDirectory() ? 'directory' : 'file' };
                } catch {
                    return { name: file, type: 'unknown' };
                }
            });
            return { status: 'success', files: details };

        } else {
            return { status: 'error', message: 'Unknown fs action: ' + req.action };
        }
    } catch (err) {
        return { status: 'error', message: err.message };
    }
}

module.exports = handle;
