import pandas as pd

fast_food_data = [
    {"name": "Veg Cheese Burger", "price": 85, "category": "Fast Food", "type": "veg", "description": "Classic veg patty burger with extra cheese slice."},
    {"name": "Aloo Tikki Burger", "price": 60, "category": "Fast Food", "type": "veg", "description": "Crispy potato patty with mayo and fresh onions."},
    {"name": "Paneer Maharaja Burger", "price": 140, "category": "Fast Food", "type": "veg", "description": "Double decker burger with grilled paneer patty."},
    
    {"name": "Margherita Pizza (7 inch)", "price": 180, "category": "Fast Food", "type": "veg", "description": "Classic cheese pizza with fresh tomato sauce."},
    {"name": "Farmhouse Pizza (7 inch)", "price": 240, "category": "Fast Food", "type": "veg", "description": "Loaded with capsicum, onion, tomato and mushrooms."},
    {"name": "Paneer Tikka Pizza (7 inch)", "price": 280, "category": "Fast Food", "type": "veg", "description": "Spicy tandoori paneer with red paprika and onions."},
    
    {"name": "Veg White Sauce Pasta", "price": 160, "category": "Fast Food", "type": "veg", "description": "Creamy Alfredo pasta with broccoli and corn."},
    {"name": "Veg Red Sauce Pasta", "price": 150, "category": "Fast Food", "type": "veg", "description": "Tangy Arrabiata pasta with olives and herbs."},
    
    {"name": "Veg Hakka Noodles", "price": 120, "category": "Fast Food", "type": "veg", "description": "Stir-fried noodles with crunchy vegetables."},
    {"name": "Paneer Fried Rice", "price": 140, "category": "Fast Food", "type": "veg", "description": "Basmati rice tossed with paneer and soy sauce."},
    {"name": "Veg Manchurian Gravy", "price": 160, "category": "Fast Food", "type": "veg", "description": "Deep fried veg balls in spicy Chinese gravy."},
    
    {"name": "Paneer Wrap", "price": 110, "category": "Fast Food", "type": "veg", "description": "Spicy paneer chunks wrapped in a soft tortilla."},
    {"name": "Veg Cheese Roll", "price": 90, "category": "Fast Food", "type": "veg", "description": "Crispy roll stuffed with cheese and mixed veggies."},
    
    {"name": "French Fries (Large)", "price": 100, "category": "Fast Food", "type": "veg", "description": "Classic salted golden crispy fries."},
    {"name": "Peri Peri Fries", "price": 120, "category": "Fast Food", "type": "veg", "description": "Fries tossed in spicy African peri-peri seasoning."},
    {"name": "Cheese Corn Nuggets (6 pcs)", "price": 130, "category": "Fast Food", "type": "veg", "description": "Melt-in-mouth cheese and corn golden nuggets."}
]

df = pd.DataFrame(fast_food_data)
output_path = "fast_food_menu.xlsx"
df.to_excel(output_path, index=False)
print(f"Fast Food Menu Excel created at: {output_path}")
print(f"Total items added: {len(fast_food_data)}")
