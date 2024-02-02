import { useRecoilValue } from "recoil";
import { isStarRegistOpenState, isStarModifyOpenState, isStarDetailOpenState, isDeleteAlertOpenState, isReportAlertOpenState, reportModalState } from "./atom";
import StarRegist from "./star/StarRegist";
import StarDetail from "./star/StarDetail";

function ModalSpace(){
    return(
        <>
            <StarRegistArea/>
            <StarDetailArea/>
        </>
    )
}

export function StarRegistArea(){
    const isStarRegistOpen = useRecoilValue(isStarRegistOpenState);
    const isStarModifyOpen = useRecoilValue(isStarModifyOpenState);
    console.log(isStarRegistOpen, isStarModifyOpen);
    return (
        <>
            {
                isStarRegistOpen && (
                    <StarRegist type={'regist'} location={isStarRegistOpen} />
                )
            }
            {
                isStarModifyOpen && (
                    <StarRegist type={'modify'} preBoard={isStarModifyOpen}/>
                )
            }
        </>
    );
}

export function StarDetailArea(){
    const isStarDetailOpen = useRecoilValue(isStarDetailOpenState);

    return (
        <>
            {isStarDetailOpen && (
                <StarDetail
                    starIndex={isStarDetailOpen[0]}
                    userIndex={isStarDetailOpen[1]}
                />
            )}
        </>
    );

}


export default ModalSpace;
