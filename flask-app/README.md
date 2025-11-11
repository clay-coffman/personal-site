# Clay Coffman Personal Site - Flask Version

A lightweight, fast personal portfolio and bookshelf website built with Flask, Bootstrap, and SQLite.

## Features

- **Homepage/About**: Professional profile with experience, education, and projects
- **Bookshelf**: Curated collection of books with ratings and sorting
- **Admin Dashboard**: Secure book management interface
- **Responsive Design**: Bootstrap 5 for mobile-friendly layout
- **Fast & Lightweight**: SQLite database, server-side rendering
- **Simple Deployment**: Single Python app, easy to deploy on any VPS

## Tech Stack

- **Backend**: Flask 3.0 with Python 3.11+
- **Database**: SQLite (file-based, portable)
- **Frontend**: Bootstrap 5.3, vanilla JavaScript
- **Authentication**: Flask-Login with werkzeug password hashing
- **Production**: Gunicorn + Nginx

## Quick Start

### 1. Setup Virtual Environment

```bash
cd flask-app
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env`:
```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=your-password
```

### 4. Initialize Database

```bash
# Create database with sample data
python migrations/import_books.py --sample

# Or import from JSON
python migrations/import_books.py --json books_export.json
```

### 5. Run the Application

```bash
python app.py
```

Visit http://localhost:5001

## Project Structure

```
flask-app/
├── app.py              # Main Flask application
├── config.py           # Configuration settings
├── extensions.py       # Flask extensions (db, login_manager)
├── models/            # Database models
│   ├── book.py       # Book model
│   └── user.py       # User model
├── routes/            # Flask blueprints
│   ├── main.py       # Public routes
│   ├── admin.py      # Admin routes
│   └── api.py        # API endpoints
├── templates/         # Jinja2 templates
│   ├── base.html     # Base layout
│   ├── index.html    # Homepage
│   ├── books.html    # Bookshelf
│   └── admin/        # Admin templates
├── static/           # Static assets
│   ├── css/         # Custom CSS
│   ├── js/          # JavaScript
│   └── img/         # Images
├── data/            # Static data
│   └── profile.py   # Profile information
└── migrations/      # Database scripts
    └── import_books.py
```

## Admin Access

1. Navigate to `/admin/login`
2. Use credentials from `.env` file
3. Manage books from the dashboard

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/books?sort=[rating|date|title]` - Get all books

## Deployment on Hetzner

### 1. Server Setup

```bash
# Install dependencies
sudo apt update
sudo apt install python3-pip python3-venv nginx

# Clone repository
git clone <repo-url>
cd personal-site/flask-app

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Gunicorn

Create `/etc/systemd/system/personal-site.service`:

```ini
[Unit]
Description=Clay Personal Site
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/personal-site/flask-app
Environment="PATH=/var/www/personal-site/flask-app/venv/bin"
ExecStart=/var/www/personal-site/flask-app/venv/bin/gunicorn --workers 2 --bind 127.0.0.1:8000 app:create_app()

[Install]
WantedBy=multi-user.target
```

### 3. Configure Nginx

Create `/etc/nginx/sites-available/personal-site`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static {
        alias /var/www/personal-site/flask-app/static;
        expires 30d;
    }
}
```

### 4. Enable and Start Services

```bash
sudo systemctl enable personal-site
sudo systemctl start personal-site
sudo ln -s /etc/nginx/sites-available/personal-site /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Database Backup

```bash
# Backup
cp database.db database_backup_$(date +%Y%m%d).db

# Restore
cp database_backup_20240101.db database.db
```

## Development

### Adding New Books via Script

```python
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

## Environment Variables

- `FLASK_APP`: Entry point (app.py)
- `FLASK_ENV`: Environment (development/production)
- `SECRET_KEY`: Flask secret key for sessions
- `DATABASE_URL`: SQLite database path
- `ADMIN_USERNAME`: Admin login username
- `ADMIN_PASSWORD`: Admin login password

## License

Private project - All rights reserved

## Author

Clay Coffman - claymcoffman@gmail.com