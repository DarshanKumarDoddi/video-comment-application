from pydantic import BaseModel


class VideoCreate(BaseModel):
    youtube_url: str
    title: str


class VideoResponse(BaseModel):
    id: str
    youtube_video_id: str
    title: str
    added_by_user_id: str | None = None
    created_at: str
