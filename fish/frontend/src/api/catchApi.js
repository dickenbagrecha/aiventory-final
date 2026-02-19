// src/api/catchApi.js
import { apiGet, apiPost, apiRequest } from "./apiClient.js";

export async function getAllCatchBatches(token, status = null) {
    const endpoint = status ? `/catch/?current_status=${status}` : "/catch/";
    return apiGet(endpoint, token);
}

export async function createCatchBatch(data, token) {
    return apiPost("/catch/", data, token);
}

export async function updateCatchStatus(batchId, status, token) {
    return apiRequest(`/catch/${batchId}/status`, {
        method: "PATCH",
        body: { status },
        token,
    });
}
