import config from "@/config";
import { decodeToken } from "@/utils/authUtils";
import axios from "axios";

export interface StartupFilters {
  name?: string;
  region?: string;
  fundingStages?: string[];
  categories?: string[];
  valuation?: string;
}

const buildFilterParams = (f: StartupFilters) => {
  const params: Record<string, string> = {};
  if (f.name) params.name = f.name;
  if (f.region) params.region = f.region;
  if (f.fundingStages && f.fundingStages.length)
    params.fundingStages = f.fundingStages.join(",");
  if (f.categories && f.categories.length)
    params.categories = f.categories.join(",");
  if (f.valuation) params.valuation = f.valuation;
  return params;
};

export const getAllStartups = async (filters: StartupFilters = {}) => {
  const res = await axios.get(`${config.SERVER_URL}/startups`, {
    params: buildFilterParams(filters),
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
  contactEmail: string,
  contactPhone: string,
  founders: string,
  country: string,
  image: File | null
) => {
  const formData = new FormData();
  image && formData.append("startupImage", image);
  formData.append("name", name);
  tags.forEach((tag) => formData.append("tags[]", tag));
  formData.append("description", description);
  formData.append("fundingStage", fundingStage);
  formData.append("location", location);
  formData.append("foundedYear", foundedYear.toString());
  formData.append("valuationLastRound", valuationLastRound.toString());
  formData.append("longitude", longitude.toString());
  formData.append("latitude", latitude.toString());
  formData.append("contactEmail", contactEmail);
  formData.append("country", country);
  formData.append("contactPhone", contactPhone);
  formData.append("founders", founders);

  const res = await axios.post(`${config.SERVER_URL}/startups`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

  return res.data;
};

export const editStartup = async (
  startupId: string,
  name: string,
  tags: string[],
  description: string,
  fundingStage: string,
  foundedYear: number,
  valuationLastRound: number,
  location: string,
  latitude: number,
  longitude: number,
  contactEmail: string,
  contactPhone: string,
  founders: string,
  country: string,
  image: File | null
) => {
  const formData = new FormData();
  image && formData.append("startupImage", image);
  formData.append("name", name);
  tags.forEach((tag) => formData.append("tags[]", tag));
  formData.append("description", description);
  formData.append("fundingStage", fundingStage);
  formData.append("location", location);
  formData.append("country", country);
  formData.append("foundedYear", foundedYear.toString());
  formData.append("valuationLastRound", valuationLastRound.toString());
  formData.append("longitude", longitude.toString());
  formData.append("latitude", latitude.toString());
  formData.append("contactEmail", contactEmail);
  formData.append("contactPhone", contactPhone);
  formData.append("founders", founders);

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

export const addStartupToVisited = async (startupId: string) => {
  const res = await axios.post(
    `${config.SERVER_URL}/startups/visit`,
    {
      startupId,
    },
    {
      withCredentials: true,
    }
  );

  return res.status === 201;
};

type Range = "daily" | "monthly";

export const getVisitsData = async (startupId: string, range: Range) => {
  const res = await axios.get(
    `${config.SERVER_URL}/startups/visit/${startupId}?range=${range}`,
    {
      withCredentials: true,
    }
  );

  return res.data;
};
