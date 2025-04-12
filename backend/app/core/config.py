from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os 
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


load_dotenv()

class Settings(BaseSettings):
    # Team member's settings
    DATABASE_URL: str 
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"

    # Our existing settings
    GEMINI_API_KEY: str = os.getenv('GEMINI_API_KEY')
    CHROME_PATH: str = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    BROWSER_WIDTH: int = 1280
    BROWSER_HEIGHT: int = 1100
    NETWORK_IDLE_TIMEOUT: float = 3.0

    class Config:
        env_file = ".env"

settings = Settings()