import os
import logging
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

load_dotenv()

app = Flask(__name__)
CORS(app)

TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')
SERVER_PORT = os.getenv('SERVER_PORT', 3000)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Логируем переменные окружения для проверки
logger.info(f"TELEGRAM_BOT_TOKEN: {TELEGRAM_BOT_TOKEN}")
logger.info(f"TELEGRAM_CHAT_ID: {TELEGRAM_CHAT_ID}")

def send_to_telegram(data):
    message = (
        "📩 Новая заявка:\n"
        f"👤 Имя: {data['name']}\n"
        f"📧 Email: {data['email']}\n"
        f"📱 Телефон: {data['phone']}"
    )
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        'chat_id': TELEGRAM_CHAT_ID,
        'text': message,
        'parse_mode': 'HTML'
    }
    try:
        logger.info(f"Sending message to Telegram: {message}")
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        logger.info(f"Telegram API response: {response.json()}")
        return True, None
    except Exception as e:
        logger.error(f"Telegram API error: {str(e)}")
        return False, str(e)

@app.route('/submit-form', methods=['POST'])
def handle_form():
    try:
        data = request.get_json()
        required_fields = ['name', 'email', 'phone']
        if not all(field in data for field in required_fields):
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields'
            }), 400
        success, error = send_to_telegram(data)
        if success:
            return jsonify({
                'status': 'success',
                'message': 'Form submitted successfully'
            })
        else:
            return jsonify({
                'status': 'error',
                'message': f'Failed to send message: {error}'
            }), 500
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=SERVER_PORT,
        debug=os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    )