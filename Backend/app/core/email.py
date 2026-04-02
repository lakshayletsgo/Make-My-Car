"""Email service for sending notifications via SMTP."""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails via SMTP."""

    def __init__(
        self,
        smtp_host: str = settings.SMTP_HOST,
        smtp_port: int = settings.SMTP_PORT,
        username: str = settings.SMTP_USERNAME,
        app_password: str = settings.SMTP_APP_PASSWORD,
        from_email: str = settings.SMTP_FROM_EMAIL,
        from_name: str = settings.SMTP_FROM_NAME,
    ):
        """Initialize email service with SMTP credentials."""
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.username = username
        self.app_password = app_password
        self.from_email = from_email
        self.from_name = from_name

    def _is_configured(self) -> bool:
        """Check if SMTP is properly configured."""
        return bool(
            self.smtp_host
            and self.smtp_port
            and self.username
            and self.app_password
            and self.from_email
        )

    def send_email(
        self,
        to_email: str,
        subject: str,
        html_body: str,
        text_body: Optional[str] = None,
    ) -> bool:
        """
        Send an email via SMTP.

        Args:
            to_email: Recipient email address
            subject: Email subject
            html_body: Email body in HTML format
            text_body: Email body in plain text format (optional)

        Returns:
            True if email sent successfully, False otherwise
        """
        if not self._is_configured():
            logger.warning("SMTP not configured. Email not sent to %s", to_email)
            return False

        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{self.from_name} <{self.from_email}>"
            message["To"] = to_email

            # Add plain text version if provided
            if text_body:
                message.attach(MIMEText(text_body, "plain"))

            # Add HTML version
            message.attach(MIMEText(html_body, "html"))

            # Connect to SMTP server and send
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.username, self.app_password)
                server.send_message(message)

            logger.info("Email sent successfully to %s", to_email)
            return True

        except smtplib.SMTPAuthenticationError as e:
            logger.error("SMTP authentication failed: %s", str(e))
            return False
        except smtplib.SMTPException as e:
            logger.error("SMTP error occurred: %s", str(e))
            return False
        except Exception as e:
            logger.error("Unexpected error sending email: %s", str(e))
            return False


def send_vendor_welcome_email(
    vendor_email: str,
    vendor_name: str,
    vendor_id: str,
    temporary_password: str,
    login_url: str = None,
) -> bool:
    """
    Send welcome email to newly created vendor with credentials.

    Args:
        vendor_email: Vendor's email address
        vendor_name: Vendor's name
        vendor_id: Vendor's unique ID
        temporary_password: Temporary password for first login
        login_url: URL to login page (optional)

    Returns:
        True if email sent successfully, False otherwise
    """
    if not login_url:
        login_url = f"{settings.APP_BASE_URL}/auth"

    # Plain text version
    text_body = f"""
Welcome to Make My Car!

Dear {vendor_name},

Your vendor account has been successfully created. Here are your login credentials:

Vendor ID: {vendor_id}
Email: {vendor_email}
Temporary Password: {temporary_password}

Login URL: {login_url}

IMPORTANT: Please change this password immediately upon first login.

If you have any questions or need assistance, please contact our support team.

Best regards,
Make My Car Team
"""

    # HTML version
    html_body = f"""
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }}
        .header {{
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
            margin: -20px -20px 20px -20px;
        }}
        .header h1 {{
            margin: 0;
            color: #2c3e50;
        }}
        .credentials {{
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2c3e50;
        }}
        .credentials p {{
            margin: 10px 0;
        }}
        .label {{
            font-weight: bold;
            color: #2c3e50;
        }}
        .value {{
            font-family: monospace;
            background-color: #fff;
            padding: 5px 10px;
            border-radius: 4px;
            display: inline-block;
            margin-top: 5px;
        }}
        .button {{
            display: inline-block;
            padding: 12px 30px;
            background-color: #2c3e50;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
        }}
        .warning {{
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            color: #856404;
        }}
        .footer {{
            text-align: center;
            color: #999;
            font-size: 12px;
            margin-top: 30px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Make My Car</h1>
        </div>

        <p>Hi <strong>{vendor_name}</strong>,</p>

        <p>Your vendor account has been successfully created. Here are your login credentials:</p>

        <div class="credentials">
            <p>
                <span class="label">Vendor ID:</span><br>
                <span class="value">{vendor_id}</span>
            </p>
            <p>
                <span class="label">Email:</span><br>
                <span class="value">{vendor_email}</span>
            </p>
            <p>
                <span class="label">Temporary Password:</span><br>
                <span class="value">{temporary_password}</span>
            </p>
        </div>

        <div class="warning">
            <strong>⚠️ Important:</strong> This is a temporary password. Please change it immediately upon your first login for security purposes.
        </div>

        <p style="text-align: center;">
            <a href="{login_url}" class="button">Login Now</a>
        </p>

        <p>If you have any questions or need assistance, please contact our support team.</p>

        <div class="footer">
            <p>© 2026 Make My Car. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
"""

    email_service = EmailService()
    return email_service.send_email(
        to_email=vendor_email,
        subject="Welcome to Make My Car - Your Vendor Account Credentials",
        html_body=html_body,
        text_body=text_body,
    )
