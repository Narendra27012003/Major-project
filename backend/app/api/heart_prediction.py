from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.core.config import settings

router = APIRouter(
    tags=["Heart Disease Prediction"]
)

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

# 🚀 Train model directly from dataset
def train_model():
    data = pd.read_csv("app/dataset/heart.csv")  # Make sure dataset exists at this path
    X = data.drop('target', axis=1)
    y = data['target']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    sc = StandardScaler()
    X_train = sc.fit_transform(X_train)
    model = LogisticRegression()
    model.fit(X_train, y_train)
    
    return model, sc

model, scaler = train_model()

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
        data.age,
        data.gender,
        data.cp,
        data.trestbps,
        data.chol,
        data.fbs,
        data.restecg,
        data.thalach,
        data.exang,
        data.oldpeak,
        data.slope,
        data.ca,
        data.thal
    ]).reshape(1, -1)
    
    input_scaled = scaler.transform(input_features)
    prediction = model.predict(input_scaled)[0]
    
    if prediction == 1:
        result = "High Risk of Heart Disease"
    else:
        result = "Low Risk of Heart Disease"
    
    return JSONResponse(content={"user": user, "result": result})
