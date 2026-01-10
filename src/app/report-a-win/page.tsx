"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ReportAWinPage() {
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({
    orderNumber: "",
    device: "",
    account: "",
    customerName: "",
    numberOfUnits: "",
    totalRevenue: "",
    oneTimePurchase: "",
    dateOfPurchase: "",
    description: "",
  });

  // Fetch logged-in user email
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.log("Error fetching session:", error);
      } else if (session?.user?.email) {
        setEmail(session.user.email);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { submittedBy: email, ...form });
    alert("Form submitted! Check console for data.");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Report a Win</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Submitted By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Submitted By
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm bg-gray-100 cursor-not-allowed"
            />
          </div>

{/* Order Number & Device (Same Row) */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Order Number */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Ingrammicro Surface Order #
    </label>
    <select
      name="orderNumber"
      value={form.orderNumber}
      onChange={handleChange}
      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select Your Order</option>
      <option value="order1">Order 1</option>
      <option value="order2">Order 2</option>
      <option value="order3">Order 3</option>
    </select>
  </div>

  {/* Device */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Device
    </label>
    <textarea
      name="device"
      value={form.device}
      onChange={handleChange}
      placeholder="Please select device"
      rows={6}
      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
              <input
                type="text"
                name="account"
                value={form.account}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Number of Units */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Units</label>
              <input
                type="number"
                name="numberOfUnits"
                value={form.numberOfUnits}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Total Revenue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Revenue</label>
              <input
                type="text"
                name="totalRevenue"
                value={form.totalRevenue}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* One-Time Purchase */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Is this a one-time purchase or roll-out?
              </label>
              <select
                name="oneTimePurchase"
                value={form.oneTimePurchase}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Option</option>
                <option value="one-time">One-Time</option>
                <option value="roll-out">Roll-Out</option>
              </select>
            </div>

            {/* Date of Purchase */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Purchase</label>
              <input
                type="date"
                name="dateOfPurchase"
                value={form.dateOfPurchase}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How did Ingrammicro Surface help you close this deal?
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-2.5 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
