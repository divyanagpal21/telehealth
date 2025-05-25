import { Routes, Route } from 'react-router-dom';
import PaymentPage from './pages/PaymentPage';

function App() {
  return (
    <Routes>
      <Route path="/payment" element={<PaymentPage />} />
    </Routes>
  );
}

export default App;
