# Migration Plan: Next.js to Python Flask + Bootstrap

## Executive Summary

This document outlines the migration plan for rebuilding your personal website from Next.js/React to Python/Flask/Bootstrap. The new architecture prioritizes simplicity, maintainability, and Python-first development while preserving all existing functionality.

## Target Architecture

### Tech Stack
- **Backend**: Python 3.11+ with Flask 3.x
- **Database**: SQLite (lightweight, file-based, perfect for small sites)
- **Frontend**: Bootstrap 5.3 + Vanilla JavaScript
- **Templating**: Jinja2 (Flask's default)
- **Static Assets**: Flask static file serving + CDN for libraries
- **Authentication**: Flask-Login with werkzeug password hashing
- **Deployment**: Gunicorn + Nginx on Hetzner VPS

### Why This Stack?
- **SQLite**: No external dependencies, easy backup (just copy the .db file), perfect for <1000 books
- **Bootstrap 5**: Modern, responsive, no build process needed
- **Flask**: Lightweight, perfect for small sites, excellent for static generation
- **Jinja2**: Server-side rendering, SEO-friendly, fast page loads

## Project Structure

```
personal-site-flask/
├── app.py                    # Main Flask application
├── config.py                 # Configuration settings
├── requirements.txt          # Python dependencies
├── .env                     # Environment variables
├── .env.example             # Example environment file
├── database.db              # SQLite database (gitignored)
├── migrations/              # Database migration scripts
│   └── init_db.py          # Initial database setup
├── static/                  # Static assets
│   ├── css/
│   │   └── custom.css      # Custom styles on top of Bootstrap
│   ├── js/
│   │   └── app.js          # Minimal JavaScript for interactivity
│   ├── img/
│   │   ├── profile/        # Profile and portfolio images
│   │   └── books/          # Local book cover cache
│   └── assets/             # PDFs, resume, etc.
├── templates/              # Jinja2 HTML templates
│   ├── base.html          # Base layout template
│   ├── index.html         # Homepage/profile
│   ├── books.html         # Public bookshelf
│   ├── admin/
│   │   ├── login.html     # Admin login
│   │   └── books.html     # Book management
│   └── components/        # Reusable template partials
│       ├── book_card.html
│       └── nav.html
├── models/                # Database models
│   ├── __init__.py
│   └── book.py           # Book model
├── routes/               # Flask blueprints
│   ├── __init__.py
│   ├── main.py          # Public routes
│   ├── admin.py         # Admin routes
│   └── api.py           # API endpoints (if needed)
├── utils/               # Utility functions
│   ├── __init__.py
│   ├── auth.py         # Authentication helpers
│   └── db.py           # Database helpers
└── data/               # Static data
    └── profile.json    # Profile/resume data
```

## Migration Phases

### Phase 1: Core Infrastructure (Week 1)
**Goal**: Set up Flask app with basic structure and database

1. **Initialize Flask Project**
   - Create project structure
   - Set up Flask app with blueprints
   - Configure environment variables
   - Set up logging

2. **Database Setup**
   - Create SQLite database schema
   - Define Book model with SQLAlchemy
   - Migrate existing Supabase data to SQLite
   - Create migration scripts

3. **Template System**
   - Set up base Jinja2 template with Bootstrap 5
   - Create responsive navigation
   - Implement footer component

**Deliverables**:
- Basic Flask app running
- SQLite database with books table
- Base template with Bootstrap

### Phase 2: Public Pages (Week 1-2)
**Goal**: Implement all public-facing pages

1. **Homepage/Profile**
   - Port profile data to JSON/Python dict
   - Create responsive layout with Bootstrap grid
   - Implement experience timeline
   - Add education and projects sections
   - Social links with Font Awesome icons

2. **Bookshelf Page**
   - Query books from SQLite
   - Implement sorting (rating, date, title)
   - Create book card component
   - Responsive grid layout
   - Client-side sorting with vanilla JS

3. **Static Assets**
   - Migrate images to static folder
   - Set up proper image serving
   - Configure caching headers

**Deliverables**:
- Fully functional homepage
- Interactive bookshelf with sorting
- All static assets properly served

### Phase 3: Authentication & Admin (Week 2)
**Goal**: Implement admin functionality

1. **Authentication System**
   - Implement Flask-Login
   - Create login page with Bootstrap forms
   - Session management
   - Password hashing with werkzeug
   - Protected route decorator

2. **Admin Dashboard**
   - Book management interface
   - Add new book form
   - Edit book ratings
   - Delete functionality
   - Batch update operations

3. **CRUD Operations**
   - Create book endpoint
   - Update book endpoint
   - Delete book endpoint
   - Validation and error handling

**Deliverables**:
- Secure admin authentication
- Full CRUD functionality for books
- Protected admin routes

### Phase 4: Optimization & Deployment (Week 3)
**Goal**: Deploy to Hetzner VPS

1. **Performance Optimization**
   - Implement caching for static pages
   - Optimize database queries
   - Minify CSS/JS
   - Configure gzip compression

2. **Deployment Setup**
   - Configure Gunicorn
   - Set up Nginx reverse proxy
   - SSL certificate with Let's Encrypt
   - Systemd service configuration
   - Database backup strategy

3. **Testing & Migration**
   - Test all functionality
   - Migrate production data
   - DNS switchover
   - Monitor for issues

**Deliverables**:
- Production-ready application
- Deployed on Hetzner
- SSL configured
- Automated backups

## Database Migration Strategy

### SQLite Schema

```sql
CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    cover_image TEXT,
    date_completed DATE,
    currently_reading BOOLEAN DEFAULT 0,
    genre TEXT,
    topic TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Migration Process
1. Export data from Supabase to JSON
2. Create SQLite database with schema
3. Import data using Python script
4. Verify data integrity
5. Test all queries

## Key Implementation Details

### 1. Flask Application Structure

```python
# app.py
from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('config.Config')

db = SQLAlchemy(app)
login_manager = LoginManager(app)

# Register blueprints
from routes.main import main_bp
from routes.admin import admin_bp
app.register_blueprint(main_bp)
app.register_blueprint(admin_bp, url_prefix='/admin')
```

### 2. Bootstrap Layout

```html
<!-- templates/base.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{% block title %}Clay Coffman{% endblock %}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ url_for('static', filename='css/custom.css') }}">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <!-- Navigation -->
    </nav>
    <main class="container py-4">
        {% block content %}{% endblock %}
    </main>
    <footer class="bg-light py-3 mt-5">
        <!-- Footer -->
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

### 3. Book Model

```python
# models/book.py
from datetime import datetime
from app import db

class Book(db.Model):
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

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'rating': self.rating,
            'cover_image': self.cover_image,
            'date_completed': self.date_completed.isoformat() if self.date_completed else None
        }
```

### 4. Static Site Generation Option

For ultimate performance, implement a static site generator:

```python
# generate_static.py
import os
from flask_frozen import Freezer
from app import app

freezer = Freezer(app)

@freezer.register_generator
def books():
    yield {'sort': 'rating'}
    yield {'sort': 'date'}
    yield {'sort': 'title'}

if __name__ == '__main__':
    freezer.freeze()
```

## Deployment Configuration

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name claycoffman.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static {
        alias /var/www/personal-site/static;
        expires 30d;
    }
}
```

### Gunicorn Service

```ini
[Unit]
Description=Clay's Personal Site
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/personal-site
Environment="PATH=/var/www/personal-site/venv/bin"
ExecStart=/var/www/personal-site/venv/bin/gunicorn --workers 2 --bind 127.0.0.1:8000 app:app

[Install]
WantedBy=multi-user.target
```

## Environment Variables

```bash
# .env
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=<generate-secure-key>
DATABASE_URL=sqlite:///database.db
ADMIN_USERNAME=<your-username>
ADMIN_PASSWORD_HASH=<hashed-password>
```

## Data Migration Script

```python
# migrations/import_books.py
import json
from datetime import datetime
from app import app, db
from models.book import Book

def import_books_from_json(json_file):
    with app.app_context():
        with open(json_file, 'r') as f:
            books_data = json.load(f)

        for book_data in books_data:
            book = Book(
                title=book_data['title'],
                author=book_data['author'],
                rating=book_data.get('rating'),
                cover_image=book_data.get('cover_image'),
                date_completed=datetime.fromisoformat(book_data['date_completed'])
                    if book_data.get('date_completed') else None
            )
            db.session.add(book)

        db.session.commit()
        print(f"Imported {len(books_data)} books")
```

## Benefits of This Architecture

1. **Simplicity**: No build process, minimal JavaScript, straightforward deployment
2. **Performance**: Server-side rendering, SQLite is blazing fast for small datasets
3. **Maintainability**: Python-only backend, clear separation of concerns
4. **Cost**: Minimal server resources needed, no external database costs
5. **Backup**: Simple file-based backup (SQLite database + static files)
6. **SEO**: Server-side rendering ensures search engine compatibility
7. **Security**: No exposed API keys, simple session-based auth
8. **Flexibility**: Easy to add features, integrate with other Python libraries

## Future Enhancements

Once the migration is complete, consider:

1. **Ghost CMS Integration** (as you mentioned)
   - Mount Ghost at `/blog` subdomain
   - Share authentication between Flask and Ghost
   - Unified theme/styling

2. **Static Generation**
   - Use Flask-Frozen for complete static site
   - Deploy to CDN for ultimate performance
   - Regenerate on content changes

3. **Progressive Enhancement**
   - Add HTMX for dynamic updates without full page loads
   - Implement Alpine.js for lightweight interactivity
   - Service worker for offline support

4. **Content Management**
   - Admin interface for editing profile data
   - Image upload functionality
   - Markdown support for content

## Timeline

- **Week 1**: Core infrastructure + Public pages
- **Week 2**: Authentication + Admin functionality
- **Week 3**: Optimization + Deployment
- **Total**: 3 weeks for complete migration

## Risk Mitigation

1. **Data Loss**: Export all Supabase data before starting
2. **Downtime**: Deploy to staging URL first, test thoroughly
3. **Feature Parity**: Create checklist of all current features
4. **SEO Impact**: Maintain URL structure, implement redirects
5. **Performance**: Benchmark before and after migration

## Success Criteria

- [ ] All existing pages functioning
- [ ] Book database fully migrated
- [ ] Admin functionality working
- [ ] Mobile responsive design
- [ ] Page load time < 2 seconds
- [ ] Successful deployment to Hetzner
- [ ] SSL certificate configured
- [ ] Automated backup system

## Conclusion

This migration plan provides a clear path from Next.js to Flask while maintaining all functionality and improving maintainability. The Python-first approach with SQLite and Bootstrap creates a lightweight, fast, and easily maintainable personal website that can be extended with blogging capabilities in the future.