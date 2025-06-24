import React from 'react';

const Error = ({ message = "Something went wrong." }) => (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100">
        <h1 className="text-3xl font-bold text-red-800">Error</h1>
        <p className="mt-2 text-red-800">{message}</p>
    </div>
);

export default Error;
