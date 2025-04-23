from datetime import datetime
from sqlalchemy import Column, DateTime, Float, Integer, String
from app.db.base_class import Base  # ✅ Import Base from the shared base file

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

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
