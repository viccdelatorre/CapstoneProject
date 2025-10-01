# Backend/main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal, Base, engine
import webbrowser

# Create all tables (only needed once)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduConnect API")


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "EduConnect API running"}


@app.get("/sso-login")
def sso_login():
    """
    Placeholder for SSO login.
    In reality, you would redirect to university SSO login URL.
    """
    url = "http://university-sso.example.com/login"
    webbrowser.open(url)
    return {"message": "Browser opened for SSO login. Complete login to continue."}


@app.get("/students")
def list_students(db: Session = Depends(get_db)):
    """Example route to test database connection."""
    result = db.execute("SELECT id, full_name, email, enrollment_status FROM students")
    students = [dict(row) for row in result.fetchall()]
    return {"students": students}
