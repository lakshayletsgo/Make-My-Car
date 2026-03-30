# BackendFastAPI

Minimal FastAPI backend scaffold for Make My Car.

Prereqs
- Python 3.11+
- Supabase Postgres instance (or local Postgres)

Quick start

1. Create virtualenv and install deps

```bash
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and set `DATABASE_URL` to your Supabase Postgres URL.

3. Apply the SQL schema in Supabase (use the SQL from the project `prisma/schema.prisma` converted SQL). You can run it in Supabase SQL editor.

4. Run dev server

```bash
python main.py
```

What's next
- Implement APIs: auth, vendors, reviews, cars, favorites using Postgres queries or an ORM.
- Add migrations/seeding workflow (optional). 
