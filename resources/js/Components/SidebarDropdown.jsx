import React, { useState } from 'react';

export default function SidebarDropdown({ title, children }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button
                onClick={toggleDropdown}
                className="w-full flex items-center p-2 text-base font-medium text-lime-300 rounded-md hover:bg-lime-300 hover:text-amber-500 transition duration-150 ease-in-out"
            >
                <span className="ml-2">{title}</span>
                <svg
                    className={`ml-auto transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 14L8 10L16 10L12 14Z"
                        fill="currentColor"
                    />
                </svg>
            </button>
            {isOpen && (
                <ul className="pl-4 mt-2">
                    {children}
                </ul>
            )}
        </div>
    );
}
