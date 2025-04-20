import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    BASE_MAPS_URL = os.getenv("BASE_MAPS_URL")
    BASE_MAIL_ADDRESS = os.getenv("BASE_MAIL_ADDRESS")
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = int(os.getenv("MAIL_PORT"))
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS") == 'True'
    MAIL_USE_SSL = os.getenv("MAIL_USE_SSL") == 'True'
