const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'agent.log');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};

function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
}

function appendLog(level, message) {
  const entry = `[${getTimestamp()}] [${level}] ${message}\n`;
  try {
    fs.appendFileSync(LOG_FILE, entry, 'utf8');
  } catch (err) {
    // ignore
  }
}

const logger = {
  info: (msg) => {
    const text = `[${getTimestamp()}] [INFO] ${msg}`;
    console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`);
    appendLog('INFO', msg);
  },
  success: (msg) => {
    const text = `[${getTimestamp()}] [SUCCESS] ${msg}`;
    console.log(`${colors.green}✓ ${msg}${colors.reset}`);
    appendLog('SUCCESS', msg);
  },
  warn: (msg) => {
    const text = `[${getTimestamp()}] [WARN] ${msg}`;
    console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`);
    appendLog('WARN', msg);
  },
  error: (msg) => {
    const text = `[${getTimestamp()}] [ERROR] ${msg}`;
    console.log(`${colors.red}✖ ${msg}${colors.reset}`);
    appendLog('ERROR', msg);
  },
  cooldown: (seconds, reason = 'Anti-bot protection cooldown') => {
    return new Promise((resolve) => {
      let remaining = seconds;
      appendLog('WAIT', `${reason}: ${seconds}s`);
      const timer = setInterval(() => {
        process.stdout.write(
          `\r${colors.yellow}⏳ [COOLDOWN] ${reason}: ${remaining}s remaining...${colors.reset}   `
        );
        remaining--;
        if (remaining < 0) {
          clearInterval(timer);
          process.stdout.write('\r' + ' '.repeat(60) + '\r');
          console.log(`${colors.green}✓ Cooldown completed. Continuing automation.${colors.reset}`);
          resolve();
        }
      }, 1000);
    });
  },
  banner: (title) => {
    console.log(`\n${colors.bright}${colors.cyan}====================================================${colors.reset}`);
    console.log(`${colors.bright}🤖  DataPurge Community Social Media Agent${colors.reset}`);
    console.log(`${colors.dim}    ${title}${colors.reset}`);
    console.log(`${colors.cyan}====================================================${colors.reset}\n`);
  },
};

module.exports = logger;
