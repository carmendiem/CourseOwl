# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from collections import defaultdict
# import time

# class RMPProfessor:
#     def __init__(self, first_name, last_name):
#         self.skip = 0
#         self.first_name = first_name
#         self.last_name = last_name
#         self.tag_frequency = defaultdict(int)

#         # Build request endpoint for the professor search
#         self.rmp_professors_endpoint = f"https://www.ratemyprofessors.com/search/professors/783?q={self.first_name}%20{self.last_name}"

#         # Instantiate Chrome Options
#         self.options = webdriver.ChromeOptions()
#         self.options.add_argument('--headless')  # Headless mode
#         self.options.add_argument('--ignore-certificate-errors')
#         self.options.add_argument('--ignore-ssl-errors')

#         # Create web driver
#         self.driver = webdriver.Chrome(options=self.options)
#         # Load the RMP professors search page
#         self.driver.get(self.rmp_professors_endpoint)

#         self.load_professor_profile()
#         if (self.skip == 0):
#             self.load_all_reviews()
#             self.extract_tags()
#         self.driver.quit()

#     def load_professor_profile(self):
#         try:
#             # Find the first professor card element and get the href attribute
#             professor_card = WebDriverWait(self.driver, 10).until(
#                 EC.presence_of_element_located((By.CSS_SELECTOR, "a.TeacherCard__StyledTeacherCard-syjs0d-0"))
#             )

#             # Extract the href attribute from the card element
#             self.professor_href = professor_card.get_attribute("href")
            
#             # Navigate directly to the professor's profile page
#             self.driver.get(self.professor_href)
#             rating_element = WebDriverWait(self.driver, 10).until(
#                 EC.presence_of_element_located((By.CSS_SELECTOR, "div.RatingValue__Numerator-qw8sqy-2"))
#             )
    
#             # Extract the rating
#             self.professor_rating = rating_element.text
#             if (self.professor_rating.strip() == 'N/A'):
#                 self.skip = 1
#                 return
#             # Wait for the reviews list to load
#             WebDriverWait(self.driver, 10).until(
#                 EC.presence_of_element_located((By.ID, "ratingsList"))
#             )

#         except Exception as e:
#             # print(f"Error navigating to the professor's profile: {e}")
#             # self.driver.quit()
#             # exit()
#             raise Exception("RateMyProfessor")


#     def set_load_more_button(self):
#         try:
#             # Find the 'Load More Ratings' button and assign an ID to it
#             load_more_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Load More Ratings')]")
#             self.driver.execute_script("arguments[0].setAttribute('id','LoadMoreButton');", load_more_button)
#             self.load_more_button = load_more_button
#         except:
#             self.load_more_button = None

#     def push_load_more_button(self):
#         try:
#             # Click the 'Load More Ratings' button
#             self.driver.execute_script("arguments[0].click();", self.load_more_button)
#             time.sleep(2)
#             # After clicking, reset the button
#             self.set_load_more_button()
#         except:
#             self.load_more_button = None

#     def load_all_reviews(self):
#         self.set_load_more_button()
#         while self.load_more_button:
#             # print("Loading more ratings...")
#             self.push_load_more_button()
#         # print("All ratings loaded.")

#     def extract_tags(self):
#         # Now all reviews are loaded, proceed to find all reviews
#         reviews = self.driver.find_elements(By.CSS_SELECTOR, "li div.Rating__RatingBody-sc-1rhvpxz-0")
#         # Loop through each review to get the tags
#         for review in reviews:
#             # Find the tag container
#             tags = review.find_elements(By.CSS_SELECTOR, "div.RatingTags__StyledTags-sc-1boeqx2-0 span.Tag-bs9vf4-0")
#             # Iterate through the tags and count the frequency
#             for tag in tags:
#                 tag_text = tag.text.strip()
#                 self.tag_frequency[tag_text] += 1
#         # Print the tag frequencies
#         # print("Tag Frequency Dictionary:")
#         # for tag, count in self.tag_frequency.items():
#         #     print(f"{tag}: {count}")

# # if __name__ == "__main__":
# #     first_name = "Lizhi"
# #     last_name = "Shang"
# #     professor = RMPProfessor(first_name, last_name)
# #     print(professor.tag_frequency)
# #     print(professor.professor_rating)

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from collections import defaultdict
import time

class RMPProfessor:
    def __init__(self, first_name, last_name):
        self.skip = 0
        self.first_name = first_name
        self.last_name = last_name
        self.tag_frequency = defaultdict(int)
        self.professor_rating = None
        self.positive_reviews = 0
        self.negative_reviews = 0
        self.total_reviews = 0
        self.positive_percentage = 0.0
        self.negative_percentage = 0.0

        # Build request endpoint for the professor search
        self.rmp_professors_endpoint = f"https://www.ratemyprofessors.com/search/professors/783?q={self.first_name}%20{self.last_name}"

        # Instantiate Chrome Options
        self.options = webdriver.ChromeOptions()
        self.options.add_argument('--headless')  # Headless mode
        self.options.add_argument('--ignore-certificate-errors')
        self.options.add_argument('--ignore-ssl-errors')

        # Create web driver
        self.driver = webdriver.Chrome(options=self.options)
        # Load the RMP professors search page
        self.driver.get(self.rmp_professors_endpoint)

        try:
            self.load_professor_profile()
            if self.skip == 0:
                self.load_all_reviews()
                self.extract_tags_and_ratings()
        finally:
            self.driver.quit()

    def load_professor_profile(self):
        try:
            # Find the first professor card element and get the href attribute
            professor_card = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "a.TeacherCard__StyledTeacherCard-syjs0d-0"))
            )

            # Extract the href attribute from the card element
            self.professor_href = professor_card.get_attribute("href")
            
            # Navigate directly to the professor's profile page
            self.driver.get(self.professor_href)
            rating_element = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "div.RatingValue__Numerator-qw8sqy-2"))
            )
    
            # Extract the rating
            self.professor_rating = rating_element.text
            if self.professor_rating.strip() == 'N/A':
                self.skip = 1
                return
            # Wait for the reviews list to load
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.ID, "ratingsList"))
            )

        except Exception as e:
            print(f"Error navigating to the professor's profile: {e}")
            raise Exception("RateMyProfessor")

    def set_load_more_button(self):
        try:
            # Find the 'Load More Ratings' button and assign an ID to it
            load_more_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Load More Ratings')]")
            self.driver.execute_script("arguments[0].setAttribute('id','LoadMoreButton');", load_more_button)
            self.load_more_button = load_more_button
        except:
            self.load_more_button = None

    def push_load_more_button(self):
        try:
            # Click the 'Load More Ratings' button
            self.driver.execute_script("arguments[0].click();", self.load_more_button)
            time.sleep(2)
            # After clicking, reset the button
            self.set_load_more_button()
        except:
            self.load_more_button = None

    def load_all_reviews(self):
        self.set_load_more_button()
        while self.load_more_button:
            # print("Loading more ratings...")
            self.push_load_more_button()
        # print("All ratings loaded.")

    def extract_tags_and_ratings(self):
        # Now all reviews are loaded, proceed to find all reviews
        reviews = self.driver.find_elements(By.CSS_SELECTOR, "li div.Rating__RatingBody-sc-1rhvpxz-0")
        # Loop through each review to get the tags and quality ratings
        for review in reviews:
            # Extract quality rating
            try:
                # Locate the quality rating element
                quality_element = review.find_element(By.XPATH, ".//div[contains(@class, 'CardNumRating__CardNumRatingNumber')]")
                quality_rating = float(quality_element.text.strip())
                self.total_reviews += 1
                if quality_rating >= 3.0:
                    self.positive_reviews += 1
                else:
                    self.negative_reviews += 1
            except Exception as e:
                print(f"Error extracting quality rating: {e}")
                continue  # Skip to the next review if quality rating not found

            # Extract tags
            try:
                # Find the tag container
                tags = review.find_elements(By.CSS_SELECTOR, "div.RatingTags__StyledTags-sc-1boeqx2-0 span.Tag-bs9vf4-0")
                # Iterate through the tags and count the frequency
                for tag in tags:
                    tag_text = tag.text.strip()
                    self.tag_frequency[tag_text] += 1
            except Exception as e:
                print(f"Error extracting tags: {e}")
                continue  # Skip to the next review if tags not found

        # Calculate percentages
        if self.total_reviews > 0:
            self.positive_percentage = (self.positive_reviews / self.total_reviews) * 100
            self.negative_percentage = (self.negative_reviews / self.total_reviews) * 100
        else:
            self.positive_percentage = 0.0
            self.negative_percentage = 0.0
        # print(f"Overall Rating: {self.professor_rating}")
        # print(f"Total Reviews: {self.total_reviews}")
        # print(f"Positive Reviews: {self.positive_reviews} ({self.positive_percentage:.2f}%)")
        # print(f"Negative Reviews: {self.negative_reviews} ({self.negative_percentage:.2f}%)")
        # print("Tag Frequency Dictionary:")
        # for tag, count in self.tag_frequency.items():
        #     print(f"{tag}: {count}")

# first_name = "Buster"
# last_name = "Dunsmore"
# professor = RMPProfessor(first_name, last_name)