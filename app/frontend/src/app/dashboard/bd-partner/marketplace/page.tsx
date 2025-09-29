"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/ProductCard';

// Define the Product type
interface Product {
  id: string;
  name: string;
  productType: string;
  shortDescription: string;
  indicativeIncentive: string;
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?publishedOnly=true');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
      <Separator className="mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onApply={applyToProduct} />
        ))}
      </div>
    </div>
  );

  async function applyToProduct(productId: string) {
    try {
      const response = await fetch(`/api/products/${productId}/apply`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to apply to product');
      }
      alert('Successfully applied to product!');
    } catch (err) {
      alert(`Error: ${(err as Error).message}`);
    }
  }
};