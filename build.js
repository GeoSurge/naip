const fs = require("fs");
const pako = require("pako");

// load manifest file
const manifest = fs.readFileSync("./data/manifest.txt", "utf-8");

const lines = manifest.split(/\r?\n/g);
console.log("lines.length:", lines.length.toLocaleString());

const cogs = lines.filter(ln => ln.includes("tif") && ln.includes("cog") && !ln.includes("v1"));
console.log("cogs.length:", cogs.length.toLocaleString());

const data = pako.gzip(cogs.join("\n"));
console.log("data:", data);

const base64 = Buffer.from(data).toString("base64");

const snippet = `module.exports = "${base64}";\n`;
fs.writeFileSync("./cog-data.js", snippet, "utf-8");
