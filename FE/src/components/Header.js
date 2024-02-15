import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { FaRegBell } from "react-icons/fa";

function Header() {
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();
    const [memberIndex, setMemberIndex] = useState(
        sessionStorage.getItem("memberIndex")
    );

    useEffect(() => {
        setMemberIndex(sessionStorage.getItem("memberIndex"));
    }, [token]);

    return (
        <div className="Header fixed bg-transparent z-10 w-full">
            {token ? (
                <>
                    <nav className="sideContainer flex justify-end">
                        <div className="m-2 mr-1">
                            <Link to={`/space/${memberIndex}/alarm`}>
                                {/* <button>알림창</button> */}
                                <FaRegBell
                                    className="Sidebar-Alarm "
                                    size="28"
                                    color="white"
                                />
                            </Link>
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
