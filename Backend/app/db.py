from supabase import Client, create_client
from app.core.config import settings

# Supabase client (PostgREST)
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

# Admin client using service_role key to bypass RLS (used for server-only operations)
supabase_admin: Client | None = None
if settings.SUPABASE_SERVICE_ROLE_KEY:
    supabase_admin = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
