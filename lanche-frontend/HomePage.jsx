import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import SnackCard from '../components/SnackCard';
import Cart from '../components/Cart';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const HomePage = () => {
  const [snacks, setSnacks] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    fetchSnacks();
  }, []);

  const fetchSnacks = async () => {
    try {
      const response = await fetch('/api/snacks', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setSnacks(data);
      } else {
        setError('Erro ao carregar lanches');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (snackId, quantity) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.snack_id === snackId);
      
      if (quantity === 0) {
        return prevItems.filter(item => item.snack_id !== snackId);
      }
      
      if (existingItem) {
        return prevItems.map(item =>
          item.snack_id === snackId
            ? { ...item, quantity }
            : item
        );
      } else {
        return [...prevItems, { snack_id: snackId, quantity }];
      }
    });
  };

  const handleOrderComplete = (order) => {
    setCartItems([]);
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 5000);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lanches Disponíveis</h1>
          <p className="text-gray-600 mt-2">
            Escolha seus lanches favoritos para entrega amanhã
          </p>
        </div>

        {orderSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              ✅ Pedido criado com sucesso! Agora você pode prosseguir com o pagamento.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Lanches */}
          <div className="lg:col-span-2">
            {snacks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Nenhum lanche disponível no momento</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {snacks.map((snack) => (
                  <SnackCard
                    key={snack.id}
                    snack={snack}
                    onAddToCart={handleAddToCart}
                    cartItems={cartItems}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Carrinho */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Cart
                cartItems={cartItems}
                snacks={snacks}
                onOrderComplete={handleOrderComplete}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

