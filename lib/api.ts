import { supabase } from "./supabase";
import { Video, Comment, CommentCreate, LikeResponse } from "../types";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";
const USE_MOCK_DATA = process.env.EXPO_PUBLIC_USE_MOCK_DATA === "true";

const MOCK_VIDEOS: Video[] = [
  {
    id: "mock-1",
    youtube_video_id: "QlFwVjhllzQ",
    title: "Sample Video 1",
    created_at: "2026-07-20T10:00:00Z",
  },
  {
    id: "mock-2",
    youtube_video_id: "bP8ATWCvqzw",
    title: "Sample Video 2",
    created_at: "2026-07-21T10:00:00Z",
  },
  {
    id: "mock-3",
    youtube_video_id: "AVVqU5SG1P8",
    title: "Sample Video 3",
    created_at: "2026-07-22T10:00:00Z",
  },
];

let mockComments: Comment[] = [
  {
    id: "mc-1",
    video_id: "mock-1",
    author_id: "user-1",
    author_name: "Alice",
    text_content: "Great video! Really enjoyed this one.",
    timestamp_seconds: 30,
    created_at: "2026-07-22T12:00:00Z",
    likes_count: 5,
  },
  {
    id: "mc-2",
    video_id: "mock-1",
    parent_comment_id: "mc-1",
    author_id: "user-2",
    author_name: "Bob",
    text_content: "Agreed! The timestamps are super helpful.",
    timestamp_seconds: null,
    created_at: "2026-07-22T12:30:00Z",
    likes_count: 2,
  },
  {
    id: "mc-3",
    video_id: "mock-1",
    author_id: "user-3",
    author_name: "Charlie",
    text_content: "Check out this reaction!",
    video_url: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
    timestamp_seconds: 45,
    created_at: "2026-07-22T13:00:00Z",
    likes_count: 8,
  },
];

async function apiGet<T>(path: string): Promise<T> {
  if (USE_MOCK_DATA) {
    throw new Error("Using mock data");
  }
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  if (USE_MOCK_DATA) {
    throw new Error("Using mock data");
  }
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  if (USE_MOCK_DATA) {
    throw new Error("Using mock data");
  }
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || "Upload failed");
  }
  return res.json();
}

export async function fetchVideos(): Promise<Video[]> {
  if (USE_MOCK_DATA) return MOCK_VIDEOS;
  return apiGet<Video[]>("/api/videos");
}

export async function fetchVideo(id: string): Promise<Video> {
  if (USE_MOCK_DATA) {
    const found = MOCK_VIDEOS.find((v) => v.id === id);
    if (found) return found;
    return MOCK_VIDEOS[0];
  }
  return apiGet<Video>(`/api/videos/${id}`);
}

export async function fetchComments(videoId: string): Promise<Comment[]> {
  if (USE_MOCK_DATA) {
    return mockComments.filter((c) => c.video_id === videoId);
  }
  return apiGet<Comment[]>(`/api/videos/${videoId}/comments`);
}

export async function postComment(
  comment: CommentCreate
): Promise<Comment> {
  if (USE_MOCK_DATA) {
    const newComment: Comment = {
      id: `mock-${Date.now()}`,
      video_id: comment.video_id,
      author_id: "mock-user",
      author_name: "You",
      text_content: comment.text_content,
      video_url: comment.video_url,
      parent_comment_id: comment.parent_comment_id,
      timestamp_seconds: comment.timestamp_seconds,
      created_at: new Date().toISOString(),
      likes_count: 0,
    };
    mockComments = [...mockComments, newComment];
    return newComment;
  }
  return apiPost<Comment>("/api/comments", comment);
}

export async function likeComment(
  commentId: string
): Promise<LikeResponse> {
  if (USE_MOCK_DATA) {
    const comment = mockComments.find((c) => c.id === commentId);
    if (comment) {
      comment.likes_count = (comment.likes_count || 0) + 1;
      return { likes_count: comment.likes_count };
    }
    return { likes_count: 1 };
  }
  return apiPost<LikeResponse>(`/api/videos/${commentId}/like`, {});
}

export async function addVideo(
  youtubeUrl: string,
  title: string
): Promise<Video> {
  if (USE_MOCK_DATA) {
    return {
      id: `mock-${Date.now()}`,
      youtube_video_id: "dQw4w9WgXcQ",
      title,
      created_at: new Date().toISOString(),
    };
  }
  return apiPost<Video>("/api/videos", {
    youtube_url: youtubeUrl,
    title,
  });
}

export async function uploadVideoComment(
  fileUri: string,
  fileName: string
): Promise<{ url: string; thumbnail_url: string; duration: number }> {
  if (USE_MOCK_DATA) {
    return {
      url: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
      thumbnail_url: "",
      duration: 0,
    };
  }
  const formData = new FormData();
  formData.append("file", {
    uri: fileUri,
    name: fileName,
    type: "video/mp4",
  } as unknown as Blob);
  return apiUpload("/api/upload/video-comment", formData);
}
