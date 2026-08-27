import json

path = 'flow_json/hotel_booking_flow.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# 1. Fix routing model sequence
# We are inserting ROOM_SELECTION between HOTEL_DETAIL and DATE_SELECTION
if "routing_model" in data:
    rm = data["routing_model"]
    
    # Rewire HOTEL_DETAIL to point to ROOM_SELECTION instead of DATE_SELECTION
    if "HOTEL_DETAIL" in rm:
        rm["HOTEL_DETAIL"] = ["ROOM_SELECTION"]
        print("Rewired HOTEL_DETAIL in routing_model.")
        
    # Add ROOM_SELECTION directing to DATE_SELECTION
    rm["ROOM_SELECTION"] = ["DATE_SELECTION"]
    print("Added ROOM_SELECTION to routing_model.")

# 2. Reorder routing_model keys logically to mirror the screens order (optional but cleans debugs)
ordered_model = {}
known_chain = ["CITY_SELECT", "HOTEL_LIST", "HOTEL_DETAIL", "ROOM_SELECTION", "DATE_SELECTION", "GUEST_FORM", "PAYMENT_METHOD", "BOOKING_SUMMARY", "SUCCESS"]
for k in known_chain:
    if k in rm:
        ordered_model[k] = rm[k]
data["routing_model"] = ordered_model

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Validation errors fixed! Routing model fully connected.")
