from datetime import datetime
from typing import List, Dict, Any


class AuditLogger:
    """
    Lightweight in-memory audit logger.

    - No database usage
    - No schema modification
    - Fully independent
    - Compatible with INTEGER IDs
    """

    def __init__(self, max_entries: int = 1000):
        self._logs: List[Dict[str, Any]] = []
        self.max_entries = max_entries

    # =====================================================
    # CORE LOGGING
    # =====================================================

    def log_event(
        self,
        action: str,
        entity: str,
        entity_id: int,
        status: str,
        metadata: Dict[str, Any] | None = None,
    ):
        """
        Records a structured audit event.

        Parameters:
        - action: what happened (e.g., "AUTO_FLAG", "STATUS_UPDATE")
        - entity: domain entity name (e.g., "catch_batch")
        - entity_id: INTEGER ID of the entity
        - status: result status ("SUCCESS", "FAILED")
        - metadata: optional additional info
        """

        entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "action": action,
            "entity": entity,
            "entity_id": entity_id,
            "status": status,
            "metadata": metadata or {},
        }

        self._logs.append(entry)

        # Prevent unlimited memory growth
        if len(self._logs) > self.max_entries:
            self._logs.pop(0)

    # =====================================================
    # QUERY METHODS
    # =====================================================

    def get_all_logs(self) -> List[Dict[str, Any]]:
        return self._logs.copy()

    def get_logs_by_entity(self, entity: str) -> List[Dict[str, Any]]:
        return [log for log in self._logs if log["entity"] == entity]

    def get_logs_by_entity_id(self, entity_id: int) -> List[Dict[str, Any]]:
        return [log for log in self._logs if log["entity_id"] == entity_id]

    def clear_logs(self):
        self._logs.clear()
