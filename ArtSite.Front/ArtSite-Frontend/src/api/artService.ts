// api/artService.ts
import apiClient from "./client";
import type { Art } from "../types/art";
import type { Picture } from "../types/picture";
import type { Comment, AddingComment } from "../types/comment"


export const fetchArts = async (offset: number = 0, limit: number = 10): Promise<Art[]> => {
  const response = await apiClient.get("/api/arts", { params: { offset, limit } });
  return response.data;
};

export const fetchArtById = async (artId: number): Promise<Art> => {
  const response = await apiClient.get(`/api/arts/${artId}`);
  return response.data;
};

export const deleteArt = async (artId: number): Promise<void> => {
  await apiClient.delete(`/api/arts/${artId}`);
};

export const uploadPicture = async (artId: number, file: File): Promise<Picture> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post(`/api/arts/${artId}/pictures`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const fetchComments = async (artId: number, offset: number = 0, limit: number = 10): Promise<Comment[]> => {
  const response = await apiClient.get(`/api/arts/${artId}/comments`, { params: { offset, limit } });
  return response.data;
};

export const postComment = async (artId: number, comment: AddingComment): Promise<void> => {
  await apiClient.post(`/api/arts/${artId}/comments`, comment);
};
