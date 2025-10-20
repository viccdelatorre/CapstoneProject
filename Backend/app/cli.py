from pathlib import Path
import psycopg2
import os
from dotenv import load_dotenv
import hashlib
import webbrowser

env_path = Path(__file__).resolve().parent.parent / "backend" / ".env"
load_dotenv(env_path)

DATABASE_URL = os.getenv("DATABASE_URL")

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def create_student():
    full_name = input("Student Name: ")
    email = input("Student Email: ")
    password = input("Password: ")

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO students (full_name, email, password_hash) VALUES (%s, %s, %s) RETURNING id",
        (full_name, email, hash_password(password))
    )
    student_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    print(f"Student account created with ID {student_id}")

def create_donor():
    full_name = input("Donor Name: ")
    email = input("Donor Email: ")
    password = input("Password: ")

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO donors (full_name, email, password_hash) VALUES (%s, %s, %s) RETURNING id",
        (full_name, email, hash_password(password))
    )
    donor_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    print(f"Donor account created with ID {donor_id}")

def verify_student_via_sso():
    url = "http://localhost:8000/login"  # FastAPI backend endpoint
    print("Opening browser to log in via university SSO...")
    webbrowser.open(url)
    input("Press Enter after completing the SSO login in your browser...")
    
def main():
    choice = input("Create (1) Student or (2) Donor? ")
    if choice == "1":
        create_student()
        verify_student_via_sso()
    elif choice == "2":
        create_donor()
    else:
        print("Invalid choice")

if __name__ == "__main__":
    main()
