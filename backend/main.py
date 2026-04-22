from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from model import (
    HealthResponse, 
    UserRegisterRequest, UserRegisterResponse, 
    UserVerifyRequest, UserVerifyResponse, 
    ChatRequest, ChatResponse
)
from database import register_user, verify_user
from detector import is_sensitive
from chains import run_chat
import os
from dotenv import load_dotenv
import uvicorn

load_dotenv()


app = FastAPI(
    title="Eden AI",
    description= "Backend API for Eden AI a product of PJPM",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",           # local development
        "https://eden-ai-frontend-self.vercel.app/"      # production frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#define a class for the health response

# build the end point for the health check
@app.get("/health", response_model=HealthResponse)
def get_health():
    return HealthResponse(status="Shepherd API is running")


@app.post("/user/register", response_model=UserRegisterResponse)
async def register(request: UserRegisterRequest):
    success, result_message = register_user(request.name, request.email, request.phone)
    
    if not success:
        # We still return 200 but with success=False so the frontend can show the error
        return {
            "success": False, 
            "message": result_message, 
            "name": request.name
        }
    
    return {
        "success": True, 
        "message": "Welcome to the family!", 
        "name": request.name
    }

@app.post("/user/verify", response_model=UserVerifyResponse)
async def verify(request: UserVerifyRequest):
    found, name = verify_user(request.phone)
    
    if found:
        return {
            "found": True, 
            "name": name, 
            "message": f"Welcome back, {name}!"
        }
    
    return {
        "found": False, 
        "name": None, 
        "message": "User not found. Please register."
    }

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        # Check if message is sensitive
        sensitive = is_sensitive(request.message)

        # Run the AI chain regardless
        # (we still respond even for sensitive topics)
        reply = run_chat(
            message=request.message,
            session_id=request.session_id,
            user_name="Friend"  # we'll improve this later
        )

        # Return response
        # If sensitive include whatsapp number
        return ChatResponse(
            reply=reply,
            session_id=request.session_id,
            is_sensitive=sensitive,
            whatsapp_number=os.getenv("CHURCH_WHATSAPP") if sensitive else None
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


# running the server
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
