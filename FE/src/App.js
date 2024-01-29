import Alarm from './components/user/Alarm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/space/alarm" element={<Alarm />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
