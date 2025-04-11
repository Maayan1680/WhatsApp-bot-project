import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import TaskPage from './pages/TaskPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<TaskPage />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/tasks/:date" element={<TaskPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App; 