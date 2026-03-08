import { ExperimentData } from "@/types/experiment";

const API_BASE_URL = "http://localhost:3001/api";

export interface SavedExperiment {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  contentCount: number;
}

export const api = {
  async saveExperiment(data: ExperimentData & { id: string; userEmail?: string }) {
    const response = await fetch(`${API_BASE_URL}/experiments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to save experiment");
    }

    return response.json();
  },

  async getExperiments(userEmail?: string): Promise<SavedExperiment[]> {
    const url = new URL(`${API_BASE_URL}/experiments`);
    if (userEmail) {
      url.searchParams.append("userEmail", userEmail);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error("Failed to fetch experiments");
    }

    return response.json();
  },

  async getExperiment(id: string): Promise<ExperimentData & { id: string; createdAt: string; updatedAt: string }> {
    const response = await fetch(`${API_BASE_URL}/experiments/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch experiment");
    }

    return response.json();
  },

  async deleteExperiment(id: string) {
    const response = await fetch(`${API_BASE_URL}/experiments/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete experiment");
    }

    return response.json();
  },
};
