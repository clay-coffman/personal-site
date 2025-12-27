from flask import Blueprint, render_template, request, send_file, abort
from data.profile import profile_data
from calibre import get_favorite_books, get_cover_path

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Homepage with profile information"""
    return render_template('index.html', profile=profile_data)

@main_bp.route('/books')
def books():
    """Public bookshelf - 5-star books from Calibre library"""
    books = get_favorite_books()
    return render_template('books.html', books=books)


@main_bp.route('/covers/<int:book_id>')
def cover(book_id):
    """Serve cover image from Calibre library"""
    cover_path = get_cover_path(book_id)
    if not cover_path:
        abort(404)
    return send_file(cover_path, mimetype='image/jpeg', max_age=86400)


@main_bp.route('/blog')
def blog():
    """Blog page"""
    return render_template('blog.html')


@main_bp.route('/projects')
def projects():
    """Projects page"""
    return render_template('projects.html')