// src/api/analyticsApi.js
import { apiGet, apiPost } from "./apiClient.js";

export async function getSpoilageByBatch(batchId, token) {
    return apiGet(`/analytics/spoilage/${batchId}`, token);
}

export async function evaluateSpoilage(data, token) {
    return apiPost("/analytics/evaluate-spoilage", data, token);
}

export async function recommendAuctionPrice(data, token) {
    return apiPost("/analytics/recommend-auction-price", data, token);
}
