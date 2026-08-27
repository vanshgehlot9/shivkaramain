import json

path = 'flow_json/hotel_booking_flow.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def get_screen(screen_id):
    return next((s for s in data['screens'] if s['id'] == screen_id), None)

hotel_list = get_screen('HOTEL_LIST')
if hotel_list:
    # 1. Register Schema Keys
    hotel_list['data']['city_header_label'] = {
        "type": "string",
        "__example__": "Hotels in Jodhpur"
    }
    hotel_list['data']['hotel_count_label'] = {
        "type": "string",
        "__example__": "3 hotel(s) available"
    }
    
    # 2. Link components in layout
    children = hotel_list['layout']['children'][0]['children']
    for comp in children:
        if comp.get('type') == 'TextHeading' and '${data.city}' in comp.get('text', ''):
            comp['text'] = '${data.city_header_label}'
            print("Updated TextHeading -> city_header_label")
        
        if comp.get('type') == 'TextBody' and '${data.hotel_count}' in comp.get('text', ''):
            comp['text'] = '${data.hotel_count_label}'
            print("Updated TextBody -> hotel_count_label")

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("HOTEL_LIST screen JSON successfully patched with backend label references.")
