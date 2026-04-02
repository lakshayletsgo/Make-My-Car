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

2. Copy `.env.example` to `.env` and configure your environment variables:
   - Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` to your Supabase credentials
   - Set `JWT_SECRET` to a secure random string
   - (Optional) Configure SMTP for email notifications (see SMTP Configuration section below)

3. Apply the SQL schema in Supabase (use the SQL from the project `prisma/schema.prisma` converted SQL). You can run it in Supabase SQL editor.

4. Run dev server

```bash
python main.py
```

## SMTP Configuration for Email Notifications

The backend sends email notifications when admin adds new vendors. To enable this feature:

### Using Gmail

1. Enable 2-factor authentication on your Google Account
2. Generate an App Password:
   - Go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer" (or your device type)
   - Google will generate a 16-character password
3. Add to `.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your_email@gmail.com
   SMTP_APP_PASSWORD=your_16_char_app_password
   SMTP_FROM_EMAIL=your_email@gmail.com
   SMTP_FROM_NAME=Make My Car
   ```

### Using Other Email Providers

For other providers (Office 365, SendGrid, etc.), update the SMTP settings accordingly:
- **Office 365**: `SMTP_HOST=smtp.office365.com`, `SMTP_PORT=587`
- **SendGrid**: `SMTP_HOST=smtp.sendgrid.net`, `SMTP_PORT=587`, `SMTP_USERNAME=apikey`

### Email Features

When a vendor account is created via the admin panel:
- A welcome email is automatically sent to the vendor
- Email contains:
  - Vendor ID
  - Email address
  - Temporary password
  - Login link
- Vendors are prompted to change their password on first login

What's next
- Implement APIs: auth, vendors, reviews, cars, favorites using Postgres queries or an ORM.
- Add migrations/seeding workflow (optional).
 
