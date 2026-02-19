from apscheduler.schedulers.asyncio import AsyncIOScheduler

from .supervisor import SupervisorAgent
from .domain_agents import RiskDomainAgent


class AutomationEngine:
    """
    Handles periodic autonomous execution.
    Fully independent from LLM.
    No DB modifications.
    """

    def __init__(self):
        self.supervisor = SupervisorAgent()
        self.risk_agent = RiskDomainAgent()
        self.scheduler = AsyncIOScheduler()

    async def monitor_all_batches(self):
        """
        Periodically checks all batches and triggers supervisor logic.
        Protected against batch-level failures.
        """

        try:
            batches = await self.risk_agent.list_batches()
        except Exception as e:
            # Prevent scheduler crash if DB fails
            print(f"[AUTOMATION ERROR] Failed to fetch batches: {e}")
            return

        for batch in batches:
            try:
                await self.supervisor.monitor_batch(batch.id)
            except Exception as e:
                # Prevent single batch failure from stopping loop
                print(
                    f"[AUTOMATION ERROR] Batch {batch.id} failed: {e}"
                )

    def start(self, interval_minutes: int = 10):
        """
        Starts background monitoring.
        """

        self.scheduler.add_job(
            self.monitor_all_batches,
            "interval",
            minutes=interval_minutes,
        )

        self.scheduler.start()
