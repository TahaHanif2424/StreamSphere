import { useRouteLoaderData } from "react-router";
import UploadForm from "../components/Upload/UploadForm";
import store from "../store";
import { apiFetch } from "../utils/api";

export default function VideoFormPage() {
  const data = useRouteLoaderData("video");
  let returnedElement = <UploadForm />;

  if (data) {
    returnedElement = <UploadForm {...data.destinationVideo} />;
  }

  return returnedElement;
}

export async function action({ request, params }) {
  const user = store.getState().user.user;
  const isEditing = !!params.videoId;
  const originalFormData = await request.formData();

  const formData = new FormData();

  const videoFile = originalFormData.get("video");
  const thumbnailFile = originalFormData.get("thumbnail");
  const title = originalFormData.get("title");

  formData.append("video", videoFile);
  formData.append("thumbnail", thumbnailFile);
  formData.append("data", JSON.stringify({ title, user_id: user._id }));

  const url = isEditing
    ? `http://localhost:5000/video/update/${params.videoId}`
    : "http://localhost:5000/video/add";

  const token = localStorage.getItem("accessToken");

  const response = await fetch(url, {
    method: "POST",
    body: formData,
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return response;
}
