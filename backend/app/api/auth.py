from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from app.db.database import SessionLocal
from app.db.models import User
from app.schemas.user import UserCreate, UserLogin, Token
from app.core.security import hash_password, verify_password
from app.core.token import create_access_token

router = APIRouter(
    tags=["Authentication"]
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===========================
# Register (Signup) API
# ===========================
@router.post(
    "/signup",
    summary="Register User",
    description="Register a new user and confirm registration."
)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_pwd = hash_password(user.password)
    new_user = User(username=user.username, email=user.email, password=hashed_pwd)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return JSONResponse(
        status_code=200,
        content={"message": "User registered successfully"}
    )

# ===========================
# Login (Signin) API
# ===========================
@router.post(
    "/signin",
    response_model=Token,
    summary="Login User",
    description="Authenticate user and return JWT token."
)
def signin(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    access_token = create_access_token(data={"sub": db_user.username})
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
