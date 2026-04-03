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

// Load test
export async function runLoadTest(requestData) {
    try {
        const response = await api.post("/api/load-test", requestData);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get all history
export async function getAllHistory() {
    try {
        const response = await api.get("/api/history");
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
// Search history by URL
export async function searchHistory(url) {
    try {
        const response = await api.get("/api/history/search", {
            params: { url }
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Delete history entry
export async function deleteHistory(id) {
    try {
        await api.delete(`/api/history/${id}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Compare two history entries
export async function compareHistory(id1, id2) {
    try {
        const response = await api.get(`/api/history/compare/${id1}/${id2}`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }

}