"""
app/core/auth.py — JWT Authentication for Shivkara Digital
"""
from datetime import datetime, timedelta
from typing import Any, Union, Dict, Optional
from jose import jwt, JWTError
from app.config import get_settings
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

settings = get_settings()
security_scheme = HTTPBearer(auto_error=False)

COOKIE_NAMES = {
    "SUPER_ADMIN": "super_admin_session",
    "ADMIN": "admin_session",
}

ROLE_ALIASES = {
    "admin": "ADMIN",
    "super_admin": "SUPER_ADMIN",
    "superadmin": "SUPER_ADMIN",
    "SUPER_ADMIN": "SUPER_ADMIN",
    "ADMIN": "ADMIN",
}


def normalize_role(role: Optional[str]) -> str:
    return ROLE_ALIASES.get(role or "", (role or "").upper())


def role_cookie_name(role: str) -> str:
    normalized = normalize_role(role)
    return COOKIE_NAMES.get(normalized, "auth_session")


def get_token_claims(data: dict, role: str, **extra: Any) -> dict:
    claims = {**data, **extra}
    normalized_role = normalize_role(role)
    claims["role"] = normalized_role
    claims.setdefault("auth_scope", normalized_role)
    return claims


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    """Generates a JSON Web Token for user authentication."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=getattr(settings, 'access_token_expire_minutes', 43200))

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, getattr(settings, 'secret_key', 'dev-secret'), algorithm=getattr(settings, 'algorithm', 'HS256'))
    return encoded_jwt


def _extract_token_from_request(request: Request) -> Optional[str]:
    auth_header = request.headers.get("authorization")
    if auth_header and auth_header.lower().startswith("bearer "):
        return auth_header.split(" ", 1)[1].strip()
    for cookie_name in COOKIE_NAMES.values():
        token = request.cookies.get(cookie_name)
        if token:
            return token
    return None


def _build_user_from_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    normalized_role = normalize_role(payload.get("role"))
    user = {
        "name": payload.get("name") or payload.get("sub") or "User",
        "sub": payload.get("sub"),
        "role": normalized_role,
        "auth_scope": payload.get("auth_scope", normalized_role),
        "tenant_id": payload.get("tenant_id"),
        "staff_id": payload.get("staff_id"),
    }
    return {k: v for k, v in user.items() if v is not None}


async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
) -> Dict:
    """Decodes and validates the JWT from either a bearer token or portal cookie."""
    if credentials:
        token = credentials.credentials
    else:
        token = _extract_token_from_request(request)

    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")

    try:
        payload = jwt.decode(
            token,
            getattr(settings, "secret_key", "dev-secret"),
            algorithms=[getattr(settings, "algorithm", "HS256")],
        )
        username: str = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
        return _build_user_from_payload(payload)
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from exc


def require_role(*allowed_roles: str):
    normalized_allowed = {normalize_role(role) for role in allowed_roles}

    async def _dependency(user: Dict = Depends(get_current_user)) -> Dict:
        if normalize_role(user.get("role")) not in normalized_allowed:
            raise HTTPException(status_code=403, detail="Not authorized for this portal")
        return user

    return _dependency


def require_admin_auth():
    return require_role("ADMIN", "SUPER_ADMIN")


def require_super_admin_auth():
    return require_role("SUPER_ADMIN")
