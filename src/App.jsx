import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

function App() {
  const [backendStatus, setBackendStatus] =
    useState("Checking backend...");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(
          `${API_URL}/health`
        );

        const data = await response.json();

        if (data.success) {
          setBackendStatus(
            "Backend connected successfully"
          );
        } else {
          setBackendStatus(
            "Backend responded with an error"
          );
        }
      } catch (error) {
        console.error(error);

        setBackendStatus(
          "Backend connection failed"
        );
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">
          Agile Management Tool
        </h1>

        <p className="text-gray-600">
          {backendStatus}
        </p>
      </div>
    </div>
  );
}

export default App;