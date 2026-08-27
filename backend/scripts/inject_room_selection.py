import json

path = 'flow_json/hotel_booking_flow.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def get_screen_index(screen_id):
    for i, s in enumerate(data['screens']):
        if s['id'] == screen_id:
            return i
    return -1

# 1. Create FULL Room Selection Screen Object
new_screen = {
    "id": "ROOM_SELECTION",
    "title": "Select Room",
    "data": {
        "city": {"type": "string", "__example__": "Jaipur"},
        "hotel_id": {"type": "string", "__example__": "abc"},
        "hotel_name": {"type": "string", "__example__": "Fairmont Jaipur"},
        "hotel_price_raw": {"type": "number", "__example__": 10000},
        "hotel_price": {"type": "string", "__example__": "₹10,000/night"},
        "hotel_rating": {"type": "string", "__example__": "5/5"},
        "hotel_image_url": {"type": "string", "__example__": "base64str"},
        "img_room1": {"type": "string", "__example__": "base64str"},
        "room_options": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "title": {"type": "string"},
                    "description": {"type": "string"}
                }
            },
            "__example__": [{"id": "deluxe", "title": "Deluxe Room", "description": "Standard"}]
        }
    },
    "layout": {
        "type": "SingleColumnLayout",
        "children": [
            {
                "type": "Form",
                "name": "room_select_form",
                "init-values": {
                    "room_id": "deluxe"
                },
                "children": [
                    {
                        "type": "Image",
                        "src": "${data.img_room1}",
                        "height": 140,
                        "scale-type": "cover"
                    },
                    {
                        "type": "TextHeading",
                        "text": "Choose Accommodation Tier"
                    },
                    {
                        "type": "TextBody",
                        "text": "Review our refined room selections below tailored for exceptional comfort."
                    },
                    {
                        "type": "RadioButtonsGroup",
                        "name": "room_id",
                        "label": "Select Room Category",
                        "required": True,
                        "data-source": "${data.room_options}"
                    },
                    {
                        "type": "Footer",
                        "label": "Select Dates",
                        "on-click-action": {
                            "name": "data_exchange",
                            "payload": {
                                "room_id": "${form.room_id}",
                                "hotel_id": "${data.hotel_id}",
                                "city": "${data.city}",
                                "hotel_name": "${data.hotel_name}",
                                "hotel_image_url": "${data.hotel_image_url}",
                                "hotel_price_raw": "${data.hotel_price_raw}",
                                "hotel_price": "${data.hotel_price}",
                                "hotel_rating": "${data.hotel_rating}"
                            }
                        }
                    }
                ]
            }
        ]
    }
}

# 2. Insert after HOTEL_DETAIL screen index
idx = get_screen_index('HOTEL_DETAIL')
if idx != -1:
    # Remove old if exists for clean run
    existing = get_screen_index('ROOM_SELECTION')
    if existing != -1:
        data['screens'].pop(existing)
        # Re-find after pop
        idx = get_screen_index('HOTEL_DETAIL')
        
    data['screens'].insert(idx + 1, new_screen)
    print("Successfully inserted ROOM_SELECTION screen into Flow definition.")
else:
    print("CRITICAL ERROR: HOTEL_DETAIL screen NOT found. Aborting.")
    exit(1)

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Master JSON patched with Room Selection screen successfully.")
