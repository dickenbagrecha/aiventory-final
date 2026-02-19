from google.adk.agents import LlmAgent
from .prompt import ROOT_AGENT_PROMPT
from .tools import (

    # ===============================
    # CORE CRUD TOOLS
    # ===============================
    register_vessel,
    list_all_vessels,
    add_species,
    list_all_species,
    register_catch_batch,
    list_catch_batches,
    get_total_auctions,
    get_total_bids_for_auction,
    get_spoilage_prediction,
    get_high_risk_batches,
    auto_flag_high_risk_batches,
    get_temperature_logs,
    list_notifications,

    # ===============================
    # INTELLIGENCE LAYER
    # ===============================
    learn_optimal_risk_threshold,
    dynamic_auction_optimizer,
    simulate_future_spoilage,
    vessel_performance_trend_forecast,
    decision_recommendation_engine,
    auto_auction_pricing_advisor,
    temperature_anomaly_detector,
    vessel_efficiency_ranking,
)

from constants import AGENT_NAME, AGENT_DESCRIPTION, AGENT_MODEL


root_agent = LlmAgent(
    name=AGENT_NAME,
    model=AGENT_MODEL,
    description=AGENT_DESCRIPTION,
    instruction=ROOT_AGENT_PROMPT,
    tools=[

        # ===============================
        # CORE OPERATIONS
        # ===============================
        register_vessel,
        list_all_vessels,
        add_species,
        list_all_species,
        register_catch_batch,
        list_catch_batches,
        get_total_auctions,
        get_total_bids_for_auction,
        get_spoilage_prediction,
        get_high_risk_batches,
        auto_flag_high_risk_batches,
        get_temperature_logs,
        list_notifications,

        # ===============================
        # DECISION & ANALYTICS
        # ===============================
        learn_optimal_risk_threshold,
        dynamic_auction_optimizer,
        simulate_future_spoilage,
        vessel_performance_trend_forecast,
        decision_recommendation_engine,
        auto_auction_pricing_advisor,
        temperature_anomaly_detector,
        vessel_efficiency_ranking,
    ]
)
