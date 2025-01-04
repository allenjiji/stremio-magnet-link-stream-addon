const { addonBuilder } = require("stremio-addon-sdk")
const fetch = require('node-fetch')

const API_URL = "https://api.npoint.io/3f10a371a620d5e65b3e";

const manifest = {
    id: "org.latest_release_streams",
    version: "1.0.0",
    name: "Remote Magnet Links Streams",
    description: "Brings the stream from remote magnet links",
    catalogs: [],
    resources: ["stream"],
    types: ["movie"],
    idPrefixes: ["tt"], // for IMDB ids
    url: "https://stremio-magnet-link-stream-addon.vercel.app"
}

const builder = new addonBuilder(manifest)

builder.defineStreamHandler(async ({ type, id }) => {
  if (type === "movie") {
      try {
          const response = await fetch(API_URL);
          const magnetLinks = await response.json();

          if (magnetLinks[id]) {
              return {
                  streams: magnetLinks[id].map(item => ({
                      title: item.title,
                      infoHash: item.hash,
                      sources: ["dht:", "tracker:udp://tracker.opentrackr.org:1337"],
                      type: 'movie',
                      fileIndex: 0
                  }))
              };
          }
      } catch (error) {
          console.error("Error fetching data:", error);
      }
  }
  return { streams: [] };
});

module.exports = builder.getInterface()