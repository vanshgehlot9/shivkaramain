import pandas as pd

menu_data = [
    # Breakfast
    {"name": "Masala Poha", "price": 60, "category": "Breakfast", "type": "veg", "description": "Light and healthy flattened rice with peanuts and curry leaves."},
    {"name": "Vegetable Upma", "price": 70, "category": "Breakfast", "type": "veg", "description": "Semolina porridge with fresh garden vegetables."},
    {"name": "Masala Dosa", "price": 90, "category": "Breakfast", "type": "veg", "description": "Crispy rice crepe stuffed with spiced potato mash."},
    {"name": "Idli Sambar (2 pcs)", "price": 60, "category": "Breakfast", "type": "veg", "description": "Steamed rice cakes served with tangy lentil soup."},
    {"name": "Aloo Paratha with Curd", "price": 80, "category": "Breakfast", "type": "veg", "description": "Wheat flatbread stuffed with spiced potatoes."},
    {"name": "Paneer Paratha", "price": 100, "category": "Breakfast", "type": "veg", "description": "Wheat flatbread stuffed with grated cottage cheese."},
    {"name": "Veg Grilled Sandwich", "price": 85, "category": "Breakfast", "type": "veg", "description": "Classic triple decker sandwich with fresh veggies."},
    {"name": "Cheese Tomato Toast", "price": 75, "category": "Breakfast", "type": "veg", "description": "Toasted bread with melted cheese and juicy tomatoes."},
    
    # Main Course
    {"name": "Dal Tadka", "price": 140, "category": "Main Course", "type": "veg", "description": "Yellow lentils tempered with cumin, garlic and red chilies."},
    {"name": "Mix Vegetable Curry", "price": 160, "category": "Main Course", "type": "veg", "description": "Seasonal vegetables cooked in a rich tomato-onion gravy."},
    {"name": "Paneer Butter Masala", "price": 220, "category": "Main Course", "type": "veg", "description": "Cottage cheese cubes in a creamy butter and tomato sauce."},
    {"name": "Kadai Paneer", "price": 230, "category": "Main Course", "type": "veg", "description": "Paneer cooked with bell peppers and freshly ground spices."},
    {"name": "Malai Kofta", "price": 210, "category": "Main Course", "type": "veg", "description": "Deep fried paneer dumplings in a creamy cashew gravy."},
    {"name": "Jeera Rice", "price": 120, "category": "Main Course", "type": "veg", "description": "Aromatic basmati rice tempered with cumin seeds."},
    {"name": "Veg Hyderabadi Biryani", "price": 180, "category": "Main Course", "type": "veg", "description": "Slow-cooked basmati rice with veggies and exotic spices."},
    {"name": "Butter Roti", "price": 15, "category": "Main Course", "type": "veg", "description": "Soft whole wheat bread topped with butter."},
    {"name": "Garlic Naan", "price": 50, "category": "Main Course", "type": "veg", "description": "Leavened oven-baked flatbread flavored with garlic."},
    
    # Drinks & Snacks
    {"name": "Masala Chai", "price": 30, "category": "Drinks & Snacks", "type": "veg", "description": "Classic Indian tea brewed with ginger and cardamom."},
    {"name": "Hot Coffee", "price": 40, "category": "Drinks & Snacks", "type": "veg", "description": "Rich and creamy freshly brewed coffee."},
    {"name": "Cold Coffee with Ice Cream", "price": 95, "category": "Drinks & Snacks", "type": "veg", "description": "Chilled coffee blended with vanilla ice cream."},
    {"name": "Fresh Lime Soda", "price": 55, "category": "Drinks & Snacks", "type": "veg", "description": "Refreshing lime drink with your choice of salt/sugar."},
    {"name": "Veg Pakora", "price": 110, "category": "Drinks & Snacks", "type": "veg", "description": "Crispy deep-fried vegetable fritters."},
    {"name": "French Fries", "price": 90, "category": "Drinks & Snacks", "type": "veg", "description": "Classic crispy golden potato fries."},
    {"name": "Paneer Tikka (6 pcs)", "price": 240, "category": "Drinks & Snacks", "type": "veg", "description": "Marinated paneer cubes grilled in a tandoor."},
    {"name": "Veg Manchurian Dry", "price": 150, "category": "Drinks & Snacks", "type": "veg", "description": "Deep fried veg balls in a tangy soy-garlic sauce."},
    
    # Desserts
    {"name": "Gulab Jamun (2 pcs)", "price": 60, "category": "Desserts", "type": "veg", "description": "Warm milk solids dumplings soaked in cardamom syrup."},
    {"name": "Rasgulla (2 pcs)", "price": 50, "category": "Desserts", "type": "veg", "description": "Soft and spongy cottage cheese balls in sugar syrup."},
    {"name": "Vanilla Ice Cream", "price": 45, "category": "Desserts", "type": "veg", "description": "Classic creamy vanilla flavored ice cream."},
    {"name": "Chocolate Brownie with Ice Cream", "price": 140, "category": "Desserts", "type": "veg", "description": "Warm chocolate brownie served with vanilla scoop."},
    {"name": "Kesari Phirni", "price": 80, "category": "Desserts", "type": "veg", "description": "Creamy rice pudding flavored with saffron and nuts."}
]

df = pd.DataFrame(menu_data)
output_path = "standard_menu.xlsx"
df.to_excel(output_path, index=False)
print(f"Standard Menu Excel created at: {output_path}")
print(f"Total items added: {len(menu_data)}")
