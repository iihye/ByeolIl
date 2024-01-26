import MainPage from './pages/MainPage';
import LandingPage from './pages/LandingPage';
import Login from './components/login/Login';

localStorage.setItem('isLogin', true); // 테스트용

function App() {
    const isLogin = localStorage.getItem('isLogin');

    return (
        <div className="App">
            {/* {isLogin ? <MainPage /> : <LandingPage />} */}
            <Login />
        </div>
    );
}
export default App;
