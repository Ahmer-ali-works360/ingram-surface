"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cartItems, totalQuantity } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    sellerName: "",
    sellerEmail: "",
    opportunityName: "",
    units: "",               // ✅ Device Opportunity Size
    budget: 1800,            // 🔒 fixed
    revenue: "",             // ✅ auto calculated
    ingramAccount: "",
    quote: "",
    segment: "",
    manufacturer: "",
    isReseller: "",
    companyName: "",
    contactName: "",
    contactEmail: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    deliveryDate: "",
    notes: ""
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log(error.message);
        return;
      }

      if (data?.user?.email) {
        setForm(prev => ({ ...prev, sellerEmail: data.user.email || "" }));
      }
    };

    fetchUser();
  }, []);

  // ---------------------------
  // Checkout Guard Logic
  // ---------------------------
  useEffect(() => {
    // cart empty
    if (cartItems.length === 0) {
      setModalMessage("Your cart is empty. Please add product(s) first.");
      setIsModalOpen(true);
      return;
    }

    // quantity exceeded
    if (totalQuantity > 3) {
      setModalMessage(
        "Your cart limit exceeded. Please update cart (max 3 total items)."
      );
      setIsModalOpen(true);
      return;
    }
  }, [cartItems, totalQuantity]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // ✅ AUTO CALCULATION LOGIC
    if (name === "units") {
      const units = Number(value) || 0;
      const revenue = units * 1800;

      setForm(prev => ({
        ...prev,
        units: value,
        revenue: revenue.toString()
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  // ---------------------------
  // If modal is open, don't show checkout form
  // ---------------------------
  if (isModalOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" />

        <div className="bg-white rounded-lg p-6 z-60 w-11/12 max-w-md">
          <h2 className="text-lg font-semibold mb-2">Attention</h2>
          <p className="text-gray-700 mb-4">{modalMessage}</p>
          <button
            onClick={() => router.back()}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Team Details */}
        <div className="bg-white border rounded shadow border-gray-300">
          <div className="custom-blue text-white px-4 py-2 font-semibold">Team Details</div>
          <div className="p-4 grid grid-cols-2 gap-4">

            <div>
              <label className="block mb-1 font-medium">Seller Contact Name *</label>
              <input
                name="sellerName"
                value={form.sellerName}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Seller Contact Email *</label>
              <input
                name="sellerEmail"
                value={form.sellerEmail}
                disabled
                className="border border-gray-300 p-2 rounded bg-gray-100 w-full"
              />
            </div>
          </div>
        </div>

        {/* Opportunity Details */}
        <div className="bg-white border rounded shadow border-gray-300">
          <div className="custom-blue text-white px-4 py-2 font-semibold">Opportunity Details</div>
          <div className="p-4 grid grid-cols-2 gap-4">

            <div>
              <label className="block mb-1 font-medium">
                Device Opportunity Size (Units) *
              </label>
              <input
                type="number"
                name="units"
                value={form.units}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Budget Per Device ($)</label>
              <input
                name="budget"
                placeholder="$1800"
                value={form.budget}
                disabled
                className="border border-gray-300 p-2 rounded bg-gray-100 w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Revenue Opportunity Size ($ Device Rev) *
              </label>
              <input
                name="revenue"
                value={form.revenue}
                readOnly
                className="border border-gray-300 p-2 rounded bg-gray-100 w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Ingram Account # *</label>
              <input
                name="ingramAccount"
                value={form.ingramAccount}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Quote #</label>
              <input
                name="quote"
                value={form.quote}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Segment</label>
              <select
                name="segment"
                value={form.segment}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option value="A">Corporate West</option>
                <option value="B">Corporate Central</option>
                <option value="C">Corporate East</option>
                <option value="D">K-12</option>
                <option value="E">Hi-Ed</option>
                <option value="F">Healthcare</option>
                <option value="G">CoreTrust</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Current Manufacturer</label>
              <select
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option value="">Current Manufacturer</option>
                <option value="X">X</option>
                <option value="Y">Y</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Is this a reseller opportunity?
              </label>
              <select
                name="isReseller"
                value={form.isReseller}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option value="">Is this a competitive opportunity? *</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

          </div>
        </div>

        {/* Shipping Details */}
        <div className="bg-white border rounded shadow border-gray-300">
          <div className="custom-blue text-white px-4 py-2 font-semibold">Shipping Details</div>
          <div className="p-4 grid grid-cols-2 gap-4">

            <div>
              <label className="block mb-1 font-medium">Customer Company Name *</label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Customer Company Name *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Customer Contact Name *</label>
              <input
                name="contactName"
                value={form.contactName}
                onChange={handleChange}
                placeholder="Customer Contact Name *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Customer Contact Email *</label>
              <input
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                placeholder="Customer Contact Email Address *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Customer Shipping Address *</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Customer Shipping Address *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">City *</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">State *</label>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              >
                <option value="">State *</option>
                <option value="CA">CA</option>
                <option value="TX">TX</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Zip *</label>
              <input
                name="zip"
                value={form.zip}
                onChange={handleChange}
                placeholder="Zip *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Delivery Date</label>
              <input
                type="date"
                name="deliveryDate"
                value={form.deliveryDate}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div className="col-span-2">
              <label className="block mb-1 font-medium">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Notes"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

          </div>
        </div>

        {/* Order */}
        <div className="bg-white border rounded shadow p-4 border-gray-300">
          <div className="text-lg font-semibold mb-4">Your order</div>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">No products in cart.</p>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border border-gray-200 rounded p-3 bg-gray-50"
                >
                  {/* Image */}
                  <div className="w-14 h-14 relative rounded overflow-hidden bg-white">
                    <img
                      src={item.image_url || "/placeholder.png"}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name + qty */}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.product_name}</div>
                    <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


        <div className="flex justify-center">
          <button className="min-w-xs custom-blue text-white py-4 rounded font-semibold">
            Place order
          </button>
        </div>

      </form>
    </div>
  );
}
