from datetime import datetime
from extensions import db

class Book(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(200), nullable=False)
    rating = db.Column(db.Integer)
    cover_image = db.Column(db.String(500))
    date_completed = db.Column(db.Date)
    currently_reading = db.Column(db.Boolean, default=False)
    genre = db.Column(db.String(100))
    topic = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Book {self.title} by {self.author}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'rating': self.rating,
            'cover_image': self.cover_image,
            'date_completed': self.date_completed.isoformat() if self.date_completed else None,
            'currently_reading': self.currently_reading,
            'genre': self.genre,
            'topic': self.topic,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }