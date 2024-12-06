
import { Route, Routes } from 'react-router-dom';
import './App.css'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/superheroes" element={<HeroesCatalogPage />}></Route>
        <Route path="/superheroes/:id" element={<HeroesDetailPage />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </Layout>
  );
}
