import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# 1. Create Supabase client
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

if not url or not key:
    print("⚠️ Warning: SUPABASE_URL or SUPABASE_KEY missing from .env")

supabase: Client = create_client(url, key)

# 2. Function: register_user(name, email, phone)
def register_user(name: str, email: str, phone: str):
    try:
        data = {
            "name": name,
            "email": email,
            "phone": phone
        }
        # Insert the data into the 'users' table
        response = supabase.table("users").insert(data).execute()
        
        return True, name
    
    except Exception as e:
        error_msg = str(e)
        # Handle the "unique constraint" error (Duplicate phone/email)
        if "already exists" in error_msg.lower() or "duplicate key" in error_msg.lower():
            return False, "This email or phone number is already registered."
        
        print(f"Registration Error: {error_msg}")
        return False, "Something went wrong. Please try again later."

# 3. Function: verify_user(phone)
def verify_user(phone: str):
    try:
        # Query where phone column equals the provided phone
        response = supabase.table("users").select("name").eq("phone", phone).execute()
        
        if response.data and len(response.data) > 0:
            return True, response.data[0]['name']
        
        return False, None
        
    except Exception as e:
        print(f"Verification Error: {e}")
        return False, None

# 4. Function: get_user_by_phone(phone)
def get_user_by_phone(phone: str):
    try:
        response = supabase.table("users").select("*").eq("phone", phone).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        
        return None
        
    except Exception as e:
        print(f"Fetch User Error: {e}")
        return None