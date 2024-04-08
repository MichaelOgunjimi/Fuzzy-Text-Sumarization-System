from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from config import Config

db = SQLAlchemy()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app)

    db.init_app(app)

    from app.routes.routes import (bp as routes_bp)
    app.register_blueprint(routes_bp)

    @app.shell_context_processor
    def make_shell_context():
        from app.models.models import Text, Summary
        return {'db': db, 'Text': Text, 'Summary': Summary}

    return app
