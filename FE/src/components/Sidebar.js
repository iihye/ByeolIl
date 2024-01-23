import React,{useState} from "react";

function SidebarList (props) {
    return (
        <div className="SidebarList">
            <ul>
                <h2>{props.name}님의 우주</h2>
                <li>회원정보수정</li>
                <li>나의 별 목록</li>
                <li>좋아하는 별 목록</li>
                <li>나의 친구</li>
                <li>다른 우주 찾기</li>
                <li>태그로 별 찾기</li>
                <li>환경설정</li>
                <li>알림창</li>
                <button>로그아웃</button>
            </ul>
        </div>
    )
}

export default function Sidebar (props) {
    const [viewSideBar ,setViewSideBar] = useState(false);

    function toggleSidebar () {
        if(viewSideBar === false) setViewSideBar(true); 
        else setViewSideBar(false);
    }
    
    return (
        <div className="Sidebar">
            <button onClick={toggleSidebar}>=</button>
            <div>
                {viewSideBar ? <SidebarList name={props.name}/> : <div/>}
            </div>
        </div>
    )
}