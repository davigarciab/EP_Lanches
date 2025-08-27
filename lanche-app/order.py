from src.models.user import db
from datetime import datetime

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    order_date = db.Column(db.Date, nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relacionamento com User
    user = db.relationship('User', backref=db.backref('orders', lazy=True))

    def __repr__(self):
        return f'<Order {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'order_date': self.order_date.isoformat() if self.order_date else None,
            'total_amount': float(self.total_amount),
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    snack_id = db.Column(db.Integer, db.ForeignKey('snack.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)

    # Relacionamentos
    order = db.relationship('Order', backref=db.backref('items', lazy=True))
    snack = db.relationship('Snack', backref=db.backref('order_items', lazy=True))

    def __repr__(self):
        return f'<OrderItem {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'snack_id': self.snack_id,
            'quantity': self.quantity,
            'price': float(self.price)
        }

