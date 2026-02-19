// src/api/notificationsApi.js
import { apiGet, apiPost } from "./apiClient.js";

export async function getAllNotifications(token) {
    return apiGet("/notifications/", token);
}

export async function createNotification(data, token) {
    return apiPost("/notifications/", data, token);
}
