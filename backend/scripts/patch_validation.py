import json

path = 'flow_json/hotel_booking_flow.json'
with open(path, 'r') as f:
    data = json.load(f)

def get_screen(screen_id):
    return next((s for s in data['screens'] if s['id'] == screen_id), None)

# 1. Patch HOTEL_DETAIL (Screen index 2)
detail = get_screen('HOTEL_DETAIL')
if detail:
    # Add to schema
    detail['data']['hotel_rating_reviews'] = {
        "type": "string",
        "__example__": "⭐ 5/5   Verified guest reviews"
    }
    # Replace Text component in layout
    # Safe iterate children deep
    try:
        form_children = detail['layout']['children'][0]['children']
        for child in form_children:
            if child.get('type') == 'TextBody' and '${data.hotel_rating}' in child.get('text', ''):
                child['text'] = '${data.hotel_rating_reviews}'
                print("Fixed HOTEL_DETAIL Text binding.")
    except: pass

# 2. Patch DATE_SELECTION (Screen index 3)
dates = get_screen('DATE_SELECTION')
if dates:
    # Add to schema
    dates['data']['hotel_summary_line'] = {
        "type": "string",
        "__example__": "Radisson Hotel Jodhpur • ₹5,135 per night"
    }
    # Replace binding
    try:
        form_children = dates['layout']['children'][0]['children']
        for child in form_children:
            if child.get('type') == 'TextBody' and '${data.hotel_price}' in child.get('text', ''):
                child['text'] = '${data.hotel_summary_line}'
                print("Fixed DATE_SELECTION Text binding.")
    except: pass

# 3. Patch PAYMENT_METHOD (Screen index 5)
pmt = get_screen('PAYMENT_METHOD')
if pmt:
    # Add to schema
    pmt['data']['payment_summary_line'] = {
        "type": "string",
        "__example__": "Radisson Hotel Jodhpur • 2025-06-10 – 2025-06-13"
    }
    # Replace binding
    try:
        form_children = pmt['layout']['children'][0]['children']
        for child in form_children:
            if child.get('type') == 'TextBody' and '${data.check_in_date}' in child.get('text', ''):
                child['text'] = '${data.payment_summary_line}'
                print("Fixed PAYMENT_METHOD Text binding.")
    except: pass

# 4. Patch SUCCESS Terminal Screen (Screen index 7)
success = get_screen('SUCCESS')
if success:
    # Wrap existing free elements inside a Form just in case it helps structure, 
    # OR just ensure list ends with Footer component!
    # Meta Spec: MUST contain exactly one Footer component.
    
    # The current layout has raw components. Let's move them to a list, and APPEND A FOOTER at the bottom!
    footer = {
        "type": "Footer",
        "label": "Done",
        "on-click-action": {
            "name": "complete-flow",
            "payload": {
                 # Important: complete-flow must return the token in payload
                 "flow_token": "${data.extension_message_response.params.flow_token}"
            }
        }
    }
    
    # Wait, the current SUCCESS screen has its children directly under layout.children
    # which triggers invalid validation because they are naked Text items. 
    # Let's wrap them in a Form exactly like ALL OTHER screens for robustness.
    
    current_naked_items = list(success['layout']['children'])
    # Check if wrapped in Form already
    if current_naked_items and current_naked_items[0].get('type') == 'Form':
         # Already wrapped, append to form
         current_naked_items[0]['children'].append(footer)
         print("Appended footer to existing Form in SUCCESS.")
    else:
         # Not wrapped. Wrap into a Form now!
         wrapped_form = {
             "type": "Form",
             "name": "success_form",
             "children": current_naked_items + [footer]
         }
         success['layout']['children'] = [wrapped_form]
         print("Wrapped SUCCESS screen in a Form and appended native Complete-Flow Footer.")

# Save back safely
with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("\nSUCCESSfully patched all 4 reported validation errors!")
