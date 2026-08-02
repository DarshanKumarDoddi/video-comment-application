from fastapi import APIRouter, HTTPException, Header
from models.user import UserSignup, UserLogin, UserResponse
from services.supabase_client import get_supabase

router = APIRouter()


@router.post("/signup", response_model=UserResponse)
def signup(user: UserSignup):
    supabase = get_supabase()
    result = supabase.auth.sign_up(
        {"email": user.email, "password": user.password}
    )

    if result.user is None:
        raise HTTPException(status_code=400, detail="Signup failed")

    supabase.table("users").insert(
        {
            "id": result.user.id,
            "email": result.user.email,
            "username": user.username,
        }
    ).execute()

    return UserResponse(
        id=result.user.id,
        email=result.user.email,
        username=user.username,
    )


@router.post("/login")
def login(user: UserLogin):
    supabase = get_supabase()
    result = supabase.auth.sign_in_with_password(
        {"email": user.email, "password": user.password}
    )

    if result.session is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "access_token": result.session.access_token,
        "user": {
            "id": result.user.id,
            "email": result.user.email,
        },
    }


@router.get("/me")
def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "")
    supabase = get_supabase()
    result = supabase.auth.get_user(token)

    if result.user is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    return {
        "id": result.user.id,
        "email": result.user.email,
    }
