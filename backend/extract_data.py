import docx
import json

def extract_data_from_docx(docx_path):
    doc = docx.Document(docx_path)
    data = []
    
    for table in doc.tables:
        for row in table.rows[1:]:  # Skip the header row
            row_data = {
                'hrs': row.cells[0].text.strip(),
                'mins': row.cells[1].text.strip(),
                'sec': row.cells[2].text.strip(),
                'si.no': row.cells[3].text.strip(),
                'activity_name': row.cells[4].text.strip(),
                'confirmed_by': row.cells[5].text.strip()
            }
            data.append(row_data)
    
    return data

if __name__ == "__main__":
    docx_path = 'C:/Users/kshre/OneDrive/Desktop/tracker-app/countdouwn.docx'
    activities = extract_data_from_docx(docx_path)
    
    with open('activities.json', 'w') as f:
        json.dump(activities, f, indent=4)

    print("Data extracted and saved to activities.json")
