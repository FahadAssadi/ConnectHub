import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    productType: string;
    shortDescription: string;
    indicativeIncentive: string;
  };
  onApply: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onApply }) => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">{product.name}</h2>
        <Badge>{product.productType}</Badge>
      </CardHeader>
      <CardContent>
        <p>{product.shortDescription}</p>
        <p className="text-sm text-gray-500 mt-2">Incentive: {product.indicativeIncentive}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onApply(product.id)}>Apply</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;