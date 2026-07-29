import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import EmailGate, { isUnlocked } from './components/EmailGate';
import Painel from './pages/Painel';
import Produtos from './pages/Produtos';
import Links from './pages/Links';
import Comissoes from './pages/Comissoes';
import Calendario from './pages/Calendario';

export default function App() {
  const [liberado, setLiberado] = useState(isUnlocked());

  if (!liberado) {
    return <EmailGate onUnlock={() => setLiberado(true)} />;
  }

  return (
    <HashRouter>
      <div className="mx-auto min-h-full max-w-md px-4 pb-24 pt-4">
        <Routes>
          <Route path="/" element={<Painel />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/links" element={<Links />} />
          <Route path="/comissoes" element={<Comissoes />} />
          <Route path="/calendario" element={<Calendario />} />
        </Routes>
      </div>
      <BottomNav />
    </HashRouter>
  );
}
