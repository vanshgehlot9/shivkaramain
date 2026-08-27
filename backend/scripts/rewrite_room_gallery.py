import json

path = 'flow_json/hotel_booking_flow.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def get_screen_index(screen_id):
    for i, s in enumerate(data['screens']):
        if s['id'] == screen_id:
            return i
    return -1

idx = get_screen_index('ROOM_SELECTION')
if idx == -1:
    print("Screen missing! Aborting.")
    exit(1)

# Complete rewrite of ROOM_SELECTION screen data & layout!
revised_screen = {
    "id": "ROOM_SELECTION",
    "title": "Room Details",
    "data": {
        "city": {"type": "string", "__example__": "Jaipur"},
        "hotel_id": {"type": "string", "__example__": "abc"},
        "hotel_name": {"type": "string", "__example__": "Fairmont"},
        "hotel_price_raw": {"type": "number", "__example__": 10000},
        "hotel_price": {"type": "string", "__example__": "₹10,000/night"},
        "hotel_rating": {"type": "string", "__example__": "5/5"},
        "hotel_image_url": {"type": "string", "__example__": "base64str"},
        "img_room1": {"type": "string", "__example__": "base64str"},
        "img_room2": {"type": "string", "__example__": "base64str"},
        "img_room3": {"type": "string", "__example__": "base64str"},
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
                        "type": "TextHeading",
                        "text": "Refined Tier Selection"
                    },
                    {
                        "type": "TextBody",
                        "text": "Preview our uniquely positioned accommodations available for you below."
                    },
                    # --- Card 1 ---
                    {
                        "type": "TextSubheading",
                        "text": "🛎️ 1. The Deluxe Collection"
                    },
                    {
                        "type": "Image",
                        "src": "${data.img_room1}",
                        "height": 120,
                        "scale-type": "cover"
                    },
                    # --- Card 2 ---
                    {
                        "type": "TextSubheading",
                        "text": "🌟 2. The Premium Tier"
                    },
                    {
                        "type": "Image",
                        "src": "${data.img_room2}",
                        "height": 120,
                        "scale-type": "cover"
                    },
                    # --- Card 3 ---
                    {
                        "type": "TextSubheading",
                        "text": "👑 3. The Ultra Luxury Suite"
                    },
                    {
                        "type": "Image",
                        "src": "${data.img_room3}",
                        "height": 120,
                        "scale-type": "cover"
                    },
                    # --- Final Choice Selector ---
                    {
                        "type": "TextHeading",
                        "text": "Lock In Selection"
                    },
                    {
                        "type": "RadioButtonsGroup",
                        "name": "room_id",
                        "label": "Choose Final Plan",
                        "required": True,
                        "data-source": "${data.room_options}"
                    },
                    {
                        "type": "Footer",
                        "label": "Confirm & Book Dates",
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

# Overwrite the exact existing object index in the array
data['screens'][idx] = revised_screen
print("Screen definition updated successfully with visual gallery cards.")

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Master JSON fully deployed locally.")
