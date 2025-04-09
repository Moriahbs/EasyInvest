import config from "@/config";
import { decodeToken } from "@/utils/authUtils";
import axios from "axios";

export const getAllProjects = async () => {
  const res = await axios.get(`${config.SERVER_URL}/projects`, {
    withCredentials: true,
  });

  return res.data;
};

export const getProjectsBySender = async (token: string) => {
  const { userId } = decodeToken(token);

  const res = await axios.get(
    `${config.SERVER_URL}/projects/sender/${userId}`,
    {
      withCredentials: true,
    }
  );

  return res.data;
};

export const getProjectsById = async (projectId: string) => {
  const res = await axios.get(`${config.SERVER_URL}/projects/${projectId}`, {
    withCredentials: true,
  });

  return res.data;
};

export const createProject = async (
  name: string,
  category: string,
  description: string,
  targetAudience: string,
  financialGoals: string,
  image: File | null
) => {
  const formData = new FormData();
  image && formData.append("projectImage", image);
  formData.append("name", name);
  formData.append("category", category);
  formData.append("description", description);
  formData.append("targetAudience", targetAudience);
  formData.append("financialGoals", financialGoals);

  const res = await axios.post(`${config.SERVER_URL}/projects`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

  return res.data;
};

export const editProject = async (
  projectId: string,
  name: string,
  category: string,
  description: string,
  targetAudience: string,
  financialGoals: string,
  image: File | null
) => {
  const formData = new FormData();
  image && formData.append("projectImage", image);
  formData.append("name", name);
  formData.append("category", category);
  formData.append("description", description);
  formData.append("targetAudience", targetAudience);
  formData.append("financialGoals", financialGoals);

  const res = await axios.put(
    `${config.SERVER_URL}/projects/${projectId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    }
  );

  return res.data;
};

export const deleteProject = async (projectId: string) => {
  const res = await axios.delete(`${config.SERVER_URL}/projects/${projectId}`, {
    withCredentials: true,
  });

  return res.data;
};

// export const getCommentsByPost = async (postId: string) => {
//   const res = await axios.get(
//     `${config.SERVER_URL}/comments/postId/${postId}`,
//     {
//       withCredentials: true,
//     }
//   );

//   return res.data;
// };

// export const addCommentToPost = async (postId: string, comment: string) => {
//   const res = await axios.post(
//     `${config.SERVER_URL}/comments`,
//     {
//       body: comment,
//       postId,
//     },
//     {
//       withCredentials: true,
//     }
//   );

//   return res.status === 201;
// };

// export const addLikeToPost = async (postId: string) => {
//   const res = await axios.post(
//     `${config.SERVER_URL}/posts/like`,
//     {
//       postId,
//     },
//     {
//       withCredentials: true,
//     }
//   );

//   return res.status === 201;
// };

// export const deleteLikeFromPost = async (postId: string) => {
//   const res = await axios.delete(
//     `${config.SERVER_URL}/posts/like/${postId}`,
//     {
//       withCredentials: true,
//     }
//   );

//   return res.status === 201;
// };
