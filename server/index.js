const axios = require("axios");
const express = require("express");
const cheerio = require("cheerio");

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  try {
    const [googResponse, msftResponse, aaplResponse] = await Promise.all([
      axios.get("https://www.google.com/finance/quote/GOOG:NASDAQ"),
      axios.get("https://www.google.com/finance/quote/MSFT:NASDAQ"),
      axios.get("https://www.google.com/finance/quote/AAPL:NASDAQ"),
    ]);

    const googData = extractStatisticalData(googResponse.data);
    const msftData = extractStatisticalData(msftResponse.data);
    const aaplData = extractStatisticalData(aaplResponse.data);

    res.send({ googData, msftData, aaplData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// I used cheerio for loading the data stats
// this package https://www.npmjs.com/package/google-finance is deprecated and I didn't stay to do research to much for get the data from google finance api
function extractStatisticalData(html) {
  const $ = cheerio.load(html);
  const stats = {};

  stats.price = $(
    "div[data-currency-code][data-last-price] div>span>div>div"
  ).text();
  stats.marketCap = $("c-wiz main div div>div:nth-child(5) div.P6K39c").text();
  stats.peRatio = $("c-wiz main div div>div:nth-child(7) div.P6K39c").text();

  return stats;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
