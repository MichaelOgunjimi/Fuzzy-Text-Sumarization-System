from flask import Flask
# from config.config import Config  # Assuming you have a config.py in the config directory
# from app.models import models  # Import models to ensure they are recognized by an ORM like SQLAlchemy
# from app.routes import configure_routes  # Assuming you define a function to setup your routes
# from app.utils.helpers import some_utility_function  # Example utility function import

app = Flask(__name__)


@app.route('/api/v1/summarize', methods=['POST', 'GET'])
def hello_world():  # put application's code here
    return 'Hello World!'


if __name__ == '__main__':
    app.run()
