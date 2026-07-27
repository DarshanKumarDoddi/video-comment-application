export interface Video {
  id: string;
  youtube_video_id: string;
  title: string;
  added_by_user_id?: string | null;
  created_at: string;
}

export interface Comment {
  id: string;
  video_id: string;
  parent_comment_id?: string | null;
  author_id?: string | null;
  author_name?: string | null;
  text_content?: string | null;
  video_url?: string | null;
  timestamp_seconds?: number | null;
  created_at: string;
  likes_count?: number;
}

export interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

export interface CommentCreate {
  video_id: string;
  text_content?: string | null;
  video_url?: string | null;
  parent_comment_id?: string | null;
  timestamp_seconds?: number | null;
}

export interface User {
  id: string;
  email: string;
  username?: string | null;
}

export interface UserSignup {
  email: string;
  password: string;
  username: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface AuthSession {
  access_token: string;
  user: User;
}

export interface VideoUploadResponse {
  url: string;
  thumbnail_url?: string;
  duration?: number;
}

export interface LikeResponse {
  likes_count: number;
}
