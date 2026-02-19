from typing import Dict

from services.marine_service import MarineService
from repos.marine_repo import MarineRepo
from models.data_models import NotificationLog

from .decision_engine import DecisionEngine


class SupervisorAgent:
    """
    Orchestrates risk monitoring workflow without modifying
    database schema or service contracts.
    """

    def __init__(self):
        repo = MarineRepo()
        self.service = MarineService(repo)

        # Inject policy engine
        self.decision_engine = DecisionEngine()

    async def monitor_batch(self, batch_id: str) -> Dict:
        """
        Evaluate spoilage risk and take action if necessary.
        """

        # 1️⃣ Fetch spoilage prediction
        spoilage = await self.service.get_spoilage_by_batch(batch_id)

        # 2️⃣ Compute risk score using policy engine
        risk_score = self.decision_engine.compute_risk_score(
            spoilage.predicted_risk,
            spoilage.confidence_score
        )

        # 3️⃣ Evaluate decision
        decision = self.decision_engine.evaluate(risk_score)

        # 4️⃣ Execute action if needed
        if decision == "FLAG_AND_NOTIFY":

            await self.service.update_catch_status(
                batch_id=batch_id,
                status="HIGH_RISK"
            )

            notification = NotificationLog(
                phone_number="SYSTEM",
                message_type="RISK_ALERT",
                message_body=f"Batch {batch_id} marked HIGH_RISK with score {risk_score:.2f}",
                status="GENERATED"
            )

            await self.service.log_notification(notification)

        return {
            "batch_id": batch_id,
            "risk_score": risk_score,
            "decision": decision
        }
