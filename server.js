const { serveHTTP } = require("stremio-addon-sdk")
const addon = require("./index.js")

const port = process.env.PORT || 7001
serveHTTP(addon, { port })