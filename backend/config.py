import os
from dotenv import load_dotenv

# Get the absolute directory path for config.py
current_dir = os.path.abspath(os.path.dirname(__file__))

# Construct the path to the .env file
dotenv_path = os.path.join(os.path.abspath(current_dir), '.env')

# Load the .env file
load_dotenv(dotenv_path)


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    DEBUG = os.getenv('FLASK_DEBUG')
    FLASK_ENV = os.getenv('FLASK_ENV')
    FLASK_RUN_PORT = os.getenv('FLASK_RUN_PORT')

    # Dynamically construct the UPLOAD_FOLDER path
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')


