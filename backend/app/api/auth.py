"""
app/api/auth.py — Authentication API for Shivkara Digital
"""
from fastapi import APIRouter, HTTPException, Depends, Form
from fastapi.responses import JSONResponse
from app.db.firebase import get_db
from app.core.security import verify_password
from app.core.auth import create_access_token, get_current_user, normalize_role, role_cookie_name, COOKIE_NAMES
from typing import Dict, Any
from app.config import get_settings

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _issue_login_response(payload: Dict[str, Any], role: str) -> JSONResponse:
    token = create_access_token(payload)
    cookie_name = role_cookie_name(role)
    response = JSONResponse({"access_token": token, "token_type": "bearer", "role": normalize_role(role)})

    response.set_cookie(
        key=cookie_name,
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=get_settings().access_token_expire_minutes * 60,
        path="/",
    )

    # Clear other session cookies
    for name in COOKIE_NAMES.values():
        if name != cookie_name:
            response.delete_cookie(key=name, path="/")

    return response


def _authenticate(username: str, password: str) -> Dict[str, Any]:
    db = get_db()
    user_doc = db.collection("users").document(username).get()
    if not user_doc.exists:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_data = user_doc.to_dict()
    if not verify_password(password, user_data.get("hashed_password", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user_data


@router.post("/admin/login")
async def admin_login(username: str = Form(...), password: str = Form(...)):
    """Authenticates the Shivkara Digital admin portal."""
    user_data = _authenticate(username, password)
    role = normalize_role(user_data.get("role", "ADMIN"))
    return _issue_login_response(
        {
            "sub": username,
            "role": role,
            "name": user_data.get("name") or username,
            "tenant_id": user_data.get("tenant_id"),
        },
        role,
    )


@router.post("/super-admin/login")
async def super_admin_login(username: str = Form(...), password: str = Form(...)):
    """Alias for admin login — authenticates as SUPER_ADMIN."""
    return await admin_login(username=username, password=password)


@router.get("/me")
async def get_me(current_user: Dict = Depends(get_current_user)):
    """Returns the current authenticated user profile."""
    return current_user


@router.post("/logout")
async def logout():
    """Clears all session cookies."""
    response = JSONResponse({"message": "Logged out successfully"})
    for name in COOKIE_NAMES.values():
        response.delete_cookie(key=name, path="/")
    return response
