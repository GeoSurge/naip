const cogData = require("./cog-data");
const getCOGList = require("./get-cog-list");
const getCOGIndex = require("./get-cog-index");
const findCOGs = require("./find-cogs");

const naip = {
    cogData,
    getCOGList,
    getCOGIndex,
    findCOGs
};

if (typeof module === "object") module.exports = naip;
if (typeof window === "object") window.naip = naip;
if (typeof self === "object") self.naip = naip;
