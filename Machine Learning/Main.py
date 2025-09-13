import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # Import CORS Middleware
from sklearn.metrics.pairwise import cosine_similarity
from pydantic import BaseModel
from typing import Dict, List, Any

# --- 1. SETUP & APP INITIALIZATION ---

app = FastAPI(
    title="Lumen Quest Recommendation API",
    description="API for customer service and plan recommendations.",
    version="1.0.0",
)

# --- ADD CORS MIDDLEWARE ---
# This allows your frontend (running in a browser) to communicate with this backend.
origins = [
    "*",  # In production, you would restrict this to your frontend's domain.
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Use a dictionary to hold our models and data.
state = {"df_processed": None, "df_original": None, "similarity_df": None}

# --- 2. DATA LOADING & MODEL COMPUTATION (ON STARTUP) ---


@app.on_event("startup")
def load_data_and_model():
    """
    This function runs once when the API server starts.
    It loads the datasets and pre-computes the similarity matrix.
    """
    print("Server is starting up...")
    try:
        # Load datasets
        state["df_processed"] = pd.read_csv("data/DATA[T].csv")
        state["df_original"] = pd.read_csv("data/DATA.csv")

        # Compute Similarity Matrix
        X_features = state["df_processed"].drop("Churn", axis=1)
        similarity_matrix = cosine_similarity(X_features)

        state["similarity_df"] = pd.DataFrame(
            similarity_matrix,
            index=state["df_original"]["customerID"],
            columns=state["df_original"]["customerID"],
        )
        print("Data loaded and similarity matrix computed successfully.")
    except FileNotFoundError:
        print("ERROR: Could not find data files in the 'data/' directory.")
        state["similarity_df"] = None


# --- 3. PYDANTIC MODELS (FOR API RESPONSE STRUCTURE) ---


class ServiceRecommendation(BaseModel):
    service_name: str
    recommendation_score: int
    message: str


class PlanRecommendation(BaseModel):
    customer_id: str
    assigned_plan: str
    recommendation_count: int
    reason: str


# --- 4. RECOMMENDATION LOGIC (ADAPTED FROM NOTEBOOK) ---


def get_service_recommendations(
    customer_id: str, num_recommendations: int = 3
) -> Dict[str, int]:
    """
    Generates service recommendations for a given customer based on finding similar users.
    """
    similar_customers = (
        state["similarity_df"][customer_id].sort_values(ascending=False).iloc[1:11]
    )
    similar_customer_services = state["df_original"][
        state["df_original"]["customerID"].isin(similar_customers.index)
    ]
    target_customer_services = state["df_original"][
        state["df_original"]["customerID"] == customer_id
    ]

    recommendations = {}
    service_columns = [
        "PhoneService",
        "OnlineSecurity",
        "OnlineBackup",
        "DeviceProtection",
        "TechSupport",
        "StreamingTV",
        "StreamingMovies",
    ]

    for service in service_columns:
        if target_customer_services[service].iloc[0] == "No":
            recommendation_score = (
                similar_customer_services[service].value_counts().get("Yes", 0)
            )
            if recommendation_score > 0:
                recommendations[service] = recommendation_score

    sorted_recommendations = sorted(
        recommendations.items(), key=lambda x: x[1], reverse=True
    )
    return dict(sorted_recommendations[:num_recommendations])


def assign_and_recommend_plan(customer_id: str) -> dict:
    """
    Finds potential service recommendations and uses the count to assign a plan tier.
    """
    service_recs = get_service_recommendations(
        customer_id, num_recommendations=10
    )  # Get all possible recommendations
    recommendation_count = len(service_recs)

    assigned_plan = ""
    if recommendation_count <= 1:
        assigned_plan = "Ultra"
        reason = f"You are a power user with high engagement (only {recommendation_count} upsell opportunities found)."
    elif recommendation_count >= 4:
        assigned_plan = "Basic"
        reason = f"You have a foundational set of services with lots of potential for new features ({recommendation_count} upsell opportunities found)."
    else:
        assigned_plan = "Plus"
        reason = f"You have a solid set of services with some room to grow ({recommendation_count} upsell opportunities found)."

    return {
        "customer_id": customer_id,
        "assigned_plan": assigned_plan,
        "recommendation_count": recommendation_count,
        "reason": reason,
    }


# --- 5. API ENDPOINTS ---


@app.get(
    "/recommend/services/{customer_id}", response_model=List[ServiceRecommendation]
)
def recommend_services(customer_id: str):
    """
    Provides a list of tailored service recommendations for a given customer ID.
    """
    if (
        state["similarity_df"] is None
        or customer_id not in state["similarity_df"].index
    ):
        raise HTTPException(
            status_code=404, detail="Customer ID not found or data not loaded."
        )

    recommended_services = get_service_recommendations(customer_id)

    if not recommended_services:
        return []

    response = []
    for service, score in recommended_services.items():
        response.append(
            ServiceRecommendation(
                service_name=service,
                recommendation_score=score,
                message=f"Recommend '{service}' (Subscribed to by {score} out of 10 similar customers)",
            )
        )
    return response


@app.get("/recommend/plan/{customer_id}", response_model=PlanRecommendation)
def recommend_plan(customer_id: str):
    """
    Analyzes a customer's services and assigns them a logical plan tier (Basic, Plus, or Ultra).
    """
    if (
        state["similarity_df"] is None
        or customer_id not in state["similarity_df"].index
    ):
        raise HTTPException(
            status_code=404, detail="Customer ID not found or data not loaded."
        )

    plan_details = assign_and_recommend_plan(customer_id)
    return PlanRecommendation(**plan_details)
