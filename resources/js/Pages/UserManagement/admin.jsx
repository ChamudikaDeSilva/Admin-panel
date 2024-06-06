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


    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Admins" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-12 bg-white border-b border-gray-200">
                        <div class="mb-4 flex flex-col sm:flex-row items-center justify-between">
                            <button
                                class="mb-2 sm:mb-0 px-4 py-2 bg-lime-500 text-white font-semibold rounded-md hover:bg-amber-500"
                                onClick={openModal}
                            >
                                New Admin
                            </button>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                class="border border-lime-500 focus:border-lime-500 focus:ring-0 rounded-md px-4 py-2 "
                            />
                        </div>


                            {/* Responsive Tailwind CSS table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-amber-100">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentAdmins.map(admin => (
                                            <tr key={admin.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{admin.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <FontAwesomeIcon icon={faFilePen} className="text-amber-600 hover:text-amber-900 cursor-pointer" onClick={() => {
                                                        // Assuming route('admins.edit', { id: admin.id }) will navigate to the edit page
                                                        window.location.href = route('admins.edit', { id: admin.id });
                                                    }} />
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
                                                                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-lime-500 text-base font-medium text-white hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:w-auto sm:text-sm"
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
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
