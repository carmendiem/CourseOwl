from alias_professors import get_aliases 
from prof_scraping import search_all_professors
from rate_my_prof_scraping import RMPProfessor
from pymongo import MongoClient
import os

COUNTER_FILE = 'update_counter.txt'

def read_counter(file_path):
    if not os.path.exists(file_path):
        # If the file doesn't exist, initialize the counter to 0
        return 0
    try:
        with open(file_path, 'r') as f:
            count = int(f.read().strip())
            return count
    except (ValueError, IOError) as e:
        print(f"Error reading counter file: {e}. Initializing counter to 0.")
        return 0

def write_counter(file_path, count):
    try:
        with open(file_path, 'w') as f:
            f.write(str(count))
    except IOError as e:
        print(f"Error writing to counter file: {e}.")

def insert_prof_info():
    aliases = get_aliases()
    search_all_professors(aliases)


# def get_all_info():
#     aliases = get_aliases()
#     all_req_info = {}

#     # Connect to MongoDB
#     client = MongoClient('mongodb+srv://kgovil1234:mSLNfQXEPFLKOmTw@gaanducluster.wtpdb.mongodb.net/')  # Replace with your MongoDB URI if different
#     db = client['course_data']
#     professors_collection = db['professors3']
    
#     for alias in aliases:
#         # Fetch the professor document
#         professor_doc = professors_collection.find_one({'ALIAS': alias})
#         if not professor_doc:
#             print(f"No document found for alias '{alias}'. Skipping.")
#             continue

#         # Check if 'rating' field already exists
#         if 'rating' in professor_doc and professor_doc['rating'] is not None:
#             print(f"Professor '{professor_doc.get('NAME', '')}' already has a rating. Skipping.")
#             continue

#         name = professor_doc.get("NAME", "")
#         if not name:
#             print(f"Professor record with alias '{alias}' has no 'NAME' field.")
#             continue

#         # Split the name into first and last names
#         parts = name.strip().split()
#         first_name = parts[0]
#         last_name = parts[-1] if len(parts) > 1 else ''

#         try:
#             # Instantiate the RMPProfessor class to scrape data
#             professor = RMPProfessor(first_name, last_name)
#             # Collect the required information
#             all_req_info[alias] = {
#                 'tags': dict(professor.tag_frequency),
#                 'rating': professor.professor_rating,
#                 'positive_percentage': professor.positive_percentage,
#                 'negative_percentage': professor.negative_percentage,
#                 'total_reviews': professor.total_reviews
#             }
#         except Exception as e:
#             print(f"Error processing professor {first_name} {last_name}: {e}")
#             # Store None for tags and ratings if an error occurs
#             all_req_info[alias] = {
#                 'tags': None,
#                 'rating': None,
#                 'positive_percentage': None,
#                 'negative_percentage': None,
#                 'total_reviews': None
#             }

#         # Prepare the document to update in MongoDB
#         update_fields = all_req_info[alias]
#         # update_fields['alias'] = alias  # Ensure the alias is included

#         # Insert or update the professor document in MongoDB
#         try:
#             professors_collection.update_one(
#                 {'ALIAS': alias},
#                 {'$set': update_fields}
#             )
#             print(f"Updated professor '{name}' with new data.")
#         except Exception as e:
#             print(f"Error updating professor '{name}' in MongoDB: {e}")

#     # Close the MongoDB connection
#     client.close()


def get_all_info():
    aliases = get_aliases()
    all_req_info = {}

    # Read the current count from the counter file
    current_count = read_counter(COUNTER_FILE)

    total_updated = 0  # Counter for the current run

    # Connect to MongoDB
    client = MongoClient('mongodb+srv://kgovil1234:mSLNfQXEPFLKOmTw@gaanducluster.wtpdb.mongodb.net/')  # Replace with your MongoDB URI if different
    db = client['course_data']
    professors_collection = db['professors3']
    
    for alias in aliases:
        # Fetch the professor document
        professor_doc = professors_collection.find_one({'ALIAS': alias})
        if not professor_doc:
            print(f"No document found for alias '{alias}'. Skipping.")
            continue

        # Check if 'rating' field already exists
        if 'rating' in professor_doc and professor_doc['rating'] is not None:
            print(f"Professor '{professor_doc.get('NAME', '')}' already has a rating. Skipping.")
            continue

        name = professor_doc.get("NAME", "")
        if not name:
            print(f"Professor record with alias '{alias}' has no 'NAME' field.")
            continue

        # Split the name into first and last names
        parts = name.strip().split()
        first_name = parts[0]
        last_name = parts[-1] if len(parts) > 1 else ''

        try:
            # Instantiate the RMPProfessor class to scrape data
            professor = RMPProfessor(first_name, last_name)
            # Collect the required information
            all_req_info[alias] = {
                'tags': dict(professor.tag_frequency),
                'rating': professor.professor_rating,
                'positive_percentage': professor.positive_percentage,
                'negative_percentage': professor.negative_percentage,
                'total_reviews': professor.total_reviews
            }
        except Exception as e:
            print(f"Error processing professor {first_name} {last_name}: {e}")
            # Store None for tags and ratings if an error occurs
            all_req_info[alias] = {
                'tags': None,
                'rating': None,
                'positive_percentage': None,
                'negative_percentage': None,
                'total_reviews': None
            }

        # Prepare the document to update in MongoDB
        update_fields = all_req_info[alias]
        # Optionally, ensure the alias is included if needed
        # update_fields['alias'] = alias

        # Insert or update the professor document in MongoDB
        try:
            result = professors_collection.update_one(
                {'ALIAS': alias},
                {'$set': update_fields}
            )
            if result.modified_count > 0:
                print(f"Updated professor '{name}' with new data.")
                # Increment the counters
                total_updated += 1
                current_count += 1
                # Write the updated count back to the counter file
                write_counter(COUNTER_FILE, current_count)
            else:
                print(f"No changes made to professor '{name}'.")
        except Exception as e:
            print(f"Error updating professor '{name}' in MongoDB: {e}")

    # Print the total count
    print(f"\nTotal records updated in this run: {total_updated}")
    print(f"Total records updated across all runs: {current_count}")

    # Close the MongoDB connection
    client.close()

# Call the function
if __name__ == "__main__":
    get_all_info()

