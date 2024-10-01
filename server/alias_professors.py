from pymongo import MongoClient

def get_aliases():
    # Connect to MongoDB
    client = MongoClient('mongodb+srv://carmendiem2003:L0w7i3EeU1rlrx4v@courseowl.sne0b.mongodb.net/')  # Replace with your MongoDB URI if different
    db = client['course_data']
    collection = db['course_info']
    aliases = set()

    # Fetch all documents from the collection
    courses = collection.find()
    # Iterate over each course document
    for course in courses:
        # Access the "Instructors" list
        instructors = course.get('Instructors', [])
        for instructor in instructors:
            alias = instructor.get('alias', '')
            aliases.add(alias)
            # if '@purdue.edu' in email:
            #     alias = email.split('@')[0]  # Extract alias before '@'
                

    # Close the MongoDB connection
    client.close()
    return aliases
