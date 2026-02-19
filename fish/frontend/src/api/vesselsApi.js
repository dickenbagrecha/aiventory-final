// src/api/vesselsApi.js
import { apiGet, apiPost, apiDelete } from "./apiClient.js";

export async function getAllVessels(token) {
    return apiGet("/vessels/", token);
}

export async function createVessel(data, token) {
    return apiPost("/vessels/", data, token);
}

export async function deleteVessel(vesselId, token) {
    return apiDelete(`/vessels/${vesselId}`, token);
}
