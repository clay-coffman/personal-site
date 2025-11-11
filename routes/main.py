from flask import Blueprint, render_template, request
from models.book import Book
from data.profile import profile_data
from sqlalchemy import desc

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Homepage with profile information"""
    return render_template('index.html', profile=profile_data)

@main_bp.route('/books')
def books():
    """Public bookshelf page"""
    sort = request.args.get('sort', 'rating')

    # Query books based on sort parameter
    if sort == 'date':
        books = Book.query.filter(Book.date_completed.isnot(None))\
                         .order_by(desc(Book.date_completed)).all()
    elif sort == 'title':
        books = Book.query.order_by(Book.title).all()
    else:  # Default to rating
        books = Book.query.filter(Book.rating.isnot(None))\
                         .order_by(desc(Book.rating), desc(Book.date_completed)).all()

    return render_template('books.html', books=books, current_sort=sort)