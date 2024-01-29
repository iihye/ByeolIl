import React,{useState} from "react";
// import StarFavoList from './star/StarFavorList'
// import FollowList from './user/FollowList'
// import FindUser from './user/FindUser'
// import StarTagSearch from './star/StarTagSearch'
// 환경설정 컴포넌트..? => 라디오 수신범위 설정
// import Alarm from './user/Alarm'     
import {Link} from "react-router-dom"

const items = [
    { name: "회원정보수정", path:"/ChangeInfo"},
    { name: "나의 별 목록 ", path:"/StarList"},
    { name: "좋아하는 별 목록", path:"/StarFavoList"},
    { name: "나의 친구", path:"/FollowList"},
    { name: "다른 우주 찾기", path:"/FindUser"},
    { name: "태그로 별 찾기", path:"/StarTagSearch"},
    // { name: "환경설정", path:"/"},  //path를 모르겠어유
    { name: "알림창", path:"/Alarm"}, // 알림은 메인페이지에 있으면 더 좋을듯
];

function SideBarItem({item}) {
    return (
        <div className="sidebar-item">
          <p>{item.name}</p>
        </div>
      );
}

function SidebarList (props) {
    return (
        <div className="SidebarList">
            <ul>
                <h2>{props.name}님의 우주</h2>
                {/* 닉네임 수정버튼 */}
                {items.map((item, index) => {
                    return (
                        <Link to={item.path} key={index}>
                            <SideBarItem
                                item={item}
                            />
                        </Link>
                    );
                })}
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