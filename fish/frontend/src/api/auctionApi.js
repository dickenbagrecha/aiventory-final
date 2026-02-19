// src/api/auctionApi.js
import { apiGet, apiPost } from "./apiClient.js";

export async function getAllAuctions(token) {
    return apiGet("/auctions/", token);
}

export async function createAuction(data, token) {
    return apiPost("/auctions/", data, token);
}

export async function createBid(data, token) {
    return apiPost("/auctions/bid", data, token);
}

export async function getBidsForAuction(auctionId, token) {
    return apiGet(`/auctions/${auctionId}/bids`, token);
}
