from datetime import datetime

from app import db


class Text(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_uid = db.Column(db.String(36), nullable=True)  # Now nullable
    summaries = db.relationship('Summary', backref='text', lazy=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


class Summary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    text_id = db.Column(db.Integer, db.ForeignKey('text.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
