from pydantic import BaseModel


class CommentCreate(BaseModel):
    video_id: str
    text_content: str | None = None
    video_url: str | None = None
    parent_comment_id: str | None = None
    timestamp_seconds: int | None = None


class CommentResponse(BaseModel):
    id: str
    video_id: str
    parent_comment_id: str | None = None
    author_id: str | None = None
    author_name: str | None = None
    text_content: str | None = None
    video_url: str | None = None
    timestamp_seconds: int | None = None
    created_at: str
    likes_count: int = 0
