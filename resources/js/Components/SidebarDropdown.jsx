import { useState } from 'react';

export default function SidebarDropdown({ title, children }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="mb-2">
            <button
                onClick={toggleDropdown}
                className="block text-left w-full text-gray-700 hover:text-amber-400 focus:outline-none"
            >
                {title}
                <svg
                    className={`w-4 h-4 inline-block ml-2 transition-transform ${
                        isOpen ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {isOpen && (
                <ul className="mt-2 pl-4">
                    {children}
                </ul>
            )}
        </div>
    );
}
