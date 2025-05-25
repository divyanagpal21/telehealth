export default function Header({ name }) {
  return (
    <header className="mb-6">
      <h1 className="text-3xl font-bold">Hello, {name}</h1>
      <p className="text-gray-600">Welcome to your Telehealth Dashboard</p>
    </header>
  );
}
