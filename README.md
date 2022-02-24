# Cost of Living API

> Unofficial [Numbeo Cost of Living](https://www.numbeo.com/cost-of-living/) JSON API

## Getting Started

First, install dependencies:

```sh
npm install
```

Then run the application in development mode:

```sh
npm run dev
```

## API

### `/:city?currency`

Returns the cost of different items in the requested city. Return an empty array of costs if there is not city data available.

#### Params

##### `city`

The city for which you want to retrieve cost-of-living data for

#### Query

##### `currency`

The three letter currency code for the currency you want values in. Defaults to CAD.
