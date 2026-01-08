// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SignMyShirt from './components/SignMyShirt';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shirt/:shirtId" element={<SignMyShirt />} />
      </Routes>
    </Router>
  );
}

export default App;
