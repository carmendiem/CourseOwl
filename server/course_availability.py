import time
from pymongo import MongoClient
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# MongoDB setup
client = MongoClient('mongodb+srv://carmendiem2003:L0w7i3EeU1rlrx4v@courseowl.sne0b.mongodb.net/?tls=true&tlsAllowInvalidCertificates=true')

db = client['course_data']
users_collection = db['users']
courses_collection = db['course_info3']

# Selenium setup for Chrome
options = webdriver.ChromeOptions()
options.add_argument('--headless')
options.add_argument('--ignore-certificate-errors')
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# Step 1: Get all avail_ids from user collection
all_avail_ids = []

for user in users_collection.find():
   if ("avail_ids" in user):
        all_avail_ids.extend(user['avail_ids'])

print(all_avail_ids)
# Step 2: Get courses with matching _id in avail_ids from course_info4 collection
courses = courses_collection.find({"_id": {"$in": all_avail_ids}})

# Loop through each course's availability URL and scrape availability details
for course in courses:
    course_url = course.get("avail_url")
    if not course_url:
        continue  # Skip if no avail_url

    # Navigate to the availability URL
    while True:
        driver.get(course_url)
        # WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.TAG_NAME, 'body')))
        WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CLASS_NAME, 'datadisplaytable')))

        page_source = driver.page_source
        if "received too many requests" not in page_source:
            break  # Exit the loop if no error message is found
        else:
            print("Received 'too many requests' message, waiting to retry...")
            # time.sleep(10)  # Wait before retrying


    soup = BeautifulSoup(page_source, 'html.parser')
    
    # Extract availability info (Capacity, Actual, Remaining)
    availability_table = soup.find('table', {'summary': 'This layout table is used to present the seating numbers.'})
    if availability_table:
        availability_rows = availability_table.find_all('tr')
        if len(availability_rows) > 1:
            # The second row contains the seating data
            seat_numbers = availability_rows[1].find_all('td')
            if len(seat_numbers) == 3:
                capacity = seat_numbers[0].text.strip()
                actual = seat_numbers[1].text.strip()
                remaining = seat_numbers[2].text.strip()

                # Update course_info4 with course availability data
                courses_collection.update_one(
                    {"_id": course["_id"]},
                    {"$set": {"course_availability":int(remaining)}}
                )

# Close the browser
driver.quit()
