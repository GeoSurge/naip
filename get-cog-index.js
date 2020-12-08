const getListOfCOGs = require("./get-cog-list");

let index = null;

// initialize regex
const state = "([a-z]{2})";
const year = "([0-9]{4})";
const month = "([0-9]{2})";
const day = "([0-9]{2})";
const date = year + month + day;
const quadrant = "(nw|ne|sw|se)";

const utm_zone = "_[0-9]{1,2}";
// 1, h, or utm zone + start date

const extra =
    "(" +
    [
        utm_zone + "_1", // utm zone + 1
        utm_zone + "_[0-9]{1,3}", // utm zone + resolution
        utm_zone + "_h",
        utm_zone + "_[0-9]{1,3}" + "_[0-9]{8}" // utm zone + resolution + start date
    ].join("|") +
    ")";

const lat = "([0-9]{2})";
const lon = "([0-9]{3})";
const key = "([0-9]{2})";
const version = "(|_2)";
const pattern =
    "^" +
    [
        state,
        year,
        "([^/]*)", // e.g. 100cm
        "([^/]*)", // e.g. rgbir_cog
        `${lat}${lon}`, // e.g. 30085
        `m_${lat}${lon}${key}_${quadrant}${extra}_${date}${version}.tif`
    ].join("/") +
    "$";

const regex = new RegExp(pattern);

module.exports = async ({ debug = false } = { debug: false }) => {
    if (debug) console.log("[naip.get-cog-index] starting");
    if (!index) {
        if (debug) console.log("[naip.get-cog-index] index doesn't exist yet, so create it");
        index = new Promise(async resolve => {
            const result = {};
            const paths = await getListOfCOGs();
            if (debug) console.log("[naip.get-cog-index] got ", paths.length, "paths");
            const number_of_cogs = paths.length;

            let count_added = 0;
            for (let i = 0; i < number_of_cogs; i++) {
                const path = paths[i];
                try {
                    // e.g. path is "al/2011/100cm/rgbir_cog/30085/m_3008501_ne_16_1_20110815.tif
                    const [state, year, res, bands, lat, lon, _lat, _lon, key, quadrant, zone, extra, _year, month, day] = regex.exec(path.trim()).slice(1);
                    const quadrant_lowercase = quadrant.toLowerCase();
                    if (!result[year]) result[year] = {};
                    if (!result[year][lat]) result[year][lat] = {};
                    if (!result[year][lat][lon]) result[year][lat][lon] = {};
                    if (!result[year][lat][lon][key]) result[year][lat][lon][key] = {};
                    if (!result[year][lat][lon][key][quadrant_lowercase]) result[year][lat][lon][key][quadrant_lowercase] = [];
                    result[year][lat][lon][key][quadrant_lowercase].push(path);
                    count_added++;
                } catch (error) {
                    if (debug) {
                        console.warn(`paths.slice(${count_added}-5,${count_added}+5):`, paths.slice(count_added - 5, count_added + 5));
                        console.error("failed to add path (" + path + ") to the index with " + count_added + " previously added");
                    }
                    throw error;
                }
            }
            resolve(result);
        });
    }
    return await index;
};
