const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();
const { PORT = 3000 } = process.env;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/:city', async (req, res, next) => {
    const { city } = req.params;
    const { currency = 'CAD' } = req.query;

    const response = await fetch(`https://www.numbeo.com/cost-of-living/in/${city}?displayCurrency=${currency}`);
    if (!response.ok) {
        console.log(response);
        return res.status(response.statusCode).send('error');
    }
    const html = await response.text();

    const $ = cheerio.load(html);

    const rows = $('body > div.innerWidth > table > tbody > tr')
        .filter((i, el) => $(el).children('td').length === 3)
        .map(
            (i, el) => $(el).children().map(
                (i, el) => $(el).text().trim()
            ).toArray()
        ).toArray();

    const costs = chunkArray(rows, 3)
        .map(([item, costWithSymbol, range]) => {
            const cost = costWithSymbol.replace(/^.*?([\d.]+).*?$/, '$1');
            const [rangeLow, rangeHigh] = range.split('-');
            return {
                item,
                cost,
                range: {
                    low: rangeLow,
                    high: rangeHigh
                }
            }
        });
    return res.send({ city, costs, currency });
})
;

function chunkArray(arr, chunkSize) {
    let temp = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        temp.push(arr.slice(i, i + chunkSize));
    }
    return temp;
}

app.listen(PORT, () => console.log(`Cost of Living API running on port ${PORT}`));

