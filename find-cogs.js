const getCOGIndex = require("./get-cog-index");

const SIZE = 0.0625; // smallest NAIP tile size
const HALF_SIZE = SIZE / 2;

module.exports = async ({ bbox, debug = false, buffer = true, year = null, years = null }) => {
    const index = await getCOGIndex({ debug });
    if (debug) console.log("[naip.find-cogs] loaded index", Object.keys(index));

    if (!Array.isArray(years)) {
        if (year) years = [parseInt(year)];
        else
            years = Object.keys(index)
                .map(n => parseInt(n))
                .sort();
    }
    if (debug) console.log("[naip.find-cogs] years:", years);

    const result = [];

    // adding a buffer to be safe and deal with floating point arithmetic issues around edges
    const xmin = buffer ? Math.floor(bbox.xmin / SIZE) * SIZE + HALF_SIZE : bbox.xmin;
    const xmax = buffer ? Math.ceil(bbox.xmax / SIZE) * SIZE - HALF_SIZE : bbox.xmax;
    const ymax = buffer ? Math.ceil(bbox.ymax / SIZE) * SIZE - HALF_SIZE : bbox.ymax;
    const ymin = buffer ? Math.floor(bbox.ymin / SIZE) * SIZE + HALF_SIZE : bbox.ymin;

    for (let y = 0; y < years.length; y++) {
        const year = years[y];
        for (let lon = xmin; lon <= xmax; lon += SIZE) {
            for (let lat = ymax; lat >= ymin; lat -= SIZE) {
                const lat_truncated = Math.trunc(lat).toString().padStart(2, "0");
                const lon_truncated = Math.abs(Math.trunc(lon)).toString().padStart(3, "0");
                const quad = lat_truncated + lon_truncated;

                // how many 0.125 x 0.125 quads from left edge of longitude degree line
                const left = (lon - Math.floor(lon)) / 0.125;
                const left_int = Math.floor(left);

                const top = (Math.ceil(lat) - lat) / 0.125;
                const top_int = Math.floor(top);

                // starts at 01
                const box = 1 + top_int * (1 / 0.125) + left_int;
                const box_str = box.toString().padStart(2, "0");

                // get left edge of quadrant
                const we = Math.round((left - left_int) / 0.25) === 1 ? "w" : "e";
                const ns = Math.round((top - top_int) / 0.25) === 1 ? "n" : "s";

                const quadrant = ns + we;

                const urls =
                    (index &&
                        index[year] &&
                        index[year][lat_truncated] &&
                        index[year][lat_truncated][lon_truncated] &&
                        index[year][lat_truncated][lon_truncated][box_str] &&
                        index[year][lat_truncated][lon_truncated][box_str][quadrant]) ||
                    [];
                if (urls.length >= 1) {
                    result.push(urls[0]);
                } else {
                    if (debug)
                        console.log(
                            "[naip.find-cogs] couldn't find cogs for " +
                                JSON.stringify({
                                    year,
                                    lat_truncated,
                                    lon_truncated,
                                    box_str,
                                    quadrant
                                })
                        );
                }
            }
        }
    }
    return result;
};
