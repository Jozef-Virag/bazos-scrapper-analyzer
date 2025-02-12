# Bazos.sk Scraper & Analyzer

A web scraper and analyzer for **Bazos.sk** that allows users to search for products based on specific criteria and save the results as JSON files. Future updates will include analytical features.

## 🚀 Features
- Search for listings on **Bazos.sk** using keywords and ZIP codes.
- Filter results by **price range** and **search radius**.
- Option to run the scraper in **headless** or **windowed mode**.
- Save results in structured **JSON files** for further analysis.

## 📥 Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/UKF-JozefVirag/bazos-scrapper-analyzer.git
    ```
2. **Navigate to the project directory:**
    ```sh
    cd bazos-scrapper-analyzer
    ```
3. **Install dependencies:**
    ```sh
    npm install
    ```

## 🛠 Usage

Run the scraper with the following command:

```sh
node index.js search [query] [zip] [options]
```

### 🔧 Options

| Option          | Description                                      | Example |
|----------------|--------------------------------------------------|---------|
| `--radius`     | Search radius in kilometers                     | `--radius 10` |
| `--from`       | Minimum price filter (in EUR)                   | `--from 100` |
| `--to`         | Maximum price filter (in EUR)                   | `--to 1000` |
| `--window`     | Run in **non-headless** mode (display browser)  | `--window` |

### 📌 Example Command

```sh
node index.js search "iphone 13" 94901 --radius 10 --from 100 --to 1000 --window
```

This command searches for **"iPhone 13"** in ZIP code **94106**, within a **10 km radius**, priced between **100 - 1000 EUR**, and runs the scraper in **windowed mode**.

## 📄 Output
The results are saved as a JSON file in the `results/` directory. The filename format:
```sh
[query]-[zip]-[radius]-[from]-[to]-[timestamp].json
```
Example:
```sh
iphone-13-94901-10-100-1000-2024-02-12T12-00-00.json
```

## 🏗 Future Plans
- 📊 Data analysis and visualization of collected listings.

## 📜 License
This project is licensed under the **MIT License**.

---

Made with ❤️ by **UKF-JozefVirag** 🚀

