import json

path = 'flow_json/hotel_booking_flow.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def get_screen(screen_id):
    return next((s for s in data['screens'] if s['id'] == screen_id), None)

guest_form = get_screen('GUEST_FORM')
if guest_form:
    # 1. Update Schema (Add variables to screen data model)
    guest_form['data']['guest_name_prefill'] = {
        "type": "string",
        "__example__": "Vansh Gehlot"
    }
    guest_form['data']['guest_phone_prefill'] = {
        "type": "string",
        "__example__": "917877218473"
    }
    print("Added schema definitions for autofill variables.")

    # 2. Update Layout Components with init-value
    try:
        # Extract form's child components recursively or directly
        children = guest_form['layout']['children'][0]['children']
        for child in children:
            if child.get('type') == 'TextInput':
                name = child.get('name')
                if name == 'guest_name':
                    child['init-value'] = '${data.guest_name_prefill}'
                    print("Linked guest_name prefill.")
                elif name == 'guest_phone':
                    child['init-value'] = '${data.guest_phone_prefill}'
                    print("Linked guest_phone prefill.")
    except Exception as e:
        print(f"Layout iteration failed: {e}")

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Successfully wired GUEST_FORM with autofill variables!")
