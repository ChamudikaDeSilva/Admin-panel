import { usePage, Link, useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from "@inertiajs/react";
import React, { useState,useEffect  } from 'react';
import axios from 'axios';
//import { useState } from 'react';

export default function EditUser() {
    const { props } = usePage();
    const { auth, category } = props;
    const [showModal, setShowModal] = useState(false);
    const [purgeModal, setPurgeModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [categoryToDelete, setCategoryToDelete] = useState(null);


    if (!auth) {
        console.log('User or Auth data is not available');
        return <div>Loading...</div>;
    }

    const { data, setData, put, errors } = useForm({
        name: category.name || '',

    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleModalClose = () => {
        setShowModal(false);
        Inertia.visit('/product/management/categories');
    };

    const handlePurgeModalOpen = (categoryId) => {
        setCategoryToDelete(categoryId);
        setPurgeModal(true);
    };

    const handleDeleteCategory = async () => {
        try {
            await axios.delete(`/api/product/management/delete/category/${categoryToDelete}`);
            setModalMessage('The category deleted successfully');
            setShowModal(true);
            setPurgeModal(false);
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const categoryData = {
            name: data.name,
        };

        try {
            const response = await axios.put(`/api/product/management/update/category/${category.id}`, categoryData);
            setModalMessage('The category updated successfully');
            setShowModal(true);
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };


    return (
        <AuthenticatedLayout user={auth}>
            <Head title="Edit Category" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight text-center mb-6">Edit Category</h2>
                            <form onSubmit={handleSubmit} className="flex flex-col items-center pb-20">
                                <div className="mt-4 w-full max-w-md">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 focus:border-lime-500 focus:outline-none focus:ring-lime-500 rounded-md shadow-sm"
                                    />
                                    {errors.name && <div className="text-red-600">{errors.name}</div>}
                                </div>

                                <div className="flex justify-center space-x-2 mt-4">
                                    <Link href="/product/management/categories" className="px-4 py-2 bg-white-500 hover:bg-gray-200 text-gray-700 text-base rounded-md border border-gray-300 hover:bg-white-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:w-auto sm:text-sm">
                                        Cancel
                                    </Link>
                                    <button type="submit" className="px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:w-auto sm:text-sm">
                                        Save
                                    </button>
                                    <button type="button" onClick={() => handlePurgeModalOpen(category.id)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm">
                                        Purge
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>


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

                {/* Purge modal */}
                {purgeModal && (
                    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Are you sure you want to delete this category?
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                This action cannot be undone. Please confirm.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6">
                                <div className="flex flex-col sm:flex-row sm:justify-end">
                                    <button onClick={handleModalClose} type="button" className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 border-transparent shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:ml-3 sm:text-sm">
                                        Cancel
                                    </button>
                                    <button onClick={handleDeleteCategory} type="button" className="w-full sm:w-auto mb-2 sm:mb-0 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:text-sm">
                                        Delete
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
