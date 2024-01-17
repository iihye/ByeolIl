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
  console.log("APP RENDERED");
  const REST_API_KEY = "51d0ffff4a682ea6be213544986554b9";
  const REDIRECT_URI = "http://localhost:3000/";
  const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const loginHandler = () => {
    window.location.href = link;
  };

  return (
    <div className="App">
      <RadioModal />
      <br />
      <StarDetail starIndex={1} />
    </div>
  );
}

export default App;
