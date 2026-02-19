from datetime import datetime, timedelta
from typing import Dict


class MemoryManager:
    """
    In-memory runtime memory.
    Prevents repeated high-risk actions within cooldown window.
    No database usage.
    """

    def __init__(self, cooldown_minutes: int = 30):
        # batch_id (int) -> last_action_time
        self._high_risk_memory: Dict[int, datetime] = {}
        self.cooldown = timedelta(minutes=cooldown_minutes)

    def should_trigger_high_risk(self, batch_id: int) -> bool:
        """
        Returns True if action should proceed.
        Returns False if still within cooldown.
        """

        now = datetime.utcnow()

        if batch_id not in self._high_risk_memory:
            return True

        last_time = self._high_risk_memory[batch_id]

        return now - last_time >= self.cooldown

    def record_high_risk_action(self, batch_id: int):
        """
        Records that high risk action was triggered.
        """

        self._high_risk_memory[batch_id] = datetime.utcnow()
