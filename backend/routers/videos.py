import re
from fastapi import APIRouter, HTTPException
from models.video import VideoCreate, VideoResponse
from services.supabase_client import get_supabase

router = APIRouter()

YOUTUBE_REGEX = re.compile(
    r"(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([a-zA-Z0-9_-]{11})"
)


def extract_video_id(url: str) -> str | None:
    match = YOUTUBE_REGEX.search(url)
    return match.group(1) if match else None


@router.post("", response_model=VideoResponse)
def add_video(video: VideoCreate):
    video_id = extract_video_id(video.youtube_url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")

    supabase = get_supabase()
    result = (
        supabase.table("videos")
        .insert(
            {
                "youtube_video_id": video_id,
                "title": video.title,
            }
        )
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to add video")

    return VideoResponse(**result.data[0])


@router.get("", response_model=list[VideoResponse])
def list_videos():
    supabase = get_supabase()
    result = (
        supabase.table("videos")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )
    return [VideoResponse(**v) for v in result.data]


@router.get("/{video_id}", response_model=VideoResponse)
def get_video(video_id: str):
    supabase = get_supabase()
    result = (
        supabase.table("videos").select("*").eq("id", video_id).single().execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Video not found")

    return VideoResponse(**result.data)
