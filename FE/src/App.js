import Login from './components/login/Login';
import Header from './components/Header';
import { Routes, Route } from 'react-router-dom';
import KakaoLogin from './components/login/KakaoLogin';

function App() {
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<KakaoLogin />}></Route>
                <Route path="/landing/login" element={<Login />}></Route>
            </Routes>
        </div>
    );
}

export default App;
