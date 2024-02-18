import React from "react";
import { Outlet } from "react-router-dom";
import UserSpace from "components/user/UserSpace";
import ModalSpace from "components/ModalSpace";

//로그인 했을때 메인페이지로 온다.
export default function MainPage() {
    return (
        <div className="MainPage">
            <div className="mainContainer relative">
                <UserSpace />
                <ModalSpace />
                <Outlet />
            </div>
        </div>
    );
}
