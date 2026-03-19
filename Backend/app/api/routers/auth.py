from fastapi import APIRouter, Depends, HTTPException, status
from app.db import supabase, supabase_admin
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    RegisterResponse,
    VerifyEmailRequest,
    ResendVerificationRequest,
    GenericMessageResponse,
    MeResponse,
)
from app.core.security import (
    decode_email_verification_token,
    get_current_user,
)

router = APIRouter()

@router.post('/auth/register', response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest):
    try:
        # Supabase Auth handles email verification flow natively.
        res = supabase.auth.sign_up({
            "email": payload.email,
            "password": payload.password,
            "options": {
                "data": {
                    "name": payload.name,
                    "phone": payload.phone,
                    "role": "USER",
                }
            },
        })
        
        if not res or not getattr(res, "user", None):
            raise ValueError("no user returned from Supabase Auth")

        user = res.user
        if supabase_admin:
            try:
                # Insert profile record using admin client to bypass RLS.
                # Since the schema requires a password, we provide a dummy value 
                # because the actual password is securely managed by Supabase Auth.
                supabase_admin.table('users').insert({
                    'id': user.id,
                    'email': payload.email,
                    'password': '[SUPABASE_MANAGED]',
                    'name': payload.name,
                    'phone': getattr(payload, 'phone', None) or "",
                    'role': 'USER'
                }).execute()
            except Exception as e:
                # If the insert fails, log it. The auth user is still created.
                print(f"Failed to insert user profile: {e}")

    except Exception as exc:
        detail = str(exc)
        if "already registered" in detail.lower() or "already been registered" in detail.lower():
            raise HTTPException(status_code=400, detail="User with this email already exists")
        raise HTTPException(status_code=500, detail=f"Signup failed: {detail}")

    if not res or not getattr(res, "user", None):
        raise HTTPException(status_code=500, detail="Signup failed: no user returned from Supabase")

    return {
        'message': 'Signup successful. Please verify your email from your inbox before logging in.',
        'email_verification_required': True,
        'dev_verification_token': None,
    }


@router.post('/auth/login', response_model=TokenResponse)
async def login(payload: LoginRequest):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": payload.email,
            "password": payload.password,
        })
    except Exception as exc:
        detail = str(exc)
        if "email not confirmed" in detail.lower() or "email not verified" in detail.lower():
            raise HTTPException(status_code=403, detail="Email is not verified. Please verify before logging in.")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    session = getattr(res, "session", None)
    if not session or not getattr(session, "access_token", None):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return TokenResponse(access_token=session.access_token)


@router.post('/auth/verify-email', response_model=GenericMessageResponse)
async def verify_email(payload: VerifyEmailRequest):
    # Preferred: Supabase native verification token.
    try:
        supabase.auth.verify_otp({
            "token": payload.token,
            "type": "email",
        })
        return {'message': 'Email verified successfully. You can now log in.'}
    except Exception:
        pass

    # Backward compatibility: legacy local JWT verification token.
    token_payload = decode_email_verification_token(payload.token)
    user_id = token_payload['sub']
    email = token_payload['email']

    updated = supabase.table("users").update({"is_verified": True}).eq("id", user_id).eq("email", email).execute().data or []
    if not updated:
        raise HTTPException(status_code=404, detail='User not found for verification token')

    return {'message': 'Email verified successfully. You can now log in.'}


@router.post('/auth/resend-verification', response_model=GenericMessageResponse)
async def resend_verification(payload: ResendVerificationRequest):
    try:
        supabase.auth.resend({
            "type": "signup",
            "email": payload.email,
        })
    except Exception:
        # Do not leak existence/details
        pass

    return {'message': 'If the email exists, a verification link has been sent.'}


@router.get('/auth/me', response_model=MeResponse)
async def get_me(current_user=Depends(get_current_user)):
    vendor_id = None
    if current_user.get("role") == "VENDOR":
        email = current_user.get("email")
        if email:
            vendor_rows = supabase.table("vendors").select("id").eq("email", email).limit(1).execute().data or []
            if vendor_rows:
                vendor_id = vendor_rows[0]["id"]

    return {
        "user": {
            "id": current_user["id"],
            "email": current_user["email"],
            "name": current_user["name"],
            "role": current_user["role"],
            "is_verified": bool(current_user.get("is_verified", False)),
        },
        "vendor_id": vendor_id,
    }
