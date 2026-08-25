import os
import smtplib
import logging
from email.mime.text import MIMEText
from datetime import datetime
from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

logger = logging.getLogger(__name__)

class AlertChannel(str, Enum):
    EMAIL = "EMAIL"
    SMS = "SMS"
    PUSH_NOTIFICATION = "PUSH_NOTIFICATION"

class AlertSeverity(str, Enum):
    INFO = "INFO"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"

class AlertConfig(BaseModel):
    channels: List[AlertChannel] = [AlertChannel.PUSH_NOTIFICATION]
    email_recipients: List[str] = []
    phone_numbers: List[str] = []
    thresholds: Dict[str, float] = {
        "shortfall_risk_warning": 50.0,
        "shortfall_risk_critical": 75.0,
        "production_gap_warning": 500.0,
        "production_gap_critical": 1500.0
    }

# In-memory storage
alert_history = []
push_notifications = []
default_config = AlertConfig()

def get_config() -> AlertConfig:
    return default_config

def update_config(new_config: AlertConfig):
    global default_config
    default_config = new_config
    return default_config

def send_email_alert(subject: str, body: str, recipients: List[str]):
    if not recipients:
        return
    host = os.environ.get("SMTP_HOST")
    port = os.environ.get("SMTP_PORT")
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASS")

    if not all([host, port, user, password]):
        logger.info(f"Email credentials not configured. Simulated sending email to {recipients}: {subject}")
        return

    try:
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = user
        msg['To'] = ", ".join(recipients)
        
        with smtplib.SMTP(host, int(port)) as server:
            server.starttls()
            server.login(user, password)
            server.sendmail(user, recipients, msg.as_string())
        logger.info(f"Successfully sent email alert to {recipients}")
    except Exception as e:
        logger.error(f"Failed to send email alert: {e}")

def send_sms_alert(message: str, phone_numbers: List[str]):
    if not phone_numbers:
        return
    
    account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
    from_number = os.environ.get("TWILIO_FROM_NUMBER")

    if not all([account_sid, auth_token, from_number]):
        logger.info(f"Twilio credentials not configured. Simulated sending SMS to {phone_numbers}: {message}")
        return
        
    try:
        from twilio.rest import Client
        client = Client(account_sid, auth_token)
        for number in phone_numbers:
            client.messages.create(
                body=message,
                from_=from_number,
                to=number
            )
        logger.info(f"Successfully sent SMS alert to {phone_numbers}")
    except Exception as e:
        logger.error(f"Failed to send SMS alert: {e}")

def send_push_notification(title: str, body: str):
    notif = {
        "title": title,
        "body": body,
        "timestamp": datetime.now().isoformat(),
        "id": f"push_{len(push_notifications)}_{datetime.now().timestamp()}"
    }
    push_notifications.append(notif)
    logger.info(f"Stored push notification: {title}")

def evaluate_and_alert(scenario_data: Dict[str, Any]):
    shortfall_risk = scenario_data.get("shortfall_risk", 0)
    expected_gap = scenario_data.get("expected_gap", 0)
    
    thresholds = default_config.thresholds
    
    severity = None
    reason = []
    
    if shortfall_risk >= thresholds.get("shortfall_risk_critical", 75.0) or expected_gap >= thresholds.get("production_gap_critical", 1500.0):
        severity = AlertSeverity.CRITICAL
    elif shortfall_risk >= thresholds.get("shortfall_risk_warning", 50.0) or expected_gap >= thresholds.get("production_gap_warning", 500.0):
        severity = AlertSeverity.WARNING
        
    if shortfall_risk >= thresholds.get("shortfall_risk_warning", 50.0):
        reason.append(f"Shortfall risk ({shortfall_risk}%) exceeds threshold.")
    if expected_gap >= thresholds.get("production_gap_warning", 500.0):
        reason.append(f"Production gap ({expected_gap}) exceeds threshold.")
        
    if not severity:
        return None
        
    title = f"[{severity}] MANGENESIS Alert"
    body = f"Severity: {severity}\nReason: {' '.join(reason)}\nData: {scenario_data}"
    
    # Store history
    alert_record = {
        "id": f"alert_{len(alert_history)}",
        "timestamp": datetime.now().isoformat(),
        "severity": severity,
        "title": title,
        "body": body,
        "scenario_data": scenario_data
    }
    alert_history.append(alert_record)
    
    # Dispatch
    if AlertChannel.EMAIL in default_config.channels:
        send_email_alert(title, body, default_config.email_recipients)
    
    if AlertChannel.SMS in default_config.channels:
        send_sms_alert(f"{title}: {' '.join(reason)}", default_config.phone_numbers)
        
    if AlertChannel.PUSH_NOTIFICATION in default_config.channels:
        send_push_notification(title, body)
        
    return alert_record

def get_alert_history() -> List[Dict]:
    return alert_history

def get_pending_push_notifications() -> List[Dict]:
    global push_notifications
    pending = list(push_notifications)
    push_notifications.clear()
    return pending

def send_test_alert(channel: AlertChannel):
    title = "[TEST] MANGENESIS System Alert"
    body = "This is a test alert to verify the multi-channel alert system is functioning properly."
    
    if channel == AlertChannel.EMAIL:
        send_email_alert(title, body, default_config.email_recipients)
    elif channel == AlertChannel.SMS:
        send_sms_alert(title, default_config.phone_numbers)
    elif channel == AlertChannel.PUSH_NOTIFICATION:
        send_push_notification(title, body)
        
    return {"status": "success", "message": f"Test alert dispatched via {channel}"}
