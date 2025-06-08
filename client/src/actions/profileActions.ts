import { Range } from "@/components/StartupGraph";
import config from "@/config";
import { decodeToken } from "@/utils/authUtils";
import axios from "axios";

export const getUser = async (token: string) => {
  const { userId } = decodeToken(token);
  const res = await axios.get(`${config.SERVER_URL}/users/${userId}`, {
    withCredentials: true,
  });

  return res;
};

export const updateUser = async (
  token: string,
  username: string,
  profilePhoto: File | null
) => {
  const { userId } = decodeToken(token);

  const formData = new FormData();
  profilePhoto && formData.append("profileImage", profilePhoto);
  formData.append("username", username);

  const res = await axios.put(
    `${config.SERVER_URL}/users/${userId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    }
  );

  return res.status === 201;
};

export const getAllUsers = async () => {
  const res = await axios.get(`${config.SERVER_URL}/users`, {
    withCredentials: true,
  });

  return res.data;
};

export const sendEmail = async (
  email: string,
  subject: string,
  message: string
) => {
  const res = await axios.post(
    `${config.SERVER_URL}/users/email/${email}`,
    { subject, message },
    {
      withCredentials: true,
    }
  );

  return res.data;
};

export const addStartupToFavorites = async (startupId: string) => {
  const res = await axios.post(
    `${config.SERVER_URL}/users/favorite`,
    {
      startupId,
    },
    {
      withCredentials: true,
    }
  );

  return res.status === 201;
};

export const deleteStartupFromFavorites = async (startupId: string) => {
  const res = await axios.delete(
    `${config.SERVER_URL}/users/favorite/${startupId}`,
    {
      withCredentials: true,
    }
  );

  return res.status === 201;
};

export const getUsersByFavorite = async (startupId: string) => {
  const res = await axios.get(
    `${config.SERVER_URL}/users/favorite/${startupId}`,
    {
      withCredentials: true,
    }
  );

  return res.data;
};

