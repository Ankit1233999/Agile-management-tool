const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export const checkBackend = async () => {
  try {
    const response = await fetch(
      `${API_URL}/health`
    );

    if (!response.ok) {
      throw new Error(
        `HTTP error: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Backend connection failed:",
      error
    );

    throw error;
  }
};

export default API_URL;