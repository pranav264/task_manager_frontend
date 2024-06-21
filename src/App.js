import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Authentication from './Pages/Authentication';
import Projects from './Pages/Projects';
import Project from './Pages/Project';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Authentication />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/project' element={<Project />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
