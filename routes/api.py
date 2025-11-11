from flask import Blueprint, jsonify, request
from models.book import Book
from extensions import db

api_bp = Blueprint('api', __name__)

@api_bp.route('/books', methods=['GET'])
def get_books():
    """API endpoint to get all books"""
    sort = request.args.get('sort', 'rating')

    if sort == 'date':
        books = Book.query.filter(Book.date_completed.isnot(None))\
                         .order_by(Book.date_completed.desc()).all()
    elif sort == 'title':
        books = Book.query.order_by(Book.title).all()
    else:
        books = Book.query.filter(Book.rating.isnot(None))\
                         .order_by(Book.rating.desc(), Book.date_completed.desc()).all()

    return jsonify([book.to_dict() for book in books])

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Flask app is running'})