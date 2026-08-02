import os
from fastapi import FastAPI, HTTPException, Header, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from routers import videos, auth, comments
from models.comment import CommentCreate, CommentResponse
from services.supabase_client import get_supabase
from services.cloudinary_client import upload_video_bytes

app = FastAPI(title="CommentVideo API", version="0.1.0", docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    redoc_url="/api/redoc")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://27092004.xyz",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:3000",
    ],
    allow_origin_regex=r"https?://.*\\.27092004\\.xyz",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_user_from_token(token: str) -> dict | None:
    supabase = get_supabase()
    result = supabase.auth.get_user(token)
    if result.user is None:
        return None
    return {"id": result.user.id, "email": result.user.email}


def get_username(user_id: str) -> str:
    supabase = get_supabase()
    result = (
        supabase.table("users")
        .select("username")
        .eq("id", user_id)
        .single()
        .execute()
    )
    if result.data and result.data.get("username"):
        return result.data["username"]
    return "User"


@app.post("/api/comments", response_model=CommentResponse)
def create_comment(comment: CommentCreate, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "")
    user = get_user_from_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    supabase = get_supabase()
    result = (
        supabase.table("comments")
        .insert(
            {
                "video_id": comment.video_id,
                "author_id": user["id"],
                "text_content": comment.text_content,
                "video_url": comment.video_url,
                "parent_comment_id": comment.parent_comment_id,
                "timestamp_seconds": comment.timestamp_seconds,
            }
        )
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create comment")

    created = result.data[0]
    created["author_name"] = get_username(user["id"])
    return CommentResponse(**created)


@app.post("/api/upload/video-comment")
def upload_video_comment(
    file: UploadFile = File(...),
    authorization: str = Header(None),
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "")
    user = get_user_from_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    if not file.content_type or not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="File must be a video")

    file_bytes = file.file.read()
    if len(file_bytes) > 50 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 50MB)")

    try:
        result = upload_video_bytes(file_bytes, file.filename or "video.mp4")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    return {
        "url": result["url"],
        "thumbnail_url": result.get("thumbnail_url", ""),
        "duration": result.get("duration", 0),
    }


app.include_router(videos.router, prefix="/api/videos", tags=["videos"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(comments.router, prefix="/api/videos", tags=["comments"])

if os.path.isdir("../frontend"):
    app.mount("/", StaticFiles(directory="../frontend", html=True), name="frontend")


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
