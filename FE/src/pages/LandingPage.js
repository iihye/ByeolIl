// import video from "../video/background1.mp4"
// import video from "../video/background2.mp4"
import video from "../video/background3.mp4"
import { useState } from "react";
import Header from "components/Header"
import { Outlet } from "react-router-dom";
export default function LandingPage() {
    
    return (
        <div>
            <div className="relative flex justify-center items-center">
                <div>
                    <video autoPlay loop muted>
                        <source src={video} type="video/mp4"></source>
                    </video>
                </div>
                <div className='content absolute'>
                    <h1 className="text-white text-5xl">별일</h1>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

  