export default function OrderDetailsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>
      <p>List of orders and their statuses.</p>
      <div className="mt-4 space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="p-4 bg-white rounded shadow">
            Order detail #{i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
