# ✅ models/prediction.py
from fastapi.responses import JSONResponse
import numpy as np
from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

from app.api.heart_prediction import get_current_user

Base = declarative_base()

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user = Column(String, index=True)
    name = Column(String)
    email = Column(String)
    age = Column(Integer)
    gender = Column(Integer)
    cp = Column(Integer)
    trestbps = Column(Integer)
    chol = Column(Integer)
    fbs = Column(Integer)
    restecg = Column(Integer)
    thalach = Column(Integer)
    exang = Column(Integer)
    oldpeak = Column(Float)
    slope = Column(Integer)
    ca = Column(Integer)
    thal = Column(Integer)
    logistic_result = Column(String)
    randomforest_result = Column(String)
    logistic_accuracy = Column(Float)
    randomforest_accuracy = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)


# ✅ database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.schemas.prediction import Base
import os

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)


# ✅ Updated endpoint in predict router
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.schemas.prediction import Prediction
from app.db.database import SessionLocal
# (imports for ML model same as before)

router = APIRouter(tags=["Heart Disease Prediction"])

# Get DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class HeartDiseaseInput(BaseModel):
    name: str
    email: str
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

@router.post("/predict")
async def predict(
    data: HeartDiseaseInput,
    user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    input_features = np.array([
        data.age, data.gender, data.cp, data.trestbps, data.chol,
        data.fbs, data.restecg, data.thalach, data.exang,
        data.oldpeak, data.slope, data.ca, data.thal
    ]).reshape(1, -1)

    input_scaled = Scale.transform(input_features)
    log_pred = log_model.predict(input_scaled)[0]
    rf_pred = rf_model.predict(input_scaled)[0]

    logistic_result = "High Risk of Heart Disease" if log_pred == 1 else "Low Risk of Heart Disease"
    randomforest_result = "High Risk of Heart Disease" if rf_pred == 1 else "Low Risk of Heart Disease"

    # ✅ Store in DB
    prediction = Prediction(
        user=user,
        name=data.name,
        email=data.email,
        age=data.age,
        gender=data.gender,
        cp=data.cp,
        trestbps=data.trestbps,
        chol=data.chol,
        fbs=data.fbs,
        restecg=data.restecg,
        thalach=data.thalach,
        exang=data.exang,
        oldpeak=data.oldpeak,
        slope=data.slope,
        ca=data.ca,
        thal=data.thal,
        logistic_result=logistic_result,
        randomforest_result=randomforest_result,
        logistic_accuracy=round(log_acc, 2),
        randomforest_accuracy=round(rf_acc, 2),
    )
    db.add(prediction)
    db.commit()

    return JSONResponse(content={
        "user": user,
        "logistic_result": logistic_result,
        "randomforest_result": randomforest_result,
        "logistic_accuracy": round(log_acc, 2),
        "randomforest_accuracy": round(rf_acc, 2)
    })
