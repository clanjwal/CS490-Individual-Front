// react imports
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

//file importants
import Home from './Home';
import Films from './Films';
import Customer from './Customer'
import './App.css';

//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/films" element={<Films />} />
        <Route path="/customer" element={<Customer />} />
      </Routes>
    </Router>
  );
}

export default App;