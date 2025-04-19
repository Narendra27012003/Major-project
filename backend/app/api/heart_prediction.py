from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.core.config import settings

router = APIRouter(tags=["Heart Disease Prediction"])

security = HTTPBearer()

# Dependency to get current user
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")

# 🚀 Train both Logistic Regression and Random Forest models
def train_models():
    data = pd.read_csv("app/dataset/heart.csv")
    X = data.drop('target', axis=1)
    y = data['target']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    sc = StandardScaler()
    X_train_scaled = sc.fit_transform(X_train)
    X_test_scaled = sc.transform(X_test)

    # Logistic Regression
    logistic_model = LogisticRegression()
    logistic_model.fit(X_train_scaled, y_train)
    logistic_pred = logistic_model.predict(X_test_scaled)
    logistic_acc = accuracy_score(y_test, logistic_pred) * 100

    # Random Forest
    rf_model = RandomForestClassifier()
    rf_model.fit(X_train_scaled, y_train)
    rf_pred = rf_model.predict(X_test_scaled)
    rf_acc = accuracy_score(y_test, rf_pred) * 100

    return logistic_model, rf_model, sc, logistic_acc, rf_acc

log_model, rf_model, scaler, log_acc, rf_acc = train_models()

# Input data format
class HeartDiseaseInput(BaseModel):
    age: int
    gender: int
    cp: int
    trestbps: int
    chol: int
    fbs: int
    restecg: int
    thalach: int
    exang: int
    oldpeak: float
    slope: int
    ca: int
    thal: int

@router.post("/predict", summary="Heart Disease Prediction", description="Predict heart disease risk (authorized users only)")
async def predict(data: HeartDiseaseInput, user: str = Depends(get_current_user)):
    input_features = np.array([
        data.age, data.gender, data.cp, data.trestbps, data.chol,
        data.fbs, data.restecg, data.thalach, data.exang,
        data.oldpeak, data.slope, data.ca, data.thal
    ]).reshape(1, -1)

    input_scaled = scaler.transform(input_features)
    log_pred = log_model.predict(input_scaled)[0]
    rf_pred = rf_model.predict(input_scaled)[0]

    logistic_result = "High Risk of Heart Disease" if log_pred == 1 else "Low Risk of Heart Disease"
    randomforest_result = "High Risk of Heart Disease" if rf_pred == 1 else "Low Risk of Heart Disease"

    return JSONResponse(content={
        "user": user,
        "logistic_result": logistic_result,
        "randomforest_result": randomforest_result,
        "logistic_accuracy": round(log_acc, 2),
        "randomforest_accuracy": round(rf_acc, 2)
    })
