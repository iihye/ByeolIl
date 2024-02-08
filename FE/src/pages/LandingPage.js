// import video from "../video/background1.mp4"
// import video from "../video/background2.mp4"
import video from '../video/background3.mp4';
import { useEffect, useState } from 'react';
import Header from 'components/Header';
import { Outlet, useLocation } from 'react-router-dom';
export default function LandingPage() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    useEffect(() => {
        console.log(location.pathname.split('/').length === 3);
        if (location.pathname.split('/').length > 2) setIsOpen(false);
        else setIsOpen(false);
    }, [location]);

    return (
        <div>
            <div className="relative flex justify-center items-center">
                <div>
                    <video autoPlay loop muted>
                        <source src={video} type="video/mp4"></source>
                    </video>
                </div>
                <div className="content absolute">
                    {isOpen && <h1 className="text-white text-5xl">별일</h1>}
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
