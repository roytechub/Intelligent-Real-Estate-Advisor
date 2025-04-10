from flask import Flask, render_template, request, jsonify
from model.predictor import predict_property_prices, suggest_locations, calculate_affordability

app = Flask(__name__)

@app.route('/')
def index():
    """ main page"""
    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    """API endpoint for property price prediction and location suggestions"""
    try:
        data = request.get_json()
        
        annual_salary = float(data.get('annualSalary', 0))
        bhk = data.get('bhk', '2')
        preferred_location = data.get('preferredLocation', '')
        city = data.get('city', 'Mumbai')
        
        # Get price predictions
        predictions = predict_property_prices(city, bhk, preferred_location)
        
        # Calculate max budget based on salary (30% of annual salary for EMI)
        monthly_salary = annual_salary / 12
        max_emi = monthly_salary * 0.3
        
        # Assuming 20-year loan at 7% interest rate
        interest_rate = 0.07 / 12  # Monthly interest rate
        loan_term_months = 20 * 12  # 20 years in months
        
        # Calculate max loan amount using EMI formula
        max_loan = max_emi * ((1 - (1 + interest_rate) ** (-loan_term_months)) / interest_rate)
        
        # Assuming 20% down payment
        max_budget = max_loan / 0.8
        
        # Get suggested locations
        suggested_locations = suggest_locations(city, bhk, annual_salary)
        
        # Calculate overall affordability score based on average property price
        avg_price = sum(p["price"] for p in predictions) / len(predictions)
        affordability_score = calculate_affordability(annual_salary, avg_price)
        
        # Prepare response
        response = {
            "predictions": predictions,
            "suggestedLocations": suggested_locations[:5],  # Top 5 suggestions
            "affordabilityScore": affordability_score,
            "maxBudget": int(max_budget)
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)