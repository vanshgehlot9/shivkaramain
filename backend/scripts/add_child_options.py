import json

path = 'flow_json/hotel_booking_flow.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def get_screen(screen_id):
    return next((s for s in data['screens'] if s['id'] == screen_id), None)

guest_form = get_screen('GUEST_FORM')
if guest_form:
    # 1. Register schema dynamic key 'child_options'
    guest_form['data']['child_options'] = {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "id": {"type": "string"},
                "title": {"type": "string"}
            }
        },
        "__example__": [
            {"id": "0", "title": "No Children"},
            {"id": "1", "title": "1 Child"}
        ]
    }
    print("Registered 'child_options' data model.")

    # 2. Insert the component into layout beneath existing guest group
    try:
        form = guest_form['layout']['children'][0]
        children = form['children']
        
        # Create component
        new_comp = {
            "type": "RadioButtonsGroup",
            "name": "num_children",
            "label": "Number of Children",
            "required": True,
            "data-source": "${data.child_options}"
        }
        
        # Find location of num_guests to insert directly after
        idx_num_guests = next((i for i, c in enumerate(children) if c.get('name') == 'num_guests'), -1)
        if idx_num_guests != -1:
            children.insert(idx_num_guests + 1, new_comp)
            print("Inserted 'num_children' component into layout.")
        
        # 3. Set default starting value to "0" inside form init-values
        if 'init-values' not in form:
            form['init-values'] = {}
        form['init-values']['num_children'] = "0"
        print("Set default selection for children to '0'.")

    except Exception as e:
        print(f"Layout patch failure: {e}")

with open(path, 'w', encoding='utf-8') as f:
    # Make sure python true converts to JSON true
    dumped = json.dumps(data, indent=2, ensure_ascii=False)
    # replace standard boolean quirk if needed, although standard dumps does it right
    f.write(dumped)

print("JSON updated successfully for child options.")
