import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import warnings
warnings.filterwarnings('ignore')

print("=== CHURN PREDICTION ML MODEL ===\n")

# Load the master dataset
df = pd.read_csv('../data/master_churn_dataset.csv')
print(f"Dataset loaded: {df.shape}")
print(f"Churn rate: {df['churned'].mean():.2%}")

# Feature selection and preprocessing
print("\n1. FEATURE ENGINEERING AND PREPROCESSING")

# Remove duplicate users (keep first occurrence)
df_unique = df.drop_duplicates(subset=['User Id'], keep='first')
print(f"After removing duplicates: {df_unique.shape}")

# Select relevant features for modeling
features_to_use = [
    'tenure_days', 'Price', 'billing_count', 'avg_billing_amount', 
    'total_billing', 'billing_amount_std', 'failed_payments',
    'days_since_last_billing', 'days_since_last_renewal', 
    'action_count', 'days_since_last_action', 'Grace Time'
]

# Encode categorical features
le = LabelEncoder()
df_unique['subscription_type_encoded'] = le.fit_transform(df_unique['Subscription Type'])
df_unique['auto_renewal_encoded'] = le.fit_transform(df_unique['Auto Renewal Allowed'].astype(str))

features_to_use.extend(['subscription_type_encoded', 'auto_renewal_encoded'])

# Handle missing values
df_model = df_unique[features_to_use + ['churned']].copy()
df_model = df_model.fillna(df_model.median())

print(f"Features used: {len(features_to_use)}")
print("Features:", features_to_use)

# Prepare data for modeling
X = df_model[features_to_use]
y = df_model['churned']

print(f"\nFeature matrix shape: {X.shape}")
print(f"Target distribution: {y.value_counts().to_dict()}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training set: {X_train.shape}")
print(f"Test set: {X_test.shape}")

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("\n2. MODEL TRAINING AND EVALUATION")

# Initialize models
models = {
    'Logistic Regression': LogisticRegression(random_state=42),
    'Random Forest': RandomForestClassifier(random_state=42, n_estimators=100),
    'Gradient Boosting': GradientBoostingClassifier(random_state=42),
    'SVM': SVC(random_state=42, probability=True)
}

# Train and evaluate models
results = {}
best_model = None
best_score = 0

for name, model in models.items():
    print(f"\nTraining {name}...")
    
    # Use scaled data for models that need it
    if name in ['Logistic Regression', 'SVM']:
        X_train_model = X_train_scaled
        X_test_model = X_test_scaled
    else:
        X_train_model = X_train
        X_test_model = X_test
    
    # Train model
    model.fit(X_train_model, y_train)
    
    # Cross-validation
    cv_scores = cross_val_score(model, X_train_model, y_train, cv=5, scoring='roc_auc')
    
    # Test predictions
    y_pred = model.predict(X_test_model)
    y_pred_proba = model.predict_proba(X_test_model)[:, 1]
    
    # Calculate metrics
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    
    results[name] = {
        'model': model,
        'cv_mean': cv_scores.mean(),
        'cv_std': cv_scores.std(),
        'test_roc_auc': roc_auc,
        'predictions': y_pred,
        'probabilities': y_pred_proba
    }
    
    print(f"CV ROC-AUC: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
    print(f"Test ROC-AUC: {roc_auc:.3f}")
    
    if roc_auc > best_score:
        best_score = roc_auc
        best_model = name

print(f"\n3. BEST MODEL: {best_model} (ROC-AUC: {best_score:.3f})")

# Detailed evaluation of best model
print(f"\n=== DETAILED EVALUATION: {best_model} ===")
best_model_obj = results[best_model]['model']
y_pred_best = results[best_model]['predictions']
y_pred_proba_best = results[best_model]['probabilities']

print("\nClassification Report:")
print(classification_report(y_test, y_pred_best))

print("\nConfusion Matrix:")
cm = confusion_matrix(y_test, y_pred_best)
print(cm)

# Feature importance (for tree-based models)
if best_model in ['Random Forest', 'Gradient Boosting']:
    print("\nFeature Importance:")
    feature_importance = pd.DataFrame({
        'feature': features_to_use,
        'importance': best_model_obj.feature_importances_
    }).sort_values('importance', ascending=False)
    print(feature_importance.head(10))
    
    # Plot feature importance
    plt.figure(figsize=(10, 6))
    sns.barplot(data=feature_importance.head(10), x='importance', y='feature')
    plt.title(f'Top 10 Feature Importance - {best_model}')
    plt.tight_layout()
    plt.savefig('../visualizations/feature_importance.png', dpi=300, bbox_inches='tight')
    print("Feature importance plot saved as '../visualizations/feature_importance.png'")

# ROC Curve
plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
for name, result in results.items():
    fpr, tpr, _ = roc_curve(y_test, result['probabilities'])
    plt.plot(fpr, tpr, label=f"{name} (AUC = {result['test_roc_auc']:.3f})")

plt.plot([0, 1], [0, 1], 'k--', label='Random')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curves Comparison')
plt.legend()

# Confusion Matrix Heatmap
plt.subplot(1, 2, 2)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
            xticklabels=['Active', 'Churned'], 
            yticklabels=['Active', 'Churned'])
plt.title(f'Confusion Matrix - {best_model}')
plt.ylabel('Actual')
plt.xlabel('Predicted')

plt.tight_layout()
plt.savefig('../visualizations/model_evaluation.png', dpi=300, bbox_inches='tight')
print("Model evaluation plots saved as '../visualizations/model_evaluation.png'")

# Save the best model and scaler
joblib.dump(best_model_obj, f'../models/best_churn_model_{best_model.lower().replace(" ", "_")}.pkl')
joblib.dump(scaler, '../models/feature_scaler.pkl')
print(f"\nBest model saved as 'best_churn_model_{best_model.lower().replace(' ', '_')}.pkl'")

# Model performance summary
print("\n4. MODEL PERFORMANCE SUMMARY")
performance_df = pd.DataFrame({
    'Model': list(results.keys()),
    'CV_ROC_AUC_Mean': [results[name]['cv_mean'] for name in results.keys()],
    'CV_ROC_AUC_Std': [results[name]['cv_std'] for name in results.keys()],
    'Test_ROC_AUC': [results[name]['test_roc_auc'] for name in results.keys()]
}).sort_values('Test_ROC_AUC', ascending=False)

print(performance_df)
performance_df.to_csv('../data/model_performance_summary.csv', index=False)

print("\n5. CHURN PREDICTION INSIGHTS")
print("Key factors for churn prediction (based on correlations and feature importance):")

if best_model in ['Random Forest', 'Gradient Boosting']:
    top_features = feature_importance.head(5)
    for idx, row in top_features.iterrows():
        print(f"- {row['feature']}: {row['importance']:.3f}")

print(f"\nThe {best_model} model achieved {best_score:.1%} ROC-AUC score on test data.")
print("This model can help identify users at risk of churning for proactive retention efforts.")

# Save feature names for future predictions
feature_names = features_to_use
joblib.dump(feature_names, '../models/feature_names.pkl')
print("\nFeature names saved for future predictions.")