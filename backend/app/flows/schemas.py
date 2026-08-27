"""
app/flows/schemas.py — Pydantic models for WhatsApp Flow screens for Shivkara Digital
"""
from __future__ import annotations

from typing import Any, Optional

from pydantic import BaseModel, Field


class FlowRequest(BaseModel):
    """Top-level decrypted request wrapper from WhatsApp."""
    version: str = "3.0"
    action: str  # "ping" | "data_exchange" | "INIT" | "back"
    screen: Optional[str] = None
    data: dict[str, Any] = Field(default_factory=dict)
    flow_token: Optional[str] = None


# ─── Main Menu Data ──────────────────────────────────────────────────────────

class MainMenuSelectionData(BaseModel):
    """Data submitted when user selects an option on the main menu."""
    selection: str  # "deployment" | "internships" | "courses"


# ─── Lead Gen (Deployment) Data ──────────────────────────────────────────────

class DeploymentFormData(BaseModel):
    """Data submitted from the deployment lead generation form."""
    name: str
    email: str
    phone: str
    company: str


# ─── Internships Data ────────────────────────────────────────────────────────

class InternshipSelectionData(BaseModel):
    """Data submitted when user selects an internship to apply for."""
    internship_id: str


class InternshipApplicationData(BaseModel):
    """Data submitted from the internship application form."""
    internship_id: str
    name: str
    email: str
    phone: str
    resume_url: str  # Users can provide a link to their resume


# ─── Courses Data ────────────────────────────────────────────────────────────

class CourseSelectionData(BaseModel):
    """Data submitted when user selects a course to book."""
    course_id: str


class CourseBookingData(BaseModel):
    """Data submitted from the course booking form."""
    course_id: str
    name: str
    email: str
    phone: str
