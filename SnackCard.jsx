import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus } from 'lucide-react';

const SnackCard = ({ snack, onAddToCart, cartItems = [] }) => {
  const [quantity, setQuantity] = useState(0);
  
  const currentCartItem = cartItems.find(item => item.snack_id === snack.id);
  const currentQuantity = currentCartItem ? currentCartItem.quantity : 0;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 0) {
      setQuantity(newQuantity);
      onAddToCart(snack.id, newQuantity);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="relative p-0">
        {snack.image_url && (
          <img 
            src={snack.image_url} 
            alt={snack.name} 
            className="w-full h-40 object-cover rounded-t-lg"
          />
        )}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{snack.name}</CardTitle>
              <CardDescription className="mt-2">
                {snack.description}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {formatPrice(snack.price)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(Math.max(0, currentQuantity - 1))}
              disabled={currentQuantity === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">
              {currentQuantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(currentQuantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {currentQuantity > 0 && (
            <div className="text-sm text-gray-600">
              Subtotal: {formatPrice(snack.price * currentQuantity)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SnackCard;

