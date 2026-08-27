import json

path = 'flow_json/hotel_booking_flow.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def get_screen(screen_id):
    return next((s for s in data['screens'] if s['id'] == screen_id), None)

guest_form = get_screen('GUEST_FORM')
if guest_form:
    try:
        # 1. Access the parent Form element
        form = guest_form['layout']['children'][0]
        if form.get('type') == 'Form':
            # Define init-values on the Form!
            form['init-values'] = {
                "guest_name": "${data.guest_name_prefill}",
                "guest_phone": "${data.guest_phone_prefill}"
            }
            print("Successfully added 'init-values' mapping to the parent Form!")
        
        # 2. CLEAN UP invalid property from children
        children = form['children']
        for child in children:
            if child.get('type') == 'TextInput':
                if 'init-value' in child:
                    del child['init-value']
                    print(f"Removed invalid 'init-value' from {child.get('name')}.")
    except Exception as e:
        print(f"Layout refactor failed: {e}")

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Patch complete for Form-level init-values!")
