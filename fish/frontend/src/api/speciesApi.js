// src/api/speciesApi.js
import { apiGet, apiPost } from "./apiClient.js";

export async function getAllSpecies(token) {
    return apiGet("/species/", token);
}

export async function createSpecies(data, token) {
    return apiPost("/species/", data, token);
}
