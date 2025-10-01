# main.py
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# OIDC / OAuth2 setup
oauth = OAuth()
oauth.register(
    name='university',
    client_id=os.getenv("OIDC_CLIENT_ID"),
    client_secret=os.getenv("OIDC_CLIENT_SECRET"),
    server_metadata_url=os.getenv("OIDC_METADATA_URL"),  # e.g., https://idp.university.edu/.well-known/openid-configuration
    client_kwargs={'scope': 'openid email profile'},
)

@app.get("/login")
async def login(request: Request):
    redirect_uri = request.url_for('auth')
    return await oauth.university.authorize_redirect(request, redirect_uri)

@app.get("/auth")
async def auth(request: Request):
    token = await oauth.university.authorize_access_token(request)
    user_info = await oauth.university.parse_id_token(request, token)
    
    # user_info contains data like email, name, etc.
    email = user_info.get("email")
    
    # Here you would update the student's enrollment_status in the database
    # e.g., set enrollment_status = True for this email
    
    return {"message": f"{email} successfully verified as a student!"}
