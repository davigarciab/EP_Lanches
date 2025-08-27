from src.models.user import db
from datetime import datetime

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    transaction_id = db.Column(db.String(255))
    status = db.Column(db.String(50), default='pending')
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relacionamento com Order
    order = db.relationship('Order', backref=db.backref('payments', lazy=True))

    def __repr__(self):
        return f'<Payment {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'payment_method': self.payment_method,
            'transaction_id': self.transaction_id,
            'status': self.status,
            'amount': float(self.amount),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

