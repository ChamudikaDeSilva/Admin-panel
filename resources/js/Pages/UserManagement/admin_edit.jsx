import { usePage, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from "@inertiajs/react";
import React, { useState } from 'react';


export default function EditUser() {
    const { props } = usePage();
    const { user, auth } = props;
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    //console.log('Props received:', props);  // Log received props

    // Check if user or auth is not available
    if (!user || !auth) {
        console.log('User or Auth data is not available');
        return <div>Loading...</div>;
    }

    // Initialize form state with user data
    const { data, setData, put, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleModalClose = () => {
        setShowModal(false);
        window.location.href = '/user/management/admins';
    };

//Updating the user
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prepare the data to send to the backend
        const userData = {
            name: data.name,
            email: data.email
        };

        // Check if password and confirm password fields are empty
        const isPasswordEmpty = !data.password || !data.password.trim();
        const isConfirmPasswordEmpty = !data.confirmPassword || !data.confirmPassword.trim();


        // If both password fields are not empty, add them to the userData object
        if (!isPasswordEmpty && !isConfirmPasswordEmpty) {
            userData.password = data.password;
            userData.password_confirmation = data.confirmPassword;
        }

        try {
            // Send a PUT request to the backend endpoint to update the user
            const response = await axios.put(`/api/user/management/update/admin/${user.id}`, userData);

            // Handle successful response
            //console.log('User updated successfully:', response.data);
            setModalMessage('User updated successfully');
            setShowModal(true);

        } catch (error) {
            // Handle error
            console.error('Error updating user:', error);
        }
    };

return (
<AuthenticatedLayout user={auth}>
    <Head title="Edit User" />
    <div className="py-12">
        <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg ">
                <div className="p-6 bg-white border-b border-gray-200">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight text-center mb-6">Edit User</h2>
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
                        <div className="mt-4 w-full max-w-md">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 focus:border-lime-500 focus:outline-none focus:ring-lime-500 rounded-md shadow-sm"
                            />
                            {errors.email && <div className="text-red-600">{errors.email}</div>}
                        </div>
                        <div className="mt-4 w-full max-w-md">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 focus:border-lime-500 focus:outline-none focus:ring-lime-500 rounded-md shadow-sm"
                            />
                            {errors.password && <div className="text-red-600">{errors.password}</div>}
                        </div>
                        <div className="mt-4 w-full max-w-md">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                value={data.confirmPassword}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 focus:border-lime-500 focus:outline-none focus:ring-lime-500 rounded-md shadow-sm"
                            />
                            {errors.confirmPassword && <div className="text-red-600">{errors.confirmPassword}</div>}
                        </div>
                        <div className="flex justify-center space-x-2 mt-4">
                            <Link href="/user/management/admins" className="px-4 py-2 bg-white-500 hover:bg-gray-200 text-gray-700 text-base rounded-md border border-gray-300 hover:bg-white-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:w-auto sm:text-sm">
                                Cancel
                            </Link>
                            <button type="submit" className="px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:w-auto sm:text-sm">
                                Save
                            </button>
                            <button type="button" className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm">
                                Purge
                            </button>
                            <button type="button" className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:w-auto sm:text-sm">
                                Disable
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
                                        {/* Heroicon name: check */}
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
</AuthenticatedLayout>

);
}