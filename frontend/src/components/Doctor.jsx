

export default function DoctorCard({ name, specialty, initials, color }) {
  return (
    <div className="bg-white rounded-lg p-3 flex justify-between items-center shadow mb-2">
      <div className="flex items-center gap-4">
        <div className={`${color} text-white font-bold w-10 h-10 rounded-full flex items-center justify-center`}>
          {initials}
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-600">{specialty}</p>
        </div>
      </div>
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">Book</button>
    </div>
  );
}
