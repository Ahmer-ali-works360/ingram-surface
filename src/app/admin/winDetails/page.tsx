export default function WinDetailsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Win Details</h1>
      <p>Details about recent wins.</p>
      <div className="mt-4 space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="p-4 bg-white rounded shadow">
            Win detail #{i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
