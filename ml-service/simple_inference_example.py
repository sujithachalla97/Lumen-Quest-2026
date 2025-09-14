#!/usr/bin/env python3
"""
Simple working example of churn prediction inference
This demonstrates how to use the TelcoChurnPredictor in production
"""

import sys
sys.path.append('src')
from telco_churn_predictor import TelcoChurnPredictor

def predict_customer_churn():
    """Example of how to predict churn for a new customer"""
    
    print("🎯 SIMPLE CHURN PREDICTION EXAMPLE")
    print("=" * 40)
    
    # Initialize the predictor (do this once in your application)
    predictor = TelcoChurnPredictor(model_path='models/')
    
    # Example customer data (what you'd receive from your API/database)
    customer_data = {
        'tenure': 18,                           # 18 months with company
        'MonthlyCharges': 65.00,                # $65/month charges
        'SeniorCitizen': 0,                     # Not a senior citizen
        'Partner': 'No',                        # Single
        'Dependents': 'No',                     # No dependents
        'InternetService': 'Fiber optic',       # Fiber internet
        'Contract': 'Month-to-month',           # Month-to-month contract
        'PaperlessBilling': 'Yes',              # Uses paperless billing
        'PaymentMethod': 'Electronic check',    # Electronic check payment
        'gender': 'Female'                      # Female customer
    }
    
    print("Customer Profile:")
    for key, value in customer_data.items():
        print(f"  {key}: {value}")
    
    # Make prediction
    result = predictor.predict_single_customer(customer_data)
    
    # Display results
    print(f"\n📊 Prediction Results:")
    print(f"  Churn Probability: {result['churn_probability']:.3f} ({result['churn_probability']:.1%})")
    print(f"  Risk Level: {result['risk_level']}")
    print(f"  Prediction: {result['prediction']}")
    
    # Business interpretation
    prob = result['churn_probability']
    if prob > 0.7:
        print(f"\n🚨 HIGH RISK: This customer has a {prob:.1%} chance of churning")
        print("   Recommended actions:")
        print("   • Immediate retention campaign")
        print("   • Offer contract incentives")
        print("   • Personal account manager contact")
    elif prob > 0.4:
        print(f"\n⚠️ MEDIUM RISK: This customer has a {prob:.1%} chance of churning")
        print("   Recommended actions:")
        print("   • Monitor engagement closely") 
        print("   • Offer service upgrades")
        print("   • Send satisfaction survey")
    else:
        print(f"\n✅ LOW RISK: This customer has only a {prob:.1%} chance of churning")
        print("   Recommended actions:")
        print("   • Continue standard engagement")
        print("   • Consider upselling opportunities")
    
    return result

def predict_multiple_customers():
    """Example of batch prediction for multiple customers"""
    
    print("\n🔄 BATCH PREDICTION EXAMPLE") 
    print("=" * 30)
    
    import pandas as pd
    
    predictor = TelcoChurnPredictor(model_path='models/')
    
    # Multiple customers data
    customers_data = pd.DataFrame([
        {
            'tenure': 36, 'MonthlyCharges': 45.00, 'Contract': 'Two year',
            'InternetService': 'DSL', 'PaymentMethod': 'Bank transfer (automatic)',
            'SeniorCitizen': 1, 'Partner': 'Yes', 'gender': 'Male'
        },
        {
            'tenure': 6, 'MonthlyCharges': 75.00, 'Contract': 'Month-to-month', 
            'InternetService': 'Fiber optic', 'PaymentMethod': 'Electronic check',
            'SeniorCitizen': 0, 'Partner': 'No', 'gender': 'Female'
        },
        {
            'tenure': 24, 'MonthlyCharges': 55.00, 'Contract': 'One year',
            'InternetService': 'DSL', 'PaymentMethod': 'Credit card (automatic)',
            'SeniorCitizen': 0, 'Partner': 'Yes', 'gender': 'Male'
        }
    ])
    
    print(f"Predicting churn for {len(customers_data)} customers...")
    
    # Batch prediction
    results = predictor.predict_batch(customers_data)
    
    # Display results
    for i, row in results.iterrows():
        print(f"\n👤 Customer {i+1}:")
        print(f"   Tenure: {row['tenure']} months, Charges: ${row['MonthlyCharges']:.2f}")
        print(f"   Churn Risk: {row['churn_probability']:.3f} ({row['risk_level']})")
    
    return results

if __name__ == "__main__":
    # Single customer prediction
    single_result = predict_customer_churn()
    
    # Batch prediction
    batch_results = predict_multiple_customers()
    
    print("\n" + "=" * 50)
    print("✅ INFERENCE EXAMPLES COMPLETED!")
    print("📋 This demonstrates how to use TelcoChurnPredictor in production")
    print("🎯 Both single and batch predictions are working")
    print("=" * 50)
