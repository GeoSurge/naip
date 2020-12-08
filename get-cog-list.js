const toab = require("toab");
const inflate = require("pako/dist/pako_inflate");
const COMPRESSED_COG_DATA = require("./cog-data");
const { reject } = require("lodash");

const cache = {};

module.exports = async ({ debug = false } = { debug: false }) => {
    if (!cache.cogs) {
        cache.cogs = new Promise(async resolve => {
            if (debug) console.log("[naip.get-cog-list] decompressing");
            // this is a bit of a hack, but we convert the compressed data to a DATA URL
            // so that toab can figure out how to process it
            const url = "data:;base64," + COMPRESSED_COG_DATA;
            if (debug) console.log("converted compressed list of cogs into a data url");

            // convert base64 data into an array buffer
            const arrayBuffer = await toab(url);
            if (debug) console.log("converted compressed list of cogs into an array buffer");

            let cogs;
            try {
                const cogs = inflate.ungzip(arrayBuffer, { to: "string" }).trim().split("\n");
                if (debug) console.log("[naip] saved decompressed list of cogs to cache");
                resolve(cogs);
            } catch (error) {
                console.log("arrayBuffer:", arrayBuffer);
                console.error("failed to ungzip the data");
                reject(error);
            }
        });
    }
    return await cache.cogs;
};
