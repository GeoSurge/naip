const toab = require("toab");
const inflate = require("pako/dist/pako_inflate");
const COMPRESSED_COG_DATA = require("./cog-data");

const cache = {};

module.exports = ({ debug = false } = { debug: false }) => {
    if (!cache.cogs) {
        // this is a bit of a hack, but we convert the compressed data to a DATA URL
        // so that toab can figure out how to process it
        const url = "data:;base64," + COMPRESSED_COG_DATA;
        if (debug) console.log("converted compressed list of cogs into a data url");

        // convert base64 data into an array buffer
        const arrayBuffer = toab(url);
        if (debug) console.log("converted compressed list of cogs into an array buffer");

        try {
            cache.cogs = inflate.ungzip(arrayBuffer, { to: "string" }).trim().split("\n");
            if (debug) console.log("[naip] saved decompressed list of cogs to cache");
        } catch (error) {
            console.log("arrayBuffer:", arrayBuffer);
            console.error("failed to ungzip the data");
            throw error;
        }
    }
    return cache.cogs;
};
