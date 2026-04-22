# Next we want to describe the mode or nature of the data we are 
# receiving and sending also known as the schema of the data. We will use pydantic for this purpose

from typing import Optional
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):    # The user's message
    message: str

    session_id: str = "default"

    user_phone: Optional[str] = None

class ChatResponse(BaseModel):     # AI response
    reply: str
    session_id: str = "default"
    is_sensitive: bool = False
    whatsapp_number: Optional[str] = None

class UserRegisterRequest(BaseModel):    # when a new member registers
    name: str = Field(..., description= "The text typed by the user")
    email: str = Field(..., description= "The email of the user")
    phone: str = Field(..., description= "The phone number of the user")


class UserRegisterResponse(BaseModel): # what we send back after registration
    success: bool
    message: str
    name: str

class UserVerifyRequest(BaseModel): # when a returning member enters their phone
    phone: str = Field(..., description = "their phone number")


class UserVerifyResponse(BaseModel): # what we send after confirming user
    found: bool
    name: str
    message: str


class HealthResponse(BaseModel):
    status: str
    version: str = "1.0.0"
    
























