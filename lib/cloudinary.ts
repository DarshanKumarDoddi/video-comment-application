const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

export async function uploadToCloudinary(
  fileUri: string,
  fileName: string
): Promise<{ url: string; duration: number }> {
  const formData = new FormData();
  formData.append("file", {
    uri: fileUri,
    name: fileName,
    type: "video/mp4",
  } as unknown as Blob);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "comment-videos");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(err.error?.message || "Upload failed");
  }

  const data = await res.json();
  return {
    url: data.secure_url,
    duration: data.duration ?? 0,
  };
}
