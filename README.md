# Clay Coffman Personal Site

A lightweight, fast personal portfolio and bookshelf website built with Flask, Bootstrap, and SQLite.

## 🚀 Quick Start

### 1. Install UV (Fast Python Package Manager)

```bash
# Install uv if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.cargo/env
```

### 2. Install Dependencies

```bash
# Install all dependencies from pyproject.toml
uv sync
```

### 3. Configure Environment

```bash
# Copy environment template and edit with your values
cp .env.example .env
nano .env
```

### 4. Initialize Database

```bash
# Import sample books
uv run python migrations/import_books.py --sample
```

### 5. Run the Application

```bash
uv run python app.py
```

Visit http://localhost:5001

## 📁 Project Structure

```
personal-site/
├── app.py              # Main Flask application
├── config.py           # Configuration settings
├── extensions.py       # Flask extensions (db, login_manager)
├── pyproject.toml      # Python dependencies
├── models/             # Database models
│   ├── book.py         # Book model
│   └── user.py         # User model
├── routes/             # Flask blueprints
│   ├── main.py         # Public routes
│   ├── admin.py        # Admin routes
│   └── api.py          # API endpoints
├── templates/          # Jinja2 HTML templates
│   ├── base.html       # Base layout
│   ├── index.html      # Homepage
│   ├── books.html      # Bookshelf
│   └── admin/          # Admin templates
├── static/             # Static assets
│   ├── css/            # Custom CSS
│   ├── js/             # JavaScript
│   └── img/            # Images
├── data/               # Static data
│   └── profile.py      # Profile information
├── migrations/         # Database scripts
├── docs/               # Documentation
│   ├── HETZNER_DEPLOYMENT_GUIDE.md
│   ├── MIGRATION_PLAN.md
│   └── VIRAL_TRAFFIC_GUIDE.md
└── old_nextjs_archive/ # Archived Next.js version
```

## 🛠 Tech Stack

- **Backend**: Flask 3.0 with Python 3.11+
- **Package Manager**: [uv](https://github.com/astral-sh/uv) - Fast Python package installer
- **Database**: SQLite (file-based, portable)
- **Frontend**: Bootstrap 5.3, vanilla JavaScript
- **Authentication**: Flask-Login with werkzeug password hashing
- **Production**: Gunicorn + Nginx

## 🎯 Features

- **Homepage/About**: Professional profile with experience, education, and projects
- **Bookshelf**: Curated collection of books with ratings and sorting
- **Admin Dashboard**: Secure book management interface
- **Responsive Design**: Bootstrap 5 for mobile-friendly layout
- **Fast & Lightweight**: SQLite database, server-side rendering
- **Simple Deployment**: Single Python app, easy to deploy on any VPS

## 💻 Development

### Admin Access

1. Navigate to `/admin/login`
2. Use credentials from `.env` file
3. Manage books from the dashboard

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/books?sort=[rating|date|title]` - Get all books

### Database Operations

```python
# Add a new book via script
from app import create_app
from extensions import db
from models.book import Book

app = create_app()
with app.app_context():
    book = Book(
        title="New Book",
        author="Author Name",
        rating=5
    )
    db.session.add(book)
    db.session.commit()
```

### Database Backup

```bash
# Backup
cp database.db database_backup_$(date +%Y%m%d).db

# Restore
cp database_backup_20240101.db database.db
```

## 🚀 Deployment

See [docs/HETZNER_DEPLOYMENT_GUIDE.md](docs/HETZNER_DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

Quick deployment overview:

1. **Server Setup**: Install UV, Python, Nginx
2. **Clone Repository**: `git clone <repo>`
3. **Install Dependencies**: `uv sync`
4. **Configure**: Edit `.env` with production values
5. **Systemd Service**: Set up Gunicorn with systemd
6. **Nginx**: Configure reverse proxy
7. **SSL**: Set up Let's Encrypt

## 📖 Documentation

- [Deployment Guide](docs/HETZNER_DEPLOYMENT_GUIDE.md) - Deploy to Hetzner VPS
- [Migration Guide](docs/MIGRATION_PLAN.md) - Next.js to Flask migration details
- [Traffic Scaling Guide](docs/VIRAL_TRAFFIC_GUIDE.md) - Handle viral traffic
- [Project Documentation](CLAUDE.md) - Detailed project documentation

## 🔧 Environment Variables

- `FLASK_APP`: Entry point (app.py)
- `FLASK_ENV`: Environment (development/production)
- `SECRET_KEY`: Flask secret key for sessions
- `DATABASE_URL`: SQLite database path
- `ADMIN_USERNAME`: Admin login username
- `ADMIN_PASSWORD`: Admin login password

## 🔗 Links

- **Author**: Clay Coffman
- **Email**: claymcoffman@gmail.com

## 📝 License

Private project - All rights reserved

---

*Note: The `old_nextjs_archive/` directory contains the previous Next.js version of this site, preserved for reference.*