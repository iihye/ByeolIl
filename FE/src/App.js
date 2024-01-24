import MainPage from "./pages/MainPage";
import { RecoilRoot } from "recoil";

function App() {
  return <div className="App">
    <RecoilRoot>
      <MainPage/>
    </RecoilRoot>
  </div>;
}

export default App;
