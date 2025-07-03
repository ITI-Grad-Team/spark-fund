# Crowdfunding Platform

**Campoal** is a full-stack crowdfunding web application built with Django (backend) and React (frontend). It enables users to create fundraising campaigns, donate, comment, rate projects, and report inappropriate content — all in a smooth and secure experience.

---

## Features

-  User authentication & profile management
-  Create, edit, and delete fundraising projects
-  Donation system with live progress tracking
-  Project rating & feedback (1–5 stars)
-  Comments and threaded replies on projects
-  Project and comment reporting system
-  Upload multiple images for each project
-  Project target, start & end dates
-  View most funded & top-rated projects

---

##  Tech Stack

| Layer       | Tech                                  |
|------------|----------------------------------------|
| Backend    | Django, Django REST Framework (DRF)    |
| Frontend   | React, Bootstrap 5                     |
| Database   | SupaBase / PostgreSQL                  |
| Auth       | JWT                                    |

---

## Installation (for development)

### Backend – Django

```bash
# Clone the repo
git clone https://github.com/ITI-Grad-Team/spark-fund.git
cd spark-fund/backend

# Set up virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver
```

### Frontend - React

```bash
cd ../frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## Authors
- Ahmed Elsabbagh https://github.com/ahmed-elsabbagh778
- Asmaa Tarek https://github.com/asamaatarek
- Othman Ahmed https://github.com/OthmanAhmed7
- Galal Owais https://github.com/GalaluddinOwais
- Ahmed Hani https://github.com/ahmedhani9007
- Ahmed Ibrahim https://github.com/ahmed-yousef-dev
