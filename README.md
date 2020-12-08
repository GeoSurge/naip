# naip
Utilities for Working with NAIP

# install
```bash
npm install naip
```

# usage

# findCOGs
```js
const findCOGs = require("naip/find-cogs");

const bbox = { xmin: -85.26, ymin: 35.04, xmax: -85.25, ymax: 35.05 };
const cogs = await findCOGs({
    bbox,
    debug: true, // set debug to true for increased logging
    year: 2016
});
// cogs is [ "tn/2016/60cm/rgbir_cog/35085/m_3508562_se_16_1_20160608.tif" ]
```

# support
Please email daniel@geosurge.io or post an issue at https://github.com/geosurge/naip
