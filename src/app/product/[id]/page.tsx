"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) console.error(error);
      else setProduct(data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Product Image */}
        <div className="lg:w-1/2 w-full flex justify-center items-start relative">
          <div className="w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] relative rounded-xl overflow-hidden shadow cursor-zoom-in"
               onClick={() => setZoomOpen(true)}>
            <Image
              src={product.image_url || "/placeholder.png"}
              alt={product.product_name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="lg:w-1/2 w-full flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">{product.product_name}</h1>
            <p className="text-gray-500">SKU: {product.sku}</p>
            <p className="text-gray-700 leading-relaxed">{product.description || "No description available."}</p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mt-4">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center border rounded">
                <button
                  onClick={decreaseQty}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
                >
                  -
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={increaseQty}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button className="mt-6 w-full bg-yellow-400 text-black py-3 rounded hover:bg-yellow-500 transition font-semibold">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 cursor-zoom-out"
          onClick={() => setZoomOpen(false)}
        >
          <div className="w-[80%] max-w-4xl h-[80%] relative">
            <Image
              src={product.image_url || "/placeholder.png"}
              alt={product.product_name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
