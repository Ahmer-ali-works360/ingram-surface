export default function Dashboard360Page() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard 360</h1>
      <p>Welcome to the admin Dashboard 360. Here you can see an overview of your business.</p>

      {/* You can add charts, cards, stats here */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-4 rounded shadow">Total Orders: 1200</div>
        <div className="bg-white p-4 rounded shadow">Live Inventory: 560</div>
        <div className="bg-white p-4 rounded shadow">Revenue Today: $8,900</div>
      </div>
    </div>
  );
}
