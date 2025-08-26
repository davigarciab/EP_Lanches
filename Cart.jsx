import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingCart, Loader2, CreditCard, Smartphone } from 'lucide-react';
import PaymentModal from './PaymentModal';

const Cart = ({ cartItems, snacks, onOrderComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const total = cartItems.reduce((sum, item) => {
    const snack = snacks.find(s => s.id === item.snack_id);
    return sum + (snack ? snack.price * item.quantity : 0);
  }, 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleCreateOrder = async () => {
    if (cartItems.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items: cartItems
        }),
      });

      if (response.ok) {
        const order = await response.json();
        setCurrentOrder(order);
        setShowPaymentModal(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao criar pedido');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = () => {
    onOrderComplete(currentOrder);
    setCurrentOrder(null);
    setShowPaymentModal(false);
  };

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Seu carrinho está vazio</p>
          <p className="text-sm text-gray-500 mt-2">
            Adicione alguns lanches para fazer seu pedido
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Seu Pedido
          </CardTitle>
          <CardDescription>
            Pedido para entrega amanhã
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            {cartItems.map((item) => {
              const snack = snacks.find(s => s.id === item.snack_id);
              if (!snack) return null;

              return (
                <div key={item.snack_id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{snack.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity}x {formatPrice(snack.price)}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatPrice(snack.price * item.quantity)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⏰ Lembre-se: Pedidos podem ser feitos até às 20h do dia anterior à entrega.
            </p>
          </div>

          <Button 
            onClick={handleCreateOrder} 
            className="w-full" 
            size="lg"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Finalizar Pedido
          </Button>

          <div className="text-center text-sm text-gray-600">
            <p>Após finalizar, você poderá pagar com:</p>
            <div className="flex justify-center items-center space-x-4 mt-2">
              <div className="flex items-center">
                <Smartphone className="h-4 w-4 mr-1" />
                PIX
              </div>
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-1" />
                Cartão de Crédito
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        order={currentOrder}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  );
};

export default Cart;

