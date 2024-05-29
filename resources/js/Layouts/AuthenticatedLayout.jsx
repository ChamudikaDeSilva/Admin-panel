import { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import SidebarDropdown from '@/Components/SidebarDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCircleInfo, faGear, faAddressBook, faLock, faBars, faLockOpen, faUserLock } from '@fortawesome/free-solid-svg-icons';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);



    useEffect(() => {
        const handleClickOutside = (event) => {
            const sidebar = document.getElementById('sidebar');
            const openSidebarButton = document.getElementById('open-sidebar');
            if (sidebar && !sidebar.contains(event.target) && !openSidebarButton.contains(event.target)) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex overflow-hidden bg-gray-00">
            {/* Sidebar */}
                <div id="sidebar"className={`absolute bg-lime-200 text-white w-56 min-h-screen overflow-y-auto transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } ease-in-out duration-300 shadow-lg`}
            >
            <div className="p-4">
                <div className="flex items-center justify-center mb-2">
                    <img src="/images/logo1.jpg" alt="Logo" className="h-20 w-auto mb-2" />
                </div>
                <h1 className="text-2xl font-bold text-amber-500 mb-6">Pamona's Haven</h1>
                <ul className="space-y-4">
                    <li>
                        <Link
                            href={route('dashboard')}
                            className="flex items-center p-2 text-base font-medium text-green-700 rounded-md hover:bg-lime-300 hover:text-amber-500 transition duration-150 ease-in-out"
                        >
                            <FontAwesomeIcon icon={faHouse} className="mr-2" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="flex items-center p-2 text-base font-medium text-green-700 rounded-md hover:bg-lime-300 hover:text-amber-500 transition duration-150 ease-in-out"
                        >
                            <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
                            <span>About</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="flex items-center p-2 text-base font-medium text-green-700 rounded-md hover:bg-lime-300 hover:text-amber-500 transition duration-150 ease-in-out"
                        >
                            <FontAwesomeIcon icon={faGear} className="mr-2" />
                            <span>Services</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="flex items-center p-2 text-base font-medium text-green-700 rounded-md hover:bg-lime-300 hover:text-amber-500 transition duration-150 ease-in-out"
                        >
                            <FontAwesomeIcon icon={faAddressBook} className="mr-2" />
                            <span>Contact</span>
                        </a>
                    </li>
                    <SidebarDropdown title={<><FontAwesomeIcon icon={faLock} className="mr-2" /> Security</>} >
                        <li>
                            <Link
                                href={route('modules')}
                                className="flex items-center p-2 text-base font-medium text-green-700 rounded-md hover:bg-lime-300 hover:text-amber-500 transition duration-150 ease-in-out"
                            >
                                -Modules
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={route('permissions')}
                                className="flex items-center p-2 text-base font-medium text-green-700 rounded-md hover:bg-lime-300 hover:text-amber-500 transition duration-150 ease-in-out"
                            >
                                -Permissions
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={route('modules_permissions')}
                                className="flex items-center p-2 text-base font-medium text-green-700 rounded-md hover:bg-lime-300 hover:text-amber-500 transition duration-150 ease-in-out"
                            >
                                -Module Permissions
                            </Link>
                        </li>
                    </SidebarDropdown>
                    <SidebarDropdown title={<><FontAwesomeIcon icon={faLock} className="mr-2" /> Users</>} >
                        <li>
                            <Link
                                href={route('admin_management')}
                                className="flex items-center p-2 text-base font-medium text-green-700 rounded-md hover:bg-lime-300 hover:text-amber-500 transition duration-150 ease-in-out"
                            >
                                -Admins
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={route('permissions')}
                                className="flex items-center p-2 text-base font-medium text-green-700 rounded-md hover:bg-lime-300 hover:text-amber-500 transition duration-150 ease-in-out"
                            >
                                -Roots
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={route('modules_permissions')}
                                className="flex items-center p-2 text-base font-medium text-green-700 rounded-md hover:bg-lime-300 hover:text-amber-500 transition duration-150 ease-in-out"
                            >
                                -Customers
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={route('modules_permissions')}
                                className="flex items-center p-2 text-base font-medium text-green-700 rounded-md hover:bg-lime-300 hover:text-amber-500 transition duration-150 ease-in-out"
                            >
                                -Suppliers
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={route('modules_permissions')}
                                className="flex items-center p-2 text-base font-medium text-green-700 rounded-md hover:bg-lime-300 hover:text-amber-500 transition duration-150 ease-in-out"
                            >
                                -Delivery
                            </Link>
                        </li>
                    </SidebarDropdown>
                </ul>
            </div>
        </div>


                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Navbar */}
                    <nav className="bg-lime-200 shadow">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                <div className="flex items-left">
                                    {/* Sidebar Toggle Button */}
                                    <button
                                        className="text-gray-500 hover:text-gray-600 mr-4"
                                        id="open-sidebar"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSidebarOpen(!sidebarOpen);
                                        }}
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 6h16M4 12h16M4 18h16"
                                            ></path>
                                        </svg>
                                    </button>

                                    {/* Application Logo
                                    <Link href="/" className="flex items-center">
                                        <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                    </Link>*/}
                                </div>

                                <div className="hidden sm:flex sm:items-center sm:ms-6">
                                    <div className="ms-3 relative bg-lime-200">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                    >
                                                        {user.name}
                                                        <svg
                                                            className="ms-2 -me-0.5 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                                    Log Out
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>

                                <div className="-me-2 flex items-center sm:hidden">
                                    <button
                                        onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                                    >
                                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                            <path
                                                className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                            <path
                                                className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                            <div className="pt-4 pb-1 border-t border-gray-200">
                                <div className="px-4">
                                    <div className="font-medium text-base text-gray-800">{user.name}</div>
                                    <div className="font-medium text-sm text-gray-500">{user.email}</div>
                                </div>

                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                                    <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                        Log Out
                                    </ResponsiveNavLink>
                                </div>
                            </div>
                        </div>
                    </nav>

                    <main className="flex-1 overflow-auto p-4">
                        {children}
                    </main>

                </div>
            </div>
        </div>
    );
}
