import { useRecoilValue } from "recoil";
import {
    isStarRegistOpenState,
    isStarModifyOpenState,
    isStarDetailOpenState,
    isDeleteAlertOpenState,
    isReportAlertOpenState,
    reportModalState,
    isChangeInfoOpenState,
} from "./atom";
import StarRegist from "./star/StarRegist";
import StarDetail from "./star/StarDetail";
import ChangeInfo from "./user/ChangeInfo";

function ModalSpace() {
    return (
        <>
            <StarRegistArea />
            <StarDetailArea />
            <StarModifyArea />
            <ChangeInfoArea />
            {/* <MyStarListArea />
            <FavorListArea />
            <FollowListArea />
            <FindUserArea />
            <TagSearchArea />
            <SettingArea /> */}
        </>
    );
}

function StarRegistArea() {
    const isStarRegistOpen = useRecoilValue(isStarRegistOpenState);

    return (
        <>
            {isStarRegistOpen && (
                <StarRegist type={"regist"} location={isStarRegistOpen[0]} writerIndex={isStarRegistOpen[1]} />
            )}
        </>
    );
}

function StarModifyArea() {
    // [data, starIndex, location. loginUserIndex]
    const isStarModifyOpen = useRecoilValue(isStarModifyOpenState);

    return (
        <>
            {isStarModifyOpen && (
                <StarRegist
                    type={"modify"}
                    preBoard={isStarModifyOpen[0]}
                    boardIndex={isStarModifyOpen[1]}
                    location={isStarModifyOpen[2]}
                    writerIndex={isStarModifyOpen[3]}
                />
            )}
        </>
    );
}

function StarDetailArea() {
    const isStarDetailOpen = useRecoilValue(isStarDetailOpenState);

    return <>{isStarDetailOpen && <StarDetail starIndex={isStarDetailOpen[0]} userIndex={isStarDetailOpen[1]} />}</>;
}

function ChangeInfoArea() {
    const isChangeInfoOpen = useRecoilValue(isChangeInfoOpenState);

    return <>{isChangeInfoOpen && <ChangeInfo />}</>;
}
export default ModalSpace;
