import cloudinary
import cloudinary.uploader
import config

cloudinary.config(
    cloud_name=config.CLOUDINARY_CLOUD_NAME,
    api_key=config.CLOUDINARY_API_KEY,
    api_secret=config.CLOUDINARY_API_SECRET,
    secure=True,
)


def upload_video(file_path: str) -> dict:
    result = cloudinary.uploader.upload(
        file_path,
        resource_type="video",
        folder="comment-videos",
        eager_async=False,
    )
    return {
        "url": result["secure_url"],
        "thumbnail_url": result.get("thumbnail_url", ""),
        "duration": result.get("duration", 0),
        "public_id": result.get("public_id", ""),
    }


def upload_video_bytes(file_bytes: bytes, filename: str) -> dict:
    result = cloudinary.uploader.upload(
        file_bytes,
        resource_type="video",
        folder="comment-videos",
        filename=filename,
        eager_async=False,
    )
    return {
        "url": result["secure_url"],
        "thumbnail_url": result.get("thumbnail_url", ""),
        "duration": result.get("duration", 0),
        "public_id": result.get("public_id", ""),
    }
