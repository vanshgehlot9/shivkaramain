from app.repositories.firestore import _get_db
import traceback

def backfill_coords():
    db = _get_db()
    
    city_map = {
        'jaipur': (26.9124, 75.7873),
        'jodhpur': (26.2389, 73.0243),
        'udaipur': (24.5854, 73.7125),
        'mumbai': (19.0760, 72.8777),
        'new delhi': (28.6139, 77.2090),
        'delhi': (28.6139, 77.2090)
    }

    try:
        hotels = db.collection('hotels').get()
        count = 0
        for doc in hotels:
            data = doc.to_dict()
            city_key = data.get('city', '').lower().strip()
            
            # Determine best coordinates
            lat, lon = city_map.get(city_key, (26.9124, 75.7873)) # Default to Jaipur if unknown
            
            # If hotel name implies specific variance, tweak it slightly for aesthetics
            # (just minor randomization so maps don't overlap perfectly if multiple)
            import random
            lat += random.uniform(-0.005, 0.005)
            lon += random.uniform(-0.005, 0.005)
            
            doc.reference.update({
                'latitude': round(lat, 6),
                'longitude': round(lon, 6)
            })
            count += 1
            print(f"Updated {data.get('name')} in {city_key} with coords: {lat},{lon}")
        
        print(f"Backfill complete! {count} hotels updated.")
    except Exception:
        traceback.print_exc()

if __name__ == '__main__':
    backfill_coords()
