import React,{useState} from "react";
// import StarFavoList from './star/StarFavorList'
// import FollowList from './user/FollowList'
// import FindUser from './user/FindUser'
// import StarTagSearch from './star/StarTagSearch'
// 환경설정 컴포넌트..?
// import Alarm from './user/Alarm'
import {Link} from "react-router-dom"
const items = [
    { name: "회원정보수정", path:"/ChangeInfo"},
    { name: "별리스트", path:"/StarList"},
    { name: "좋아하는별리스트", path:"/StarFavoList"},
];

function SidebarList (props) {
    return (
        <div className="sidebarList">
                <h2>{props.name}님의 우주</h2>
                {/* 땡땡님의 우주 옆에 연필 아이콘(닉네임 수정 모달창으로 이동) */}
                {items.map((item) => {
                    return (
                        <div className="sidebarItem"> 
                        <Link to={item.path}>
                            <p>{item.name}</p>
                        </Link>
                        </div>
                    );
                })}
                <button>로그아웃</button>
        </div>
    )
}

export default function Sidebar (props) {
    const [viewSideBar ,setViewSideBar] = useState(false);

    return (
        <div className="Sidebar">
            <button onClick={()=>viewSideBar ? setViewSideBar(false) : setViewSideBar(true)}>=</button>
            <div>
                {viewSideBar ? <SidebarList name={props.name}/> : <div/>}
            </div>
        </div>
    )
}