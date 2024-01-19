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
// Reply
import StarReplyList from "./components/star/StarReplyList";
import StarReplyListItem from "./components/star/StarReplyListItem";

function App() {
  return (
    <div>
      <div>
        <StarReplyList />
      </div>
    </div>
  );
}

export default App;
