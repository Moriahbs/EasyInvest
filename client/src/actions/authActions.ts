import config from "@/config";
import axios from "axios";

export const loginUser = async (username: string, password: string) => {
  const res = await axios.post(
    `${config.SERVER_URL}/users/login`,
    {
      username,
      password,
    },
    {
      withCredentials: true,
    }
  );
  return res.status === 201;
};

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  profilePhoto?: File | null
) => {
  const formData = new FormData();
  profilePhoto && formData.append("profileImage", profilePhoto);
  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);

  const res = await axios.post(
    `${config.SERVER_URL}/users/register`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    }
  );
  return res.status === 201;
};

export const logoutUser = async () => {
  const res = await axios.post(
    `${config.SERVER_URL}/users/logout`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.status === 200;
};
