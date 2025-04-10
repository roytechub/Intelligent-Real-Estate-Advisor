import random
from typing import Dict, Any, List

def predict_property_prices(city: str, bhk: int, location: str = None) -> List[Dict[str, Any]]:
    """
    Simulate property price predictions based on city, BHK, and optional location.
    In a real application, this would use a trained ML model.
    """
    # Base prices for different cities (in INR)
    city_base_prices = {
        "Mumbai": 15000000,
        "Delhi": 12000000,
        "Bangalore": 10000000,
        "Hyderabad": 8000000,
        "Chennai": 7500000,
        "Pune": 7000000,
        "Kolkata": 6000000
    }
    
    # BHK multiplier
    bhk_multiplier = int(bhk) * 0.5 + 0.5  # 1BHK: 1x, 2BHK: 1.5x, 3BHK: 2x, etc.
    
    # Get base price for the city
    base_price = city_base_prices.get(city, 10000000)
    
    # Generate 5 locations if none specified
    if not location or location.strip() == "":
        if city == "Mumbai":
            locations = ["Andheri", "Bandra", "Powai", "Worli", "Malad"]
        elif city == "Delhi":
            locations = ["Dwarka", "Rohini", "Vasant Kunj", "Saket", "Mayur Vihar"]
        elif city == "Bangalore":
            locations = ["Whitefield", "Koramangala", "HSR Layout", "Indiranagar", "Electronic City"]
        elif city == "Hyderabad":
            locations = ["Gachibowli", "Madhapur", "Kondapur", "Kukatpally", "Banjara Hills"]
        elif city == "Chennai":
            locations = ["Adyar", "T Nagar", "Velachery", "Anna Nagar", "Porur"]
        elif city == "Pune":
            locations = ["Kothrud", "Viman Nagar", "Hinjewadi", "Baner", "Kharadi"]
        elif city == "Kolkata":
            locations = ["Salt Lake", "New Town", "Ballygunge", "Alipore", "Behala"]
        else:
            locations = ["Area 1", "Area 2", "Area 3", "Area 4", "Area 5"]
    else:
        # If location is specified, include it and 4 nearby areas
        locations = [location, f"North {location}", f"South {location}", f"East {location}", f"West {location}"]
    
    # Generate predictions for each location
    predictions = []
    for loc in locations:
        # Location factor (random variation to simulate different areas)
        location_factor = random.uniform(0.8, 1.2)
        
        # Calculate price
        price = base_price * bhk_multiplier * location_factor
        
        predictions.append({
            "location": loc,
            "price": int(price)
        })
    
    # Sort by price
    predictions.sort(key=lambda x: x["price"])
    
    return predictions

def calculate_affordability(annual_salary: float, property_price: float) -> float:
    """
    Calculate affordability score based on annual salary and property price.
    Returns a score from 0-10 where 10 is most affordable.
    """
    # Assume a person can afford a property worth 5 times their annual salary
    affordable_price = annual_salary * 5
    
    # Calculate ratio of affordable price to actual price
    ratio = affordable_price / property_price
    
    # Convert to a 0-10 scale
    score = min(10, max(0, ratio * 5))
    
    return round(score, 1)

def suggest_locations(city: str, bhk: int, annual_salary: float) -> List[Dict[str, Any]]:
    """
    Suggest locations based on affordability and other factors.
    """
    # Get price predictions
    predictions = predict_property_prices(city, bhk)
    
    # Calculate affordability for each location
    locations = []
    for pred in predictions:
        affordability_score = calculate_affordability(annual_salary, pred["price"])
        
        # Generate random growth potential and amenities for demonstration
        growth_potential = round(random.uniform(3, 9), 1)
        
        # Possible amenities
        all_amenities = [
            "Metro Station", "Schools", "Hospitals", "Shopping Malls", 
            "Parks", "Restaurants", "Gyms", "Supermarkets", "IT Parks",
            "Entertainment"
        ]
        
        # Select 3-5 random amenities
        num_amenities = random.randint(3, 5)
        amenities = random.sample(all_amenities, num_amenities)
        
        locations.append({
            "name": pred["location"],
            "price": pred["price"],
            "affordabilityScore": affordability_score,
            "growthPotential": growth_potential,
            "amenities": amenities
        })
    
    # Sort by a combination of affordability and growth potential
    locations.sort(key=lambda x: (x["affordabilityScore"] * 0.7 + x["growthPotential"] * 0.3), reverse=True)
    
    return locations