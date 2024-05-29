import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';

export default function Modules({ auth }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', email: '', password: '' });
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
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error('An error occurred:', error);
            }
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Admins" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-12 bg-white border-b border-gray-200">
                            <div className="mb-4 flex items-center justify-between">
                                <button
                                    className="px-4 py-2 bg-lime-500 text-white font-semibold rounded-md hover:bg-amber-500"
                                    onClick={openModal}
                                >
                                    New Admin
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
                                                            <div className="mt-4 sm:mt-6 sm:flex sm:flex-row-reverse">
                                                                <button
                                                                    type="submit"
                                                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-lime-500 text-base font-medium text-white hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                                >
                                                                    Create
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={closeModal}
                                                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:mt-0 sm:w-auto sm:text-sm"
                                                                >
                                                                    Discard
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
