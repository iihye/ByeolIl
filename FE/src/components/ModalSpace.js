import { useRecoilValue } from "recoil";
import { isStarRegistOpenState, isStarModifyOpenState, isStarDetailOpenState, isDeleteAlertOpenState, isReportAlertOpenState, reportModalState } from "./atom";
import StarRegist from "./star/StarRegist";
import StarDetail from "./star/StarDetail";

function ModalSpace() {
  return (
    <>
      <StarRegistArea />
      <StarDetailArea />
      <StarModifyArea />
    </>
  );
}

function StarRegistArea() {
  const isStarRegistOpen = useRecoilValue(isStarRegistOpenState);

  return <>{isStarRegistOpen !== false ? <StarRegist type={"regist"} location={isStarRegistOpen[0]} writerIndex={isStarRegistOpen[1]} /> : null}</>;
}

function StarModifyArea() {
  const isStarModifyOpen = useRecoilValue(isStarModifyOpenState);
  return <>{isStarModifyOpen !== false ? <StarRegist type={"modify"} preBoard={isStarModifyOpen[0]} boardIndex={isStarModifyOpen[1]} location={isStarModifyOpen[2]} writerIndex={isStarModifyOpen[3]} /> : null}</>;
}

function StarDetailArea() {
  const isStarDetailOpen = useRecoilValue(isStarDetailOpenState);

  return <>{isStarDetailOpen !== false ? <StarDetail starIndex={isStarDetailOpen[0]} userIndex={isStarDetailOpen[1]} /> : null}</>;
}

export default ModalSpace;
