// Modal
import RadioModal from "./components/radio/RadioModal";
import StarDetail from "./components/star/StarDetail";
import ReportDetail from "./components/admin/ReportDetail";

function App() {
  return (
    <div className="App">
      <RadioModal />
      <StarDetail starIndex={1} />
      <ReportDetail /*reportInfo={}*/ />
    </div>
  );
}

export default App;
