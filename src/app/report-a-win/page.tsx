export default function ReportAWinPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Report a Win
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Submit your winning details using the form below
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Game / Campaign */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Game / Campaign Name
            </label>
            <input
              type="text"
              placeholder="Enter game or campaign name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Winning Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Winning Amount
            </label>
            <input
              type="number"
              placeholder="Enter winning amount"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Briefly describe how you won"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Upload Proof */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Proof (Screenshot)
            </label>
            <input
              type="file"
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="button"
              className="w-full rounded-lg bg-blue-600 py-2.5 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
