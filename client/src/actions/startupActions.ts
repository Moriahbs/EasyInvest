import config from "@/config";
import { decodeToken } from "@/utils/authUtils";
import axios from "axios";

export const getAllStartups = async () => {
  const res = await axios.get(`${config.SERVER_URL}/startups`, {
    withCredentials: true,
  });

  return res.data;
};

export const getStartupsBySender = async (token: string) => {
  const { userId } = decodeToken(token);

  const res = await axios.get(
    `${config.SERVER_URL}/startups/sender/${userId}`,
    {
      withCredentials: true,
    }
  );

  return res.data;
};

export const getStartupsById = async (startupId: string) => {
  const res = await axios.get(`${config.SERVER_URL}/startups/${startupId}`, {
    withCredentials: true,
  });

  return res.data;
};

export const createStartup = async (
  name: string,
  tags: string[],
  description: string,
  fundingStage: string,
  foundedYear: number,
  valuationLastRound: number,
  location: string,
  latitude: number,
  longitude: number,
  image: string
) => {
  const formData = new FormData();
  image && formData.append("startupImage", image);
  formData.append("name", name);
  formData.append("tags", tags.join(",")); // Join the array into a single string
  formData.append("description", description);
  formData.append("fundingStage", fundingStage);
  formData.append("location", location);
  formData.append("foundedYear", foundedYear.toString());
  formData.append("valuationLastRound", valuationLastRound.toString());
  formData.append("longitude", longitude.toString());
  formData.append("latitude", latitude.toString());

  const res = await axios.post(`${config.SERVER_URL}/startups`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

  return res.data;
};

export const editStartup = async (
  name: string,
  tags: string[],
  description: string,
  fundingStage: string,
  foundedYear: number,
  valuationLastRound: number,
  location: string,
  latitude: number,
  longitude: number,
  image: string
) => {
  const formData = new FormData();
  image && formData.append("startupImage", image);
  formData.append("name", name);
  formData.append("tags", tags.join(",")); // Join the array into a single string
  formData.append("description", description);
  formData.append("fundingStage", fundingStage);
  formData.append("location", location);
  formData.append("foundedYear", foundedYear.toString());
  formData.append("valuationLastRound", valuationLastRound.toString());
  formData.append("longitude", longitude.toString());
  formData.append("latitude", latitude.toString());

  const res = await axios.put(
    `${config.SERVER_URL}/startups/${startupId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    }
  );

  return res.data;
};

export const deleteStartup = async (startupId: string) => {
  const res = await axios.delete(`${config.SERVER_URL}/startups/${startupId}`, {
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
