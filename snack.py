from flask import Blueprint, jsonify, request, session
from src.models.user import User, db
from src.models.snack import Snack

snack_bp = Blueprint('snack', __name__)

def require_admin():
    """Decorator para verificar se o usuário é admin"""
    if 'user_id' not in session:
        return jsonify({'error': 'Usuário não autenticado'}), 401
    
    user = User.query.get(session['user_id'])
    if not user or not user.is_admin:
        return jsonify({'error': 'Acesso negado. Apenas administradores podem acessar.'}), 403
    
    return None

@snack_bp.route('/snacks', methods=['GET'])
def get_snacks():
    """Listar todos os lanches disponíveis"""
    snacks = Snack.query.filter_by(is_available=True).all()
    return jsonify([snack.to_dict() for snack in snacks])

@snack_bp.route('/admin/snacks', methods=['GET'])
def get_all_snacks():
    """Admin: Listar todos os lanches (incluindo indisponíveis)"""
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    snacks = Snack.query.all()
    return jsonify([snack.to_dict() for snack in snacks])

@snack_bp.route('/admin/snacks', methods=['POST'])
def create_snack():
    """Admin: Criar um novo lanche"""
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    data = request.json
    snack = Snack(
        name=data['name'],
        description=data.get('description', ''),
        price=data["price"],
        image_url=data.get("image_url"),
        is_available=data.get("is_available", True))
    
    db.session.add(snack)
    db.session.commit()
    
    return jsonify(snack.to_dict()), 201

@snack_bp.route('/admin/snacks/<int:snack_id>', methods=['PUT'])
def update_snack(snack_id):
    """Admin: Atualizar um lanche existente"""
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    snack = Snack.query.get_or_404(snack_id)
    data = request.json
    
    snack.name = data.get('name', snack.name)
    snack.description = data.get('description', snack.description)
    snack.price = data.get('price', snack.price)
    snack.is_available = data.get('is_available', snack.is_available)
    
    db.session.commit()
    
    return jsonify(snack.to_dict())

@snack_bp.route('/admin/snacks/<int:snack_id>', methods=['DELETE'])
def delete_snack(snack_id):
    """Admin: Remover um lanche"""
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    snack = Snack.query.get_or_404(snack_id)
    db.session.delete(snack)
    db.session.commit()
    
    return '', 204

