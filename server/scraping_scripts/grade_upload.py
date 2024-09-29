import pandas as pd
from pymongo import MongoClient

client = MongoClient('mongodb+srv://')
db = client['course_data']
collection = db['course_info']


def clean_professor_name(professor_name):

    professor_name = professor_name.replace("(P)", "").strip()
    name_parts = professor_name.split()
    if len(name_parts) > 2:
        return f"{name_parts[0]} {name_parts[-1]}"
    elif len(name_parts) == 2:
        return " ".join(name_parts)
    else:
        return name_parts[0] if name_parts else None


file_path = 'path/normalized_and_rounded_grade_distributions.xlsx'
grade_data = pd.read_excel(file_path, sheet_name=None)


for sheet_name, df in grade_data.items():
    print(f"Processing sheet: {sheet_name}")

    df['course_code'] = df['Course Code']
    df['Professor'] = df['Professor'].apply(clean_professor_name)

    for idx, row in df.iterrows():
        course_code = row['course_code']
        professor_name = row['Professor']

        grade_distribution = {
            'A+': row['A+'],
            'A': row['A'],
            'A-': row['A-'],
            'B+': row['B+'],
            'B': row['B'],
            'B-': row['B-'],
            'C+': row['C+'],
            'C': row['C'],
            'C-': row['C-'],
            'D+': row['D+'],
            'D': row['D'],
            'D-': row['D-'],
            'E': row['E'],
            'F': row['F'],
            'AU': row['AU']
        }

        query = {
            'course_code': course_code,
            'Instructors.name': professor_name
        }

        update = {
            '$set': {
                'Instructors.$[prof].grade_distribution': grade_distribution
            }
        }

        array_filters = [{'prof.name': professor_name}]

        result = collection.update_many(query, update, array_filters=array_filters)

        if result.modified_count > 0:
            print(f"Updated {result.modified_count} document(s) for course: {course_code}, professor: {professor_name}")
        else:
            print(f"No match found for course: {course_code}, professor: {professor_name}")
            

print("Processing complete")
