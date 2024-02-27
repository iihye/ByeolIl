import React from 'react';
import { Link } from 'react-router-dom';

function ErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-9xl font-bold">404</h1>
            <p className="text-2xl mt-4">페이지가 존재하지 않습니다</p>
            <Link
                to={`/space/${sessionStorage.getItem('memberIndex')}`}
                className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Go Home
            </Link>
        </div>
    );
}

export default ErrorPage;
