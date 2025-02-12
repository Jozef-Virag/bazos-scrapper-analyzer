# bazos.sk-scrapper-analyzer

Scraper and analyzer for bazos.sk

## Description

This project is a scraper and analyzer for bazos.sk. It allows you to search for ads on bazos.sk based on specified criteria and save the results to JSON files. In the future, it will be extended with analytical functions.

## Installation

1. Clone this repository:
    ```sh
    git clone https://github.com/UKF-JozefVirag/bazos-scrapper.git
    ```
2. Navigate to the project directory:
    ```sh
    cd bazos-scrapper
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## Usage

Run the scraper with the following command:
```sh
npm start -- search [query] [zip] [options]
```

### Options

- `--category [category]`: Specify the category to search in.
- `--price-min [amount]`: Minimum price of the items.
- `--price-max [amount]`: Maximum price of the items.
- `--pages [number]`: Number of pages to scrape.

### Results

The results will be saved in the `results` directory as JSON files. Each file will contain the ads that match the specified criteria.

### Examples

Search for ads with the query "bike" in the zip code "81101":
```sh
npm start -- search bike 81101
```

Search for ads with the query "laptop" in the zip code "01001" with a price range of 100 to 500:
```sh
npm start -- search laptop 01001 --price-min 100 --price-max 500
```
```sh
npm start -- search [query] [zip] [options]