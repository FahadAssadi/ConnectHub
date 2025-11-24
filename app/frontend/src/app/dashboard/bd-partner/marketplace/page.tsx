"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "../../(components)/product-card"; // from mockup
import { ProductModal } from "../../(components)/product-modal"; // from mockup

// Product type
import type { Product } from "@/types/product";
import { getSession } from "@/lib/auth-client";

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/public/products`;
      console.log("Fetching products from:", url);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      <ProductModal
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
        onApply={applyToProduct}
      />
    </div>
  );

  async function applyToProduct(productId: string) {
    try {
      const {data} = await getSession();
      const bdPartnerId = data?.user?.id;

      if (!bdPartnerId) {
        throw new Error("User not authenticated");
      }

      console.log({
        bdPartnerId,
        productId: productId,
      })

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/protected/relationship/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            bdPartnerId,
            productId: productId,
          }),
        }
      );

      const result = await response.json();

      console.log("Apply response:", result);

      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to apply to product");
      }

      alert("Successfully applied to product!");
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "An error occurred"}`);
    }
  }
}
