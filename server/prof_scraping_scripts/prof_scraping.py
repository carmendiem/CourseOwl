from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pymongo import MongoClient  # Import MongoDB client
from pymongo.errors import DuplicateKeyError

class ProfScraper:
    def __init__(self):
        # Initialize the Selenium WebDriver
        self.driver = webdriver.Chrome()
        # Open the Purdue directory page
        self.driver.get("https://www.purdue.edu/directory/")
        # Wait for the page to load and the search input to be present
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, 'basicSearchInput'))
        )

    def search_professor(self, prof_alias):
        driver = self.driver
        # Wait for the search input field to be present
        search_input = driver.find_element(By.ID, 'basicSearchInput')

        # Clear the input and enter the professor's alias
        search_input.clear()
        search_input.send_keys("alias " + prof_alias)

        # Wait for the search button to be clickable and click it
        search_button = driver.find_element(By.ID, 'glass')
        search_button.click()

        # Wait for the results to load by waiting for the results section to update
        try:
            # Wait for the results section to update
            results_section = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, 'results'))
            )
            # Wait for the first result to be present
            first_professor = WebDriverWait(results_section, 10).until(
                EC.presence_of_element_located((By.XPATH, "./ul/li"))
            )

            # Try to extract the professor's name from an <h2> tag first
            try:
                professor_name = first_professor.find_element(By.XPATH, ".//h2[@class='cn-name']").text.strip()
            except Exception:
                # If no <h2> tag is found, fall back to extracting the name from a <th> tag
                professor_name = first_professor.find_element(By.XPATH, ".//th[@scope='col']").text.strip()

            details = {}
            details["NAME"] = professor_name

            # Extract visible details
            rows = first_professor.find_elements(By.XPATH, ".//tbody/tr")
            for row in rows:
                try:
                    th_element = row.find_element(By.TAG_NAME, 'th')
                    td_element = row.find_element(By.TAG_NAME, 'td')
                    field_name = th_element.text.strip().upper()
                    value = td_element.text.strip()
                    if field_name!='' and field_name is not None:
                            details[field_name] = value
                    # details[field_name] = value
                except Exception as e:
                    print(f"Error processing row: {e}")
                    continue

            # Click "View More" and extract hidden details if any
            try:
                view_more_button = first_professor.find_element(By.XPATH, ".//a[contains(@title, 'View more')]")
                view_more_button.click()
                # Wait for the hidden content to become visible
                hidden_section = WebDriverWait(first_professor, 10).until(
                    EC.visibility_of_element_located((By.XPATH, ".//div[@class='hide' and contains(@style, 'display: block')]"))
                )
                # Now extract additional details
                hidden_table = hidden_section.find_element(By.XPATH, ".//table")
                hidden_rows = hidden_table.find_elements(By.XPATH, ".//tr")
                for row in hidden_rows:
                    try:
                        th_element = row.find_element(By.TAG_NAME, 'th')
                        td_element = row.find_element(By.TAG_NAME, 'td')
                        field_name = th_element.text.strip().upper()
                        value = td_element.text.strip()
                        
                        if field_name!='' and field_name is not None:
                            details[field_name] = value
                    except Exception as e:
                        print(f"Error processing additional row: {e}")
                        continue
            except Exception as e:
                print("No additional hidden details found or error in revealing hidden details.")
            
            return details

        except Exception as e:
            print(f"An error occurred while searching for alias '{prof_alias}': {e}")
            return None

    def close(self):
        self.driver.quit()

def search_all_professors(prof_aliases):
    prof_info = {}
    # Set up MongoDB connection
    client = MongoClient('mongodb+srv://carmendiem2003:L0w7i3EeU1rlrx4v@courseowl.sne0b.mongodb.net/')  # Adjust the URI as needed
    db = client['course_data']
    collection = db['professors3']
    collection.create_index('ALIAS', unique=True)

    scraper = ProfScraper()
    for alias in prof_aliases:
        if alias is None or collection.find_one({'ALIAS': alias}):
            print(f"Alias already processed or is None; skipping.")
            continue  # Skip to the next alias if already processed
        details = scraper.search_professor(alias)
        if details:
            prof_info[alias] = details
            
            # Insert the details into MongoDB without checking for existence
            try:
                # Insert new record
                collection.insert_one(details)
            except DuplicateKeyError:
                print(f"Duplicate entry for alias {alias}; skipping insertion.")
            except Exception as e:
                print(f"Error inserting professor {alias} into MongoDB: {e}")
    scraper.close()
    # return prof_info

# Example usage:
# if __name__ == "__main__":
#     # List of professor aliases to search for
#     aliases = ["bxd", "turkstra", "zhan1472", "sdabiris"]
#     all_professors_info = search_all_professors(aliases)
#     for alias, info in all_professors_info.items():
#         print(f"Alias: {alias}")
#         for key, value in info.items():
#             print(f"{key}: {value}")
#         print("-" * 40)
