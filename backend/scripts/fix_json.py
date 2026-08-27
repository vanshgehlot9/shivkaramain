import json
import os

path = 'flow_json/hotel_booking_flow.json'
with open(path, 'r') as f:
    text = f.read()

# 1. Global replacement of "example": with "__example__":
fixed_text = text.replace('"example":', '"__example__":')

# Parse
data = json.loads(fixed_text)

# 2. Find CITY_SELECT and fix logic
city_select = next((s for s in data['screens'] if s['id'] == 'CITY_SELECT'), None)
if city_select:
    # Add boolean variable
    city_select['data']['has_error'] = {
        "type": "boolean",
        "__example__": False
    }
    # Update example of error message since blank might sometimes trigger complaints
    city_select['data']['error_message']['__example__'] = 'Error message goes here'
    
    # Locate the component using the path indicated in user error message
    # screens[0].layout.children[0].children[3]
    try:
        comp = city_select['layout']['children'][0]['children'][3]
        if comp.get('type') == 'TextBody':
            comp['visible'] = '${data.has_error}'
            print("Successfully fixed visibility on Component!")
    except Exception as e:
        print(f"Component patch error: {e}")
else:
    print("CITY_SELECT screen not found!")

# Write back output
with open(path, 'w') as f:
    json.dump(data, f, indent=2)

print("JSON migration completed successfully.")
