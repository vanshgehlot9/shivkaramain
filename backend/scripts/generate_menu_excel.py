import pandas as pd
import re

menu_text = """
A. Special Vegetables
Kaju Drakh — ₹270
Kaju Curry — ₹280
Navratan Khorma — ₹240
Gulab Jamun — ₹200
Kashmiri Dum Aloo — ₹180
Stuff Tomato — ₹180
B. Paneer
Shahi Paneer — ₹220
Paneer Onion — ₹220
Handi Paneer — ₹230
Kadai Paneer — ₹230
Paneer Butter Masala — ₹225
Palak Paneer — ₹200
Mutter Paneer — ₹200
Chola Paneer — ₹210
Paneer Bhurji — ₹260
C. Kofta
Malai Kofta — ₹225
Malai Kofta (Red Gravy) — ₹210
Paneer Kofta — ₹190
D. Mushroom
Mushroom Paneer Special — ₹225
Mushroom Masala — ₹200
Mutter Mushroom — ₹190
E. Vegetables
Malai Onion — ₹220
Mix Vegetables — ₹180
Malai Mutter — ₹180
Chana Masala — ₹150
Aloo Mutter — ₹160
Gobhi Tomato — ₹160
Bhindi Tomato — ₹160
Palak Tomato — ₹160
Jeera Aloo — ₹160
Bhindi Fry — ₹180
F. Dal
Dal Makhaniya — ₹180
Dal Tadka — ₹160
Dal Fry — ₹150
Plain Dal — ₹130
Mix Dal — ₹160
G. Rajasthani Vegetables
Sev Tomato — ₹150
Haldi (In Winter) — ₹280
Ker Draksh — ₹280
Chakki — ₹200
Gatta Fried — ₹150
Lasan Chatni — ₹90
H. Raita & Curd
Bundi Raita — ₹110
Veg. Raita — ₹130
Masala Raita — ₹140
Plain Dahi — ₹80
I. Rice & Pulao
Veg Biryani — ₹160
Mutter Pulao — ₹155
Veg Pulao — ₹160
Fried Rice — ₹145
Paneer Rice — ₹160
Jeera Rice — ₹145
Plain Rice — ₹99
Kashmiri Pulao — ₹280
Hyderabadi Pulao — ₹280
J. Roti
Tandoori Roti (Plain) — ₹12
Tandoori Roti (With Ghee) — ₹16
Tawa Roti (Plain) — ₹10
Tawa Roti (With Ghee) — ₹14
Missi Roti — ₹30
K. Naan
Garlic Naan — ₹60
Plain Naan — ₹40
Butter Naan — ₹55
Stuff Naan — ₹75
L. Kulcha
Plain Kulcha — ₹40
Butter Kulcha — ₹55
Onion Kulcha — ₹55
Garlic Kulcha — ₹55
M. Paratha
Spring Paratha — ₹50
Aloo Paratha (With Ghee Tandoori) — ₹75
Aloo Paratha Fried — ₹75
Aloo Paratha (Fried Ghee) — ₹80
Paneer Paratha (With Ghee Tandoori) — ₹70
Paneer Paratha Fried — ₹90
Gobhi Paratha (With Ghee Tandoori) — ₹70
Gobhi Paratha Fried — ₹75
Gobhi Paratha (With Ghee) — ₹80
N. Papad & Salad
Papad Masala — ₹40
Papad Fried — ₹40
Papad Churi — ₹45
Papad Plain — ₹20
Green Salad — ₹40
Onion Lemon — ₹25
Papad Fried Masala — ₹45
Plain Khichiya — ₹40
Masala Khichiya Tandoori — ₹45
Masala Khichiya Fry — ₹55
O. Ice Cream
Vanilla Scoops — ₹35
Kaju Anjeer Scoops — ₹50
Pineapple Scoops — ₹45
American Nuts Scoops — ₹55
Butter Scotch Scoops — ₹45
P. Cold Drinks
Makhania Lassi — ₹55
Butter Milk — ₹15
Masala Butter Milk — ₹40
R. Rajasthani Special Vegetables
Papad Sabji — ₹150
Rabodi Sabji — ₹160
Mirchibada Sabji — ₹180
"""

rows = []
current_category = ""

for line in menu_text.split("\n"):
    line = line.strip()
    if not line:
        continue
    
    # Match Category Header like "A. Special Vegetables"
    cat_match = re.match(r'^[A-R]\.\s+(.*)', line)
    if cat_match:
        current_category = cat_match.group(1)
        continue
    
    # Match Item like "Kaju Drakh — ₹270"
    item_match = re.match(r'^(.*)\s+[—–-]\s+₹?(\d+)', line)
    if item_match:
        name = item_match.group(1).strip()
        price = item_match.group(2).strip()
        rows.append({
            "name": name,
            "price": price,
            "category": current_category,
            "type": "veg",
            "description": f"Freshly prepared {name}"
        })

df = pd.DataFrame(rows)
output_path = "menu_import.xlsx"
df.to_excel(output_path, index=False)
print(f"Excel file created at: {output_path}")
print(f"Total items parsed: {len(rows)}")
