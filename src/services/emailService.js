const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const TEMPLATES_DIR = path.join(__dirname, "..", "templates", "email");

const cache = {};

function loadTemplate(name) {
  if (cache[name]) return cache[name];
  const filePath = path.join(TEMPLATES_DIR, `${name}.hbs`);
  const source = fs.readFileSync(filePath, "utf8");
  cache[name] = handlebars.compile(source);
  return cache[name];
}

const emailService = {
  async renderTemplate(templateName, context) {
    const template = loadTemplate(templateName);
    return template(context);
  },

  async sendMail({ to, subject, html }) {
    const timestamp = new Date().toLocaleString();
    console.log("=".repeat(60));
    console.log(`[EMAIL] Simulation — ${timestamp}`);
    console.log(`[EMAIL] To:      ${to}`);
    console.log(`[EMAIL] Subject: ${subject}`);
    console.log(`[EMAIL] Body:`);
    console.log(html);
    console.log("=".repeat(60));
    await new Promise((r) => setTimeout(r, 100));
    return { messageId: `sim-${Date.now()}` };
  },
};

module.exports = emailService;
