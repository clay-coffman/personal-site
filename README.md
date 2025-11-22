# Clay Coffman Personal Site

My personal site. Built with flask + bootstrap. Hosted on my trusty little
hetzner server. Don't break it.

## 🛠 Tech Stack

- **Backend**: Flask 3.0 with Python 3.11+
- **Package Manager**: [uv](https://github.com/astral-sh/uv) - Fast Python
  package installer
- **Database**: SQLite (file-based, portable)
- **Frontend**: Bootstrap 5.3, vanilla JavaScript
- **Authentication**: Flask-Login with werkzeug password hashing
- **Production**: Gunicorn + Nginx

## How to dev

```bash
uv sync

# make sure .env exists!

uv run python app.py
```

