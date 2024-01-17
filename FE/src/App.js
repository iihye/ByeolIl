//Find
import FindID from "./components/login/FindID";
import FindPW from "./components/login/FindPW";
// Modal
import RadioModal from "./components/radio/RadioModal";
import StarDetail from "./components/star/StarDetail";
// Alert
import StarDeleteAlert from "./components/star/StarDeleteAlert";
import StarReportAlert from "./components/star/StarReportAlert";
import BlockAlert from "./components/user/BlockAlert";
import PWCheck from "./components/user/PWCheckAlert";

function App() {
  return (
    <div className="App">
      <FindID />
      <FindPW />
    </div>
  );
}

export default App;
