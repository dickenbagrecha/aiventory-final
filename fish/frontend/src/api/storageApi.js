// src/api/storageApi.js
import { apiGet, apiPost } from "./apiClient.js";

export async function getAllStorageUnits(token) {
    return apiGet("/storage/", token);
}

export async function createStorageUnit(data, token) {
    return apiPost("/storage/", data, token);
}

export async function logTemperature(data, token) {
    return apiPost("/storage/temperature", data, token);
}

export async function getTemperatureLogs(storageId, token) {
    return apiGet(`/storage/${storageId}/temperature`, token);
}
