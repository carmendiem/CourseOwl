from pymongo import MongoClient

def get_aliases():
    # Connect to MongoDB
    client = MongoClient('mongodb+srv://kgovil1234:mSLNfQXEPFLKOmTw@gaanducluster.wtpdb.mongodb.net/')  # Replace with your MongoDB URI if different
    db = client['course_data']
    collection = db['course_info']
    aliases = set()

    # Fetch all documents from the collection
    courses = collection.find()

    # Iterate over each course
    for course in courses:
        emails = course.get('professor_emails', [])
        for email in emails:
            if '@purdue.edu' in email:
                alias = email.split('@')[0]
                aliases.add(alias)

    # Close the MongoDB connection
    client.close()
    return aliases


