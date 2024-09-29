import re
from pymongo import MongoClient
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.firefox import GeckoDriverManager
from bs4 import BeautifulSoup
from selenium.common.exceptions import TimeoutException, NoSuchElementException

client = MongoClient('mongodb+srv://')
db = client['course_data']
collection = db['course_info']

def extract_course_code(course_name):
    match = re.search(r'([A-Z]{2,4} \d{5})', course_name)
    if match:
        return match.group(1)
    return None


def clean_professor_name(professor_name):
    professor_name = professor_name.replace("(P)", "").strip()
    name_parts = professor_name.split()
    if len(name_parts) > 2:
        return f"{name_parts[0]} {name_parts[-1]}"
    elif len(name_parts) == 2:
        return " ".join(name_parts)
    else:
        return name_parts[0] if name_parts else None



def clean_professor_name_and_email(instructors, email_tags):
    """
    Cleans professor names and pairs them with corresponding emails.
    Extracts 'alias' (part before @) from the email.
    Handles multiple professors and emails correctly.
    """

    instructor_info_list = []


    for i, instructor in enumerate(instructors):

        professor_name = clean_professor_name(instructor)
        professor_email = None
        alias = None
        if i < len(email_tags):
            email = email_tags[i]['href'].replace('mailto:', '').strip()
            if email:
                professor_email = email
                alias = email.split('@')[0]

        instructor_info_list.append({
            'name': professor_name,
            'email': professor_email,
            'alias': alias
        })

    return instructor_info_list

def extract_credit_hours(detail_row):

    text_content = detail_row.get_text()
    match = re.search(r'(\d+\.?\d*)\s+Credits', text_content)

    if match:
        return float(match.group(1))
    return None


def handle_pagination(driver):
    while True:
        try:
            next_button = driver.find_element(By.LINK_TEXT, "Next")
            if next_button.is_displayed():
                next_button.click()
                WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CLASS_NAME, 'datadisplaytable')))
                return True
        except NoSuchElementException:
            break
    return False


def scrape_and_upload_to_mongo():
    driver = webdriver.Firefox(service=Service(GeckoDriverManager().install()))
    driver.get("https://selfservice.mypurdue.purdue.edu/prod/BZWSLCSR.P_Prep_Search?term_in=202510&newsearch=Y")
    WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, 'subj_id')))
    subject_select = Select(driver.find_element(By.ID, 'subj_id'))
    options = subject_select.options

    for i in range(len(options)):
        subject_select = Select(driver.find_element(By.ID, 'subj_id'))
        subject_select.deselect_all()
        current_option = subject_select.options[i]
        print(f"Selecting subject: {current_option.text}")
        subject_select.select_by_visible_text(current_option.text)
        class_search_button = driver.find_element(By.XPATH, "//input[@value='Class Search']")
        class_search_button.click()

        try:
            WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.CLASS_NAME, 'datadisplaytable')))
        except TimeoutException:
            print(f"Timeout occurred when trying to load results for subject: {current_option.text}")
            continue

        while True:
            page_source = driver.page_source
            soup = BeautifulSoup(page_source, 'html.parser')
            results_table = soup.find('table', {'class': 'datadisplaytable'})

            if results_table:
                rows = results_table.find_all('tr')
                current_course_info = {}

                for j in range(len(rows)):
                    row = rows[j]
                    th_element = row.find('th')

                    if th_element:
                        course_name = th_element.text.strip()

                        if " - " in course_name:
                            if current_course_info:
                                collection.insert_one(current_course_info)
                                print(f"Inserted: {current_course_info}")

                            course_code = extract_course_code(course_name)
                            current_course_info = {
                                'course_name': course_name,
                                'course_code': course_code,
                                'Type': None, 'Time': None, 'Days': None,
                                'Where': None, 'Date Range': None, 'Schedule Type': None, 'Instructors': [],
                                'credit_hours': None
                            }

                    if current_course_info and current_course_info['Type'] is None:

                        if(current_course_info['credit_hours'] == None):
                            current_course_info['credit_hours'] = extract_credit_hours(row)

                        columns = row.find_all('td')
                        if len(columns) == 7:
                            current_course_info['Type'] = columns[0].text.strip()
                            current_course_info['Time'] = columns[1].text.strip()
                            current_course_info['Days'] = columns[2].text.strip()
                            current_course_info['Where'] = columns[3].text.strip()
                            current_course_info['Date Range'] = columns[4].text.strip()
                            current_course_info['Schedule Type'] = columns[5].text.strip()

                            instructors_text = columns[6].text.strip()
                            instructors = instructors_text.split(",")

                            email_tags = row.find_all('a', href=lambda x: x and x.startswith('mailto:'))
                            instructor_info = clean_professor_name_and_email(instructors, email_tags)
                            current_course_info['Instructors'] = instructor_info


                if current_course_info:
                    collection.insert_one(current_course_info)
                    print(f"Inserted from here: {current_course_info}")

            if not handle_pagination(driver):
                break

        driver.back()
        WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, 'subj_id')))

    driver.quit()

scrape_and_upload_to_mongo()
