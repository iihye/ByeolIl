import MainPage from "./pages/MainPage";
import LandingPage from "./pages/LandingPage"

localStorage.setItem('isLogin', true); // 테스트용

function App() {
  const isLogin = localStorage.getItem('isLogin');

  return (
    <div className="App">
      
      {isLogin ? <MainPage/> : <LandingPage/>}
    </div>
  )
}

export default App;
