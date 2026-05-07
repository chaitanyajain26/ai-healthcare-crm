import { apiClient } from "./apiClient";

export const interactionApi = {
  list: async () => {
    const { data } = await apiClient.get("/interactions");
    return data;
  },
  create: async (payload) => {
    const { data } = await apiClient.post("/interactions", payload);
    return data;
  }
};
