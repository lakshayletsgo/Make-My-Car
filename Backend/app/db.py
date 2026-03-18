from supabase import Client, create_client
from app.core.config import settings

# Supabase client (PostgREST)
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
