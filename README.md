# bazos.sk-scrapper-analyzer

Scrapper and analyzer for bazos.sk

## Description

This project is a scrapper and analyzer for bazos.sk. It allows you to search for ads on bazos.sk based on specified criteria and save the results to JSON files. In the future, it will be extended with analytical functions.

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

Run the scrapper with the following command:
```sh
npm start -- search [query] [zip] [options]

### Options

- `--radius <number>`: Radius of the search area in kilometers.
- `--from <number>`: Minimum price of the items.
- `--to <number>`: Maximum price of the items.
- `--window`: Flag to display the browser to the user.

### Example

```sh
node index.js search "iphone 13" 94106 --radius 0 --from 100 --to 1000 --window
```