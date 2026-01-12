const { execSync } = require('child_process');

function handle(req) {
    if (req.action === 'runCommand') {
        try {
            const cwd = req.cwd || process.cwd();
            // Using execSync for simpler integration in the module-based approach
            const stdout = execSync(req.command, { cwd: cwd, encoding: 'utf8', stdio: 'pipe' });
            return {
                status: 'success',
                stdout: stdout,
                stderr: ''
            };
        } catch (error) {
            return {
                status: 'failed',
                stdout: error.stdout || '',
                stderr: error.stderr || '',
                message: error.message
            };
        }
    } else {
        return { status: 'error', message: 'Unknown exec action: ' + req.action };
    }
}

module.exports = handle;
