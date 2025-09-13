
import pandas as pd
import numpy as np
import joblib
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class TelcoChurnPredictor:
    """
    Production-ready churn prediction interface for Telco customers.
    
    This class provides methods for:
    - Single customer churn prediction
    - Batch prediction for multiple customers
    - Risk level classification
    - Business recommendations
    """
    
    def __init__(self, model_path=None, model=None, feature_names=None, scaler=None):
        """
        Initialize the predictor with trained model and components.
        
        Parameters:
        - model_path: Path to directory containing model files
        - model: Trained machine learning model (if loading directly)
        - feature_names: List of feature names expected by the model
        - scaler: Feature scaler (if model requires scaling)
        """
        if model_path:
            self._load_from_path(model_path)
        else:
            self.model = model
            self.feature_names = feature_names
            self.scaler = scaler
        
        print(f"🤖 TelcoChurnPredictor initialized")
        print(f"   Model: {type(self.model).__name__}")
        print(f"   Features: {len(self.feature_names)}")
        print(f"   Scaling: {'Yes' if self.scaler is not None else 'No'}")
    
    def _load_from_path(self, model_path):
        """Load model components from file path."""
        import glob
        import os
        
        # Find model file
        model_files = glob.glob(os.path.join(model_path, 'best_churn_model_*.pkl'))
        if not model_files:
            raise FileNotFoundError(f"No model file found in {model_path}")
        
        self.model = joblib.load(model_files[0])
        self.feature_names = joblib.load(os.path.join(model_path, 'feature_names.pkl'))
        
        # Load scaler if exists
        scaler_path = os.path.join(model_path, 'feature_scaler.pkl')
        if os.path.exists(scaler_path):
            self.scaler = joblib.load(scaler_path)
        else:
            self.scaler = None
    
    def predict_single_customer(self, customer_data):
        """Predict churn probability for a single customer."""
        try:
            # Convert to DataFrame if needed
            if isinstance(customer_data, dict):
                df = pd.DataFrame([customer_data])
            elif isinstance(customer_data, pd.Series):
                df = pd.DataFrame([customer_data])
            else:
                df = customer_data
            
            # Ensure all required features are present
            for feature in self.feature_names:
                if feature not in df.columns:
                    df[feature] = 0
            
            # Select and order features
            X = df[self.feature_names]
            
            # Apply scaling if needed
            if self.scaler is not None:
                X_final = self.scaler.transform(X)
            else:
                X_final = X
            
            # Make prediction
            churn_probability = self.model.predict_proba(X_final)[0, 1]
            prediction = self.model.predict(X_final)[0]
            
            return {
                'churn_probability': round(churn_probability, 4),
                'prediction': 'Will Churn' if prediction == 1 else 'Will Stay',
                'risk_level': self._get_risk_level(churn_probability),
                'confidence': self._get_confidence_level(churn_probability),
                'recommendations': self._get_recommendations(churn_probability, customer_data)
            }
            
        except Exception as e:
            return {'error': f"Prediction failed: {str(e)}"}
    
    def predict_batch(self, customers_data):
        """Predict churn for multiple customers."""
        try:
            df = customers_data.copy()
            
            # Ensure all required features are present
            for feature in self.feature_names:
                if feature not in df.columns:
                    df[feature] = 0
            
            # Select and order features
            X = df[self.feature_names]
            
            # Apply scaling if needed
            if self.scaler is not None:
                X_final = self.scaler.transform(X)
            else:
                X_final = X
            
            # Make predictions
            probabilities = self.model.predict_proba(X_final)[:, 1]
            predictions = self.model.predict(X_final)
            
            # Add results to dataframe
            df['churn_probability'] = probabilities
            df['churn_prediction'] = ['Will Churn' if p == 1 else 'Will Stay' for p in predictions]
            df['risk_level'] = [self._get_risk_level(p) for p in probabilities]
            df['confidence'] = [self._get_confidence_level(p) for p in probabilities]
            
            return df
            
        except Exception as e:
            print(f"Batch prediction failed: {str(e)}")
            return None
    
    def _get_risk_level(self, probability):
        """Classify risk level based on churn probability."""
        if probability >= 0.7:
            return "HIGH"
        elif probability >= 0.4:
            return "MEDIUM"
        else:
            return "LOW"
    
    def _get_confidence_level(self, probability):
        """Determine prediction confidence."""
        distance_from_uncertain = abs(probability - 0.5)
        
        if distance_from_uncertain >= 0.4:
            return "Very High"
        elif distance_from_uncertain >= 0.3:
            return "High"
        elif distance_from_uncertain >= 0.2:
            return "Medium"
        else:
            return "Low"
    
    def _get_recommendations(self, probability, customer_data):
        """Generate business recommendations based on prediction."""
        recommendations = []
        
        if probability >= 0.7:
            recommendations.extend([
                "🚨 URGENT: Immediate retention intervention required",
                "📞 Schedule personal call with retention specialist",
                "💰 Consider special discount or incentive offer"
            ])
        elif probability >= 0.4:
            recommendations.extend([
                "⚠️ MODERATE RISK: Proactive engagement recommended",
                "📧 Send targeted retention email campaign",
                "🎯 Offer service upgrade or additional features"
            ])
        else:
            recommendations.extend([
                "✅ LOW RISK: Continue standard engagement",
                "📈 Focus on upselling opportunities",
                "🎁 Consider loyalty rewards program"
            ])
        
        return recommendations

# Example usage
if __name__ == "__main__":
    # Initialize predictor
    predictor = TelcoChurnPredictor(model_path="../models/")
    
    # Example prediction
    customer = {
        'tenure': 12,
        'MonthlyCharges': 70.0,
        'Contract_Month-to-month': 1
    }
    
    result = predictor.predict_single_customer(customer)
    print(f"Churn Probability: {result['churn_probability']:.1%}")
    print(f"Risk Level: {result['risk_level']}")
