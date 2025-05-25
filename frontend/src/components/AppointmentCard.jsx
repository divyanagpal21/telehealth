

export default function AppointmentCard({ date, time, duration, doctor, specialty, initials, color }) {
  return (
    <div className="bg-white rounded-lg p-4 flex justify-between items-center shadow mb-2">
      <div className="flex items-center gap-4">
        <div className="text-3xl">📹</div>
        <div>
          <p className="text-sm text-gray-600">Video Consultation</p>
          <p className="text-xs text-gray-500">{date} • {time} ({duration})</p>
          <p className="mt-1 font-semibold">{doctor}</p>
          <p className="text-sm text-gray-600">{specialty}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">Join</button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">Chat</button>
      </div>
    </div>
  );
}
