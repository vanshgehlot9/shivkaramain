"""
app/core/scheduler.py — Background scheduler for Shivkara Digital
"""
import asyncio
import logging

logger = logging.getLogger(__name__)


async def start_background_scheduler():
    """Background task that runs periodically to check for scheduled actions."""
    logger.info("Background scheduler started")
    while True:
        try:
            # Add scheduled tasks for Shivkara Digital here (e.g., course reminders, etc.)
            pass
        except Exception as e:
            logger.error("Scheduler loop error: %s", e)

        # Run every hour
        await asyncio.sleep(3600)
