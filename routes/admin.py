from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash
from sqlalchemy import desc
from models.book import Book
from models.user import User
from extensions import db
from datetime import datetime
import os

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    """Admin login page"""
    if current_user.is_authenticated:
        return redirect(url_for('admin.books_dashboard'))

    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # For initial setup, use environment variables
        # In production, you'd check against the database
        if username == os.environ.get('ADMIN_USERNAME', 'admin') and \
           password == os.environ.get('ADMIN_PASSWORD', 'changeme'):
            # Create or get admin user
            user = User.query.filter_by(username=username).first()
            if not user:
                user = User(username=username)
                user.set_password(password)
                db.session.add(user)
                db.session.commit()

            login_user(user, remember=True)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('admin.books_dashboard'))
        else:
            flash('Invalid username or password', 'error')

    return render_template('admin/login.html')

@admin_bp.route('/logout')
@login_required
def logout():
    """Logout current user"""
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('main.index'))

@admin_bp.route('/books')
@login_required
def books_dashboard():
    """Admin dashboard for managing books"""
    books = Book.query.order_by(desc(Book.created_at)).all()
    return render_template('admin/books.html', books=books)

@admin_bp.route('/books/add', methods=['POST'])
@login_required
def add_book():
    """Add a new book"""
    title = request.form.get('title')
    author = request.form.get('author')
    rating = request.form.get('rating')
    date_completed = request.form.get('date_completed')
    cover_image = request.form.get('cover_image')

    if not title or not author:
        flash('Title and author are required', 'error')
        return redirect(url_for('admin.books_dashboard'))

    book = Book(
        title=title,
        author=author,
        rating=int(rating) if rating else None,
        cover_image=cover_image if cover_image else None,
        date_completed=datetime.strptime(date_completed, '%Y-%m-%d').date() if date_completed else None
    )

    db.session.add(book)
    db.session.commit()
    flash(f'Book "{title}" has been added!', 'success')

    return redirect(url_for('admin.books_dashboard'))

@admin_bp.route('/books/<int:book_id>/update', methods=['POST'])
@login_required
def update_book(book_id):
    """Update a book's rating"""
    book = Book.query.get_or_404(book_id)
    new_rating = request.form.get('rating')

    if new_rating:
        book.rating = int(new_rating)
        db.session.commit()
        flash(f'Book "{book.title}" has been updated!', 'success')

    return redirect(url_for('admin.books_dashboard'))

@admin_bp.route('/books/<int:book_id>/delete', methods=['POST'])
@login_required
def delete_book(book_id):
    """Delete a book"""
    book = Book.query.get_or_404(book_id)
    title = book.title

    db.session.delete(book)
    db.session.commit()
    flash(f'Book "{title}" has been deleted!', 'info')

    return redirect(url_for('admin.books_dashboard'))