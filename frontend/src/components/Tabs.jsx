export default function Tabs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      <div className="bg-white rounded-lg p-4 shadow">
        <h3 className="text-lg font-semibold mb-4">Past Consultations</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-400 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center">SP</div>
            <div>
              <p className="text-sm">Video Consultation</p>
              <p className="text-xs text-gray-500">May 20, 2025 • 11:15 AM (30 min)</p>
              <p className="font-semibold">Dr. Sophia Patel</p>
              <p className="text-sm text-gray-600">Pediatrics</p>
            </div>
          </div>
          <button className="border px-3 py-1 rounded text-sm hover:bg-gray-100">View Summary</button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow flex items-center justify-center text-center">
        <div>
          <h3 className="text-lg font-semibold">Calendar</h3>
          <p className="text-gray-500">Calendar integration coming soon</p>
        </div>
      </div>
    </div>
  );
}
