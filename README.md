
# **eBay Sold Items Statistics Scraper**

This project is a Python-based application that collects and analyzes statistics of sold items on eBay using the **eBay API**, **Terapeak**, and **Selenium**. The goal of this project is to provide insights into market trends, product performance, and pricing strategies by extracting and processing relevant data from eBay.

---

## **Features**
- Frontend -- React
- Backend -- Python
- Fetches detailed statistics of sold items from eBay's platform.
- Utilizes the **eBay API** for reliable and structured data access.
- Leverages **Terapeak** for in-depth market insights and historical data.
- Employs **Selenium** for web scraping where API access is limited or unavailable.
- Outputs data in a structured format for analysis (e.g., CSV, JSON).
- Includes support for:
  - Filters like keywords, categories, and date ranges.
  - Extraction of key metrics like average selling price, total sold items, and sales trends.

---

## **Technologies Used**
1. **Python**: Core language for implementation.
2. **eBay API**:
   - Used to fetch real-time and historical sales data.
   - Provides structured data for sold items based on customizable queries.
3. **Terapeak**:
   - For enhanced analytics and sales insights not covered by the eBay API.
4. **Selenium**:
   - Handles dynamic content scraping for data unavailable via the eBay API or Terapeak.
   - Automates browser interactions for precise data extraction.
5. **Pandas**:
   - For data manipulation and cleaning.
   - Outputs the final data in user-friendly formats like CSV or Excel.
6. **Requests/HTTP**:
   - Handles direct interactions with the eBay API.

---

## **How It Works**
1. **Data Sources**:
   - Connects to the eBay API to retrieve sold item statistics.
   - Extracts additional insights from Terapeak for deeper analysis.
   - Uses Selenium to scrape any supplementary or restricted data directly from the eBay platform.

2. **Workflow**:
   - User specifies search parameters (keywords, categories, date ranges).
   - Application fetches data via the eBay API and Terapeak.
   - Selenium automates the browser to extract dynamic or inaccessible data.
   - Data is processed, cleaned, and structured using Python and Pandas.

3. **Output**:
   - Consolidated and clean data saved in formats like CSV, JSON, or Excel.
   - Statistics include:
     - Total sales volume.
     - Average selling prices.
     - Most frequently sold items.
     - Seasonal or temporal sales trends.

---

## **Setup and Installation**
### Prerequisites
- Python 3.9 or higher.
- API keys for eBay Developer Program.
- Terapeak account access.
- WebDriver (e.g., ChromeDriver) for Selenium.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/GeniusSecret1117/eBay-Sold-Items-Statistics-Scraper
   cd ebay-sold-items-scraper
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up API credentials:
   - Add your eBay API keys to a `.env` file or directly in the script's configuration.

4. Install WebDriver for Selenium:
   - Download and install the appropriate WebDriver (e.g., ChromeDriver) and ensure it matches your browser version.

---

## **Usage**
1. Configure search parameters in the script or a config file:
   - Keywords, categories, date ranges, and other filters.
2. Run the script:
   ```bash
   python main.py
   ```
3. Check the output file in the `/output` directory.

---

## **Future Enhancements**
- Add support for more marketplaces beyond eBay.
- Implement a dashboard for real-time data visualization.
- Integrate machine learning for sales prediction and pricing optimization.
- Enhance error handling and logging.

---

## **License**
This project is licensed under the MIT License. See the LICENSE file for details.

---

## **Acknowledgments**
- eBay for providing the API and Terapeak platform.
- Selenium for enabling dynamic scraping.
- Open-source Python libraries for simplifying data handling and automation.
