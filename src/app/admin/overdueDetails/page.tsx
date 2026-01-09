export default function OverdueDetailsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Overdue Details</h1>
      <p>List of overdue items or tasks.</p>
      <div className="mt-4 space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="p-4 bg-white rounded shadow">
            Overdue item #{i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
