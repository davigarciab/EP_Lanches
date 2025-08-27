import uuid
import base64
from datetime import datetime, timedelta
import json

class PaymentService:
    """
    Serviço de pagamento simulado que imita o comportamento das principais APIs brasileiras
    como Stripe, PagSeguro, Mercado Pago, etc.
    """
    
    def __init__(self):
        self.api_key = "sk_test_simulated_key_123456789"
        self.webhook_secret = "whsec_simulated_webhook_secret"
    
    def create_pix_payment(self, amount, order_id, customer_info):
        """
        Simula a criação de um pagamento PIX
        """
        transaction_id = f"pix_{uuid.uuid4().hex[:16]}"
        
        # Simular QR Code (base64 de uma imagem pequena)
        qr_code_data = f"00020126580014BR.GOV.BCB.PIX0136{transaction_id}520400005303986540{amount:.2f}5802BR5913LANCHE APP6009SAO PAULO62070503***6304ABCD"
        
        # Simular QR Code como imagem base64 (placeholder)
        qr_code_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        
        expires_at = datetime.now() + timedelta(minutes=30)
        
        return {
            'payment_id': transaction_id,
            'status': 'pending',
            'payment_method': 'pix',
            'amount': amount,
            'currency': 'BRL',
            'qr_code': qr_code_data,
            'qr_code_image': qr_code_image,
            'expires_at': expires_at.isoformat(),
            'instructions': 'Escaneie o QR Code com seu aplicativo bancário ou copie e cole o código PIX'
        }
    
    def create_credit_card_payment(self, amount, order_id, customer_info, card_data):
        """
        Simula a criação de um pagamento com cartão de crédito
        """
        transaction_id = f"cc_{uuid.uuid4().hex[:16]}"
        
        # Simular validação do cartão
        card_number = card_data.get('number', '').replace(' ', '')
        
        # Simular aprovação/rejeição baseado no número do cartão
        if card_number.startswith('4111') or card_number.startswith('5555'):
            status = 'approved'
            message = 'Pagamento aprovado'
        elif card_number.startswith('4000'):
            status = 'declined'
            message = 'Cartão recusado'
        else:
            status = 'pending'
            message = 'Processando pagamento'
        
        return {
            'payment_id': transaction_id,
            'status': status,
            'payment_method': 'credit_card',
            'amount': amount,
            'currency': 'BRL',
            'card_last_four': card_number[-4:] if len(card_number) >= 4 else '****',
            'message': message,
            'created_at': datetime.now().isoformat()
        }
    
    def simulate_pix_payment_confirmation(self, payment_id, delay_seconds=10):
        """
        Simula a confirmação de um pagamento PIX após alguns segundos
        """
        import threading
        import time
        
        def confirm_payment():
            time.sleep(delay_seconds)
            # Aqui normalmente seria enviado um webhook para /api/payments/webhook
            webhook_data = {
                'payment_id': payment_id,
                'status': 'approved',
                'transaction_id': payment_id,
                'paid_at': datetime.now().isoformat(),
                'amount': 0,  # Seria o valor real
                'signature': 'simulated_signature'
            }
            return webhook_data
        
        # Iniciar thread para simular o webhook
        thread = threading.Thread(target=confirm_payment)
        thread.daemon = True
        thread.start()
        
        return True
    
    def validate_webhook_signature(self, payload, signature):
        """
        Simula a validação da assinatura do webhook
        """
        # Em uma implementação real, validaria a assinatura HMAC
        return signature == 'simulated_signature'
    
    def get_payment_status(self, payment_id):
        """
        Consulta o status de um pagamento
        """
        # Simular diferentes status baseado no ID
        if 'approved' in payment_id:
            return {
                'payment_id': payment_id,
                'status': 'approved',
                'paid_at': datetime.now().isoformat()
            }
        elif 'declined' in payment_id:
            return {
                'payment_id': payment_id,
                'status': 'declined',
                'declined_at': datetime.now().isoformat()
            }
        else:
            return {
                'payment_id': payment_id,
                'status': 'pending'
            }

# Instância global do serviço
payment_service = PaymentService()

