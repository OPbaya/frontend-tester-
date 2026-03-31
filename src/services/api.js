import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

export async function analyzeApi(requestData) {
    try {
        const response = await api.post("/api/full-analysis", requestData);
        return { success: true, data: response.data };

    } catch (error) {
        return { success: false, error: error.message };
    }
}