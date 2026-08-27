import json

path = 'flow_json/hotel_booking_flow.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def get_screen(screen_id):
    return next((s for s in data['screens'] if s['id'] == screen_id), None)

summary = get_screen('BOOKING_SUMMARY')
if summary:
    # 1. Inject new data schema items for composite rendering strings
    new_keys = {
        "guest_summary_label": "👥 2 adults",
        "guest_name_label": "👤 Rajesh Kumar",
        "guest_phone_label": "📱 +919999999999",
        "price_breakdown_label": "💰 ₹5,135 x 3 nights"
    }
    for k, example in new_keys.items():
        summary['data'][k] = {
            "type": "string",
            "__example__": example
        }
        print(f"Registered schema key: {k}")

    # 2. Rewire layout components to single dynamic variables
    children = summary['layout']['children'][0]['children']
    replacements = {
        "👥 ${data.guest_summary}": "${data.guest_summary_label}",
        "👤 ${data.guest_name}": "${data.guest_name_label}",
        "📱 ${data.guest_phone}": "${data.guest_phone_label}",
        "💰 ${data.price_breakdown}": "${data.price_breakdown_label}",
        "Total: ${data.total_amount_display}": "${data.total_amount_display}",
        "Payment: ${data.payment_method_label}": "${data.payment_method_label}"
    }
    
    count = 0
    for comp in children:
        current_text = comp.get('text', '')
        if current_text in replacements:
            comp['text'] = replacements[current_text]
            print(f"Successfully patched UI field: '{current_text}' -> '{comp['text']}'")
            count += 1
    
    print(f"Modified total of {count} fields in Summary view.")

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Master cleanup of Booking Summary complete!")
