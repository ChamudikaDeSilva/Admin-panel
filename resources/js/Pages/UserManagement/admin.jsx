import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen,faArrowRight,faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function Modules({ auth }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [adminsPerPage] = useState(5);
    const [selectedAdmins, setSelectedAdmins] = useState([]);
    const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await axios.get('/api/user/management/fetch/admins');
            setAdmins(response.data.admins);
        } catch (error) {
            console.error('An error occurred while fetching admins:', error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', email: '', password: '',password_confirmation: '' });
        setErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(route('admins.store'), formData);
            console.log('Form data submitted:', response.data);
            closeModal();
            fetchAdmins();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error('An error occurred:', error);
            }
        }
    };

    // Search function
    const searchAdmins = (admins) => {
        return admins.filter(admin =>
            admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Get current admins
    const indexOfLastAdmin = currentPage * adminsPerPage;
    const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
    const currentAdmins = searchAdmins(admins).slice(indexOfFirstAdmin, indexOfLastAdmin);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle checkbox selection for multiple deletion
    const handleSelectAdmin = (adminId) => {
        setSelectedAdmins((prevSelectedAdmins) =>
            prevSelectedAdmins.includes(adminId)
                ? prevSelectedAdmins.filter((id) => id !== adminId)
                : [...prevSelectedAdmins, adminId]
            );
        };

        const handleSelectAllAdmins = (e) => {
            if (e.target.checked) {
                const allAdminIds = currentAdmins.map((admin) => admin.id);
                setSelectedAdmins(allAdminIds);
            } else {
                setSelectedAdmins([]);
            }
        };

        const handleDeleteSelectedAdmins = async () => {
            setIsPurgeModalOpen(true);
        };

        const confirmDeleteAdmins = async () => {
            try {
                await axios.post(route('admins.deleteMultiple'), { admin_ids: selectedAdmins });

                setSelectedAdmins([]);
                fetchAdmins();
                setIsPurgeModalOpen(false);
            } catch (error) {
                console.error('An error occurred while deleting admins:', error);
            }
        };

        const handleModalClose = () => {
            setShowModal(false);
        };


    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Admins" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-12 bg-white border-b border-gray-200">
                        <div className="mb-4">
                            <h1 className="text-2xl font-semibold text-gray-700 mb-4 italic">Admins</h1>
                            <hr className="border-lime-500 mb-4" />
                            <div className="flex flex-col sm:flex-row items-center justify-between">
                                <div className="flex flex-col sm:flex-row items-center">
                                    <button
                                        className="mb-2 sm:mb-0 px-4 py-2 bg-lime-500 text-white font-semibold rounded hover:bg-lime-700 sm:mr-2"
                                        onClick={openModal}
                                    >
                                        New
                                    </button>
                                    <button
                                        className="mb-2 sm:mb-0 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-700 sm:mr-2"
                                        onClick={handleDeleteSelectedAdmins}
                                        disabled={selectedAdmins.length === 0}
                                    >
                                        Delete Selected
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border border-lime-500 focus:border-lime-500 focus:ring-0 rounded-md mb-2 sm:mb-0 px-4 py-2"
                                />
                            </div>
                        </div>


                            {/* Responsive Tailwind CSS table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-amber-100">
                                        <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAllAdmins}
                                                    checked={selectedAdmins.length === currentAdmins.length}
                                                />
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is Active</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentAdmins.map(admin => (
                                            <tr key={admin.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedAdmins.includes(admin.id)}
                                                            onChange={() => handleSelectAdmin(admin.id)}
                                                        />
                                                    </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{admin.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={admin.is_disabled ? "text-red-500" : "text-blue-500"}>
                                                        {admin.is_disabled ? "Disabled" : "Active"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <FontAwesomeIcon
                                                        icon={faFilePen}
                                                        className="text-amber-600 hover:text-amber-900 cursor-pointer"
                                                        onClick={() => {
                                                            // Assuming route('admins.edit', { id: admin.id }) will navigate to the edit page
                                                            window.location.href = route('admins.edit', { id: admin.id });
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 mr-2 bg-lime-500 text-white font-semibold rounded-md hover:bg-amber-500"
                                >
                                    <FontAwesomeIcon
                                    icon={faArrowLeft}/>
                                </button>
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentAdmins.length < adminsPerPage}
                                    className="px-4 py-2 bg-lime-500 text-white font-semibold rounded-md hover:bg-amber-500"
                                >
                                    <FontAwesomeIcon
                                    icon={faArrowRight}/>
                                </button>
                            </div>

                            {/* Modal */}
                            {isModalOpen && (
                                <div className="fixed z-10 inset-0 overflow-y-auto">
                                    <div className="flex items-center justify-center min-h-screen">
                                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                                        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full mx-4 sm:w-full">
                                            <div className="bg-white px-8 py-4 sm:p-6 sm:pb-4 flex justify-center items-center">
                                                <div className="w-full">
                                                    <h3 className="text-lg leading-6 font-medium text-gray-900 text-center" id="modal-title">
                                                        Create New Admin
                                                    </h3>
                                                    <div className="mt-4">
                                                        <form onSubmit={handleSubmit}>
                                                            <div className="flex items-center mb-4">
                                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mr-4 w-24">
                                                                    Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="name"
                                                                    name="name"
                                                                    value={formData.name}
                                                                    onChange={handleInputChange}
                                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                                                    style={{ maxWidth: '20rem' }}
                                                                    required
                                                                />
                                                            </div>
                                                            {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
                                                            <div className="flex items-center mb-4">
                                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mr-4 w-24">
                                                                    Email Address
                                                                </label>
                                                                <input
                                                                    type="email"
                                                                    id="email"
                                                                    name="email"
                                                                    value={formData.email}
                                                                    onChange={handleInputChange}
                                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                                                    style={{ maxWidth: '20rem' }}
                                                                    required
                                                                />
                                                            </div>
                                                            {errors.email && <div className="text-red-600 text-sm">{errors.email}</div>}
                                                            <div className="flex items-center mb-4">
                                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mr-4 w-24">
                                                                    Password
                                                                </label>
                                                                <input
                                                                    type="password"
                                                                    id="password"
                                                                    name="password"
                                                                    value={formData.password}
                                                                    onChange={handleInputChange}
                                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                                                    style={{ maxWidth: '20rem' }}
                                                                    required
                                                                />
                                                            </div>
                                                            {errors.password && <div className="text-red-600 text-sm">{errors.password}</div>}
                                                            <div className="flex items-center mb-4">
                                                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mr-4 w-24">
                                                                    Confirm Password
                                                                </label>
                                                                <input
                                                                    type="password"
                                                                    id="password_confirmation"
                                                                    name="password_confirmation"
                                                                    value={formData.password_confirmation}
                                                                    onChange={handleInputChange}
                                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                                                    style={{ maxWidth: '20rem' }}
                                                                    required
                                                                />
                                                            </div>
                                                            {errors.password_confirmation && <div className="text-red-600 text-sm">{errors.password_confirmation}</div>}
                                                            <div className="mt-4 sm:mt-6 flex justify-end space-x-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={closeModal}
                                                                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:w-auto sm:text-sm"
                                                                >
                                                                    Discard
                                                                </button>
                                                                <button
                                                                    type="submit"
                                                                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-lime-500 text-base font-medium text-white hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:w-auto sm:text-sm"
                                                                >
                                                                    Create
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Purge Modal */}
                            {isPurgeModalOpen && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg">
                                        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                                        <p>Are you sure you want to delete the selected admins?</p>
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                className="mr-2 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                                                onClick={() => setIsPurgeModalOpen(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                                                onClick={confirmDeleteAdmins}
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {showModal && (
                                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                <div className="sm:flex sm:items-start">
                                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                                        <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                            Success
                                                        </h3>
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-500">
                                                                {modalMessage}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                                <button onClick={handleModalClose} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-lime-600 text-base font-medium text-white hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:ml-3 sm:w-auto sm:text-sm">
                                                    OK
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
