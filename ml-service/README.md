# 🎯 Customer Churn Prediction ML Project

A comprehensive machine learning project that predicts customer churn for telecom companies using the Telco Customer Churn dataset. The project includes end-to-end ML pipeline implemented in Jupyter notebooks from data exploration to production-ready prediction interface.

## 🚀 Quick Start

```bash
# Install dependencies
pip install pandas numpy scikit-learn matplotlib seaborn joblib jupyter

# Start Jupyter Notebook
jupyter notebook

# Run the notebooks in order:
# 1. notebooks/01_data_exploration.ipynb
# 2. notebooks/02_feature_engineering.ipynb  
# 3. notebooks/03_exploratory_data_analysis.ipynb
# 4. notebooks/04_machine_learning_models.ipynb
# 5. notebooks/05_prediction_interface.ipynb
```

## 📊 Project Overview

This Machine learning feature develops a machine learning model to predict customer churn using the industry-standard Telco Customer Churn dataset. The model identifies customers at risk of churning, enabling proactive retention strategies and business insights.

### Key Features
- 🔍 **Comprehensive EDA** with multi-source data analysis
- 🛠 **Feature Engineering** with 14 predictive features
- 🤖 **ML Model Comparison** (Logistic Regression, Random Forest, Gradient Boosting, SVM)
- 📈 **User Engagement Analysis** with risk segmentation
- 🎯 **Production-Ready Interface** for real-time predictions
- 📊 **Business Insights** and retention recommendations

## 📁 Dataset

The project uses the **Telco Customer Churn Dataset** from Kaggle:
- **Source**: https://www.kaggle.com/datasets/blastchar/telco-customer-churn
- **Description**: Comprehensive telecom customer data with churn labels

**Dataset Features:**
- **Customer Demographics**: Gender, age, senior citizen status, partner, dependents
- **Account Information**: Tenure, contract type, payment method, billing preferences
- **Services**: Phone service, internet service, online security, tech support, etc.
- **Billing**: Monthly charges, total charges, paperless billing
- **Target**: Churn (Yes/No)

**Key Statistics:**
- 📊 Total Customers: 7,043
- 📉 Churn Rate: ~27%
- 🏢 Industry: Telecommunications
- 📊 Features: 20 predictive features

## 🛠 Technical Architecture

### Machine Learning Pipeline
```
Raw Data → EDA → Feature Engineering → Model Training → Evaluation → Deployment
```

### Models Tested
| Model | Performance | Use Case |
|-------|-------------|----------|
| **Random Forest** | **🏆 Best Overall** | **Primary Model** |
| Gradient Boosting | High Accuracy | Feature Importance |
| SVM | Good Generalization | Risk Classification |
| Logistic Regression | Interpretable | Baseline Model |

### Key Features Used
1. **Demographics**: `SeniorCitizen`, `Partner`, `Dependents`
2. **Account**: `tenure`, `Contract`, `PaymentMethod`, `PaperlessBilling`
3. **Services**: `PhoneService`, `InternetService`, `OnlineSecurity`, `TechSupport`
4. **Financial**: `MonthlyCharges`, `TotalCharges`
5. **Engineered**: `CLV_estimate`, `services_count`, `avg_monthly_charges`

## 📈 Results & Impact

### Model Performance
- **Best Model**: Random Forest with hyperparameter tuning
- **Cross-Validation**: Robust 5-fold validation
- **Risk Classification**: HIGH (>0.7), MEDIUM (0.4-0.7), LOW (<0.4)
- **Feature Importance**: Contract type, tenure, and monthly charges are top predictors

### Business Insights
- 🚨 **27% churn rate** in telecom industry
- 📅 **Month-to-month contracts** have highest churn risk
- 💰 **Higher monthly charges** correlate with increased churn
- 🎯 **New customers** (low tenure) are most at risk
- 📱 **Fiber optic** customers show higher churn tendency
- 👥 **Senior citizens** have different churn patterns

### Expected Business Impact
- 📈 **15-25% reduction** in churn through targeted interventions
- 💰 **Revenue protection** for high-value customers
- ⚡ **Automated risk scoring** reduces manual analysis
- 🎯 **Data-driven insights** for retention strategies

## 🔧 Usage

### Single Customer Prediction
```python
from src.telco_churn_predictor import TelcoChurnPredictor

predictor = TelcoChurnPredictor()
customer_data = {
    'tenure': 12,
    'MonthlyCharges': 75.50,
    'TotalCharges': 906.00,
    'Contract': 'Month-to-month',
    'PaymentMethod': 'Electronic check',
    'InternetService': 'Fiber optic',
    # ... other features
}

result = predictor.predict_single_customer(customer_data)
print(f"Churn Probability: {result['churn_probability']:.1%}")
print(f"Risk Level: {result['risk_level']}")
print(f"Recommendations: {result['recommendations']}")
```

### Batch Processing
```python
# Load your customer dataset
df = pd.read_csv('your_customer_data.csv')
results = predictor.predict_batch(df)

# Get high-risk customers for targeted campaigns
high_risk = results[results['risk_level'] == 'HIGH']
```

## 📊 Visualizations

The project generates comprehensive visualizations:

- 📈 **EDA Plots**: Distribution analysis and correlations
- 🎯 **Model Evaluation**: ROC curves and confusion matrices
- 👥 **User Engagement Dashboard**: Behavior analysis
- 📊 **Feature Importance**: Key predictive factors

## 📋 File Structure

```
notebooks/
├── 📓 Jupyter Notebooks
│   ├── 01_data_exploration.ipynb           # Initial data exploration
│   ├── 02_feature_engineering.ipynb        # Data preprocessing & feature engineering
│   ├── 03_exploratory_data_analysis.ipynb  # Comprehensive EDA
│   ├── 04_machine_learning_models.ipynb    # Model training & evaluation
│   └── 05_prediction_interface.ipynb       # Production interface
├── 📊 data
├── 🤖 models (Logistic Regression Pickle file and model meta data)
├── 🔍 Source Code
│   └── src/telco_churn_predictor.py        # Production prediction class
├── 📊 Visualizations
│   └── visualizations/                     # All plots and charts
├── 📖 Documentation
│   ├── README.md                           # This file
└── ⚙️ Configuration
    └── .gitignore                          # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- pandas, numpy, scikit-learn, matplotlib, seaborn, joblib, openpyxl

### Installation

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the pipeline**
   ```bash
   # Option 1: Run all scripts sequentially
   bash run_pipeline.sh
   
   # Option 2: Run individual scripts
   python churn_ml_model.py
   python churn_prediction_interface.py
   ```
