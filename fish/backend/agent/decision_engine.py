class DecisionEngine:
    """
    Pure policy engine.
    No DB access.
    No service calls.
    No side effects.
    """

    def __init__(self, risk_threshold: float = 0.65):
        self.risk_threshold = risk_threshold
        self.monitor_threshold = 0.45

    def compute_risk_score(self, predicted_risk: float, confidence_score: float) -> float:
        """
        Deterministic risk scoring formula.
        """
        return predicted_risk * confidence_score

    def evaluate(self, risk_score: float) -> str:
        """
        Returns decision label.
        """
        if risk_score >= self.risk_threshold:
            return "FLAG_AND_NOTIFY"

        if risk_score >= self.monitor_threshold:
            return "MONITOR"

        return "SAFE"
