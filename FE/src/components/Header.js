import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { FaRegBell } from "react-icons/fa";
import { useSetRecoilState, useResetRecoilState, useRecoilValue } from "recoil";
import { isAlarmOpenState } from "./atom";

function Header() {
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();
    const [memberIndex, setMemberIndex] = useState(
        sessionStorage.getItem("memberIndex")
    );
    const setAlarmOpenState = useSetRecoilState(isAlarmOpenState);

    useEffect(() => {
        setMemberIndex(sessionStorage.getItem("memberIndex"));
    }, [token]);

    return (
        <div className="Header fixed bg-transparent z-10 w-full">
            {token ? (
                <>
                    <nav className="sideContainer flex justify-end">
                        <div className="m-2 mr-1">
                            <FaRegBell
                                className="Sidebar-Alarm "
                                size="28"
                                color="white"
                                onClick={() => {
                                    setAlarmOpenState(true);
                                }}
                            />
                        </div>
                        <Sidebar
                            props={sessionStorage.getItem("memberNickname")}
                        />
                    </nav>
                </>
            ) : null}
        </div>
    );
}

export default Header;
