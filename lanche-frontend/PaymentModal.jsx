import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Smartphone, CreditCard, Copy, CheckCircle } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, order, onPaymentComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handlePixPayment = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          order_id: order.id,
          payment_method: 'pix'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentData(data);
        
        // Simular confirmação automática após 10 segundos
        setTimeout(() => {
          onPaymentComplete();
          onClose();
        }, 10000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao processar pagamento PIX');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleCardPayment = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          order_id: order.id,
          payment_method: 'credit_card',
          card_data: cardData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentData(data);
        
        if (data.status === 'approved') {
          setTimeout(() => {
            onPaymentComplete();
            onClose();
          }, 2000);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao processar pagamento');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleCardInputChange = (field, value) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const copyPixCode = () => {
    if (paymentData?.qr_code) {
      navigator.clipboard.writeText(paymentData.qr_code);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pagamento do Pedido</DialogTitle>
          <DialogDescription>
            Total: {formatPrice(order?.total_amount || 0)}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {paymentData ? (
          <div className="space-y-4">
            {paymentData.payment_method === 'pix' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smartphone className="h-5 w-5 mr-2" />
                    Pagamento PIX
                  </CardTitle>
                  <CardDescription>
                    Escaneie o QR Code ou copie o código PIX
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-4">
                      <div className="text-6xl">📱</div>
                      <p className="text-sm text-gray-600 mt-2">QR Code PIX</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Código PIX (Copia e Cola)</Label>
                    <div className="flex">
                      <Input
                        value={paymentData.qr_code}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyPixCode}
                        className="ml-2"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="text-blue-800">
                      ⏱️ Aguardando confirmação do pagamento... (simulação: 10s)
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}

            {paymentData.payment_method === 'credit_card' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pagamento Processado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentData.status === 'approved' ? (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="text-green-800">
                        ✅ Pagamento aprovado! Cartão final {paymentData.card_last_four}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <AlertDescription>
                        ❌ {paymentData.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Tabs defaultValue="pix" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pix">
                <Smartphone className="h-4 w-4 mr-2" />
                PIX
              </TabsTrigger>
              <TabsTrigger value="card">
                <CreditCard className="h-4 w-4 mr-2" />
                Cartão
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pix" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pagamento via PIX</CardTitle>
                  <CardDescription>
                    Rápido, seguro e disponível 24h
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handlePixPayment} 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Gerar PIX
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="card" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cartão de Crédito</CardTitle>
                  <CardDescription>
                    Dados seguros e criptografados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número do cartão</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.number}
                      onChange={(e) => handleCardInputChange('number', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Validade</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/AA"
                        value={cardData.expiry}
                        onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nome no cartão</Label>
                    <Input
                      id="cardName"
                      placeholder="Nome como no cartão"
                      value={cardData.name}
                      onChange={(e) => handleCardInputChange('name', e.target.value)}
                    />
                  </div>

                  <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                    <p><strong>Para teste:</strong></p>
                    <p>• Cartão aprovado: 4111 1111 1111 1111</p>
                    <p>• Cartão recusado: 4000 0000 0000 0002</p>
                  </div>
                  
                  <Button 
                    onClick={handleCardPayment} 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Pagar com Cartão
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;

