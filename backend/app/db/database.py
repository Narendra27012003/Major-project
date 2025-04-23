from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.db.base_class import Base  # ✅ Correct Base import

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ Import models so that Base.metadata knows about them
from app.db import models

# ✅ Create tables
Base.metadata.create_all(bind=engine)
