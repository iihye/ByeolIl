// Modal
import RadioModal from "./components/radio/RadioModal";
import StarDetail from "./components/star/StarDetail";
import ReportDetail from "./components/admin/ReportDetail";

function App() {
  const reportInfo = {
    reportIndex: 1,
    boardIndex: 1,
    userNickname: "유저닉네임",
    reportContent: "신고 내용",
    reportInputDate: "신고 날짜",
  };

  return (
    <div className="App">
      <RadioModal />
      <StarDetail starIndex={1} />
      <ReportDetail reportInfo={reportInfo} />
    </div>
  );
}

export default App;
