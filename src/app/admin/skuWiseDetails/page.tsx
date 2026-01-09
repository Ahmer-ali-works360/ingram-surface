export default function SKUWiseDetailsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">SKU Wise Details</h1>
      <p>Details per SKU.</p>
      <div className="mt-4 space-y-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="p-4 bg-white rounded shadow">
            SKU #{i + 1} details
          </div>
        ))}
      </div>
    </div>
  );
}
