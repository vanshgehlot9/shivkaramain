import json

path = 'flow_json/hotel_booking_flow.json'
with open(path, 'r') as f:
    data = json.load(f)

def get_screen(screen_id):
    return next((s for s in data['screens'] if s['id'] == screen_id), None)

detail = get_screen('HOTEL_DETAIL')
if detail:
    # 1. Add keys to schema
    detail['data']['hotel_location_label'] = {
        "type": "string",
        "__example__": "📍 Jodhpur, Rajasthan"
    }
    detail['data']['hotel_price_label'] = {
        "type": "string",
        "__example__": "💰 ₹5,135 per night"
    }
    
    # 2. Correct layout text components
    try:
        # form children array
        children = detail['layout']['children'][0]['children']
        for child in children:
            if child.get('type') == 'TextBody':
                text = child.get('text', '')
                if 'hotel_location' in text:
                    child['text'] = '${data.hotel_location_label}'
                    print("Patched location component to pure binding.")
                elif 'hotel_price' in text:
                    child['text'] = '${data.hotel_price_label}'
                    print("Patched price component to pure binding.")
    except Exception as e:
        print(f"Error during layout update: {e}")

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Successfully patched HOTEL_DETAIL text bindings.")
