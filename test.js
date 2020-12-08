const test = require("ava");
const get_cog_list = require("./get-cog-list");
const get_cog_index = require("./get-cog-index");
const find_cogs = require("./find-cogs");

test("getting list of NAIP COGs", t => {
    const cogs = get_cog_list();
    t.is(cogs[0], "al/2011/100cm/rgbir_cog/30085/m_3008501_ne_16_1_20110815.tif");
    t.is(cogs[cogs.length - 1], "wy/2017/100cm/rgbir_cog/45111/m_4511164_se_12_1_20171017.tif");
    t.is(cogs.length, 901772);
});

test("getting index of NAIP COGs", t => {
    const index = get_cog_index({ debug: true });
    const years = Object.keys(index).map(k => parseInt(k));
    t.deepEqual(years, [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]);

    const lats = Array.from(
        new Set(
            Object.keys(index)
                .map(year => Object.keys(index[year]))
                .flat()
                .map(n => parseInt(n))
        )
    ).sort();
    console.log(JSON.stringify(lats));
    t.deepEqual(lats, [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49]);

    const lat_count = Object.keys(index).map(year => Object.keys(index[year]).length);
    t.deepEqual(lat_count, [26, 20, 25, 26, 25, 26, 25, 26, 24]);

    t.deepEqual(index["2018"]["35"]["085"]["62"]["se"], ["tn/2018/60cm/rgbir_cog/35085/m_3508562_se_16_060_20181110.tif"]);
});

test("searching NAIP COGs by bounding box", t => {
    const bbox = {
        xmin: -85.26,
        ymin: 35.04,
        xmax: -85.25,
        ymax: 35.05
    };
    const cogs = find_cogs({ bbox, debug: true });
    t.deepEqual(cogs, [
        "tn/2012/100cm/rgbir_cog/35085/m_3508562_se_16_1_20120527.tif",
        "tn/2014/100cm/rgbir_cog/35085/m_3508562_se_16_1_20140426.tif",
        "tn/2016/60cm/rgbir_cog/35085/m_3508562_se_16_1_20160608.tif",
        "tn/2018/60cm/rgbir_cog/35085/m_3508562_se_16_060_20181110.tif"
    ]);
});

test("searching NAIP COGs by bounding box and year", t => {
    const bbox = {
        xmin: -85.26,
        ymin: 35.04,
        xmax: -85.25,
        ymax: 35.05
    };
    const cogs = find_cogs({ bbox, debug: true, year: 2016 });
    t.deepEqual(cogs, ["tn/2016/60cm/rgbir_cog/35085/m_3508562_se_16_1_20160608.tif"]);
});
