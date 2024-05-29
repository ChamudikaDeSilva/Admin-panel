import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Modules({ auth,permissions: initialPermissions }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [permissionName, setPermissionName] = useState('');
    const [permissions, setPermissions] = useState([initialPermissions]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState(null);


    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            const response = await axios.get('/api/permissions/get');
            setPermissions(response.data.permissions);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handlePermissionNameChange = (e) => setPermissionName(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/permissions/create', { name: permissionName });
            setPermissions([...permissions, response.data]);
            setPermissionName('');
            closeModal();
        } catch (error) {
            console.error('Error adding module:', error);
        }
    };

    const handleDeleteClick = (permission) => {
        setSelectedPermission(permission);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`/api/permissions/delete/${selectedPermission.id}`);
            setPermissions(permissions.filter((permission) => permission.id !== selectedPermission.id));
            setIsDeleteModalOpen(false);
            setSelectedPermission(null);
        } catch (error) {
            console.error('Error deleting module:', error);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setSelectedPermission(null);
    };


    return (
        <AuthenticatedLayout
            user={auth.user}>
            <Head title="Permissions" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-12 bg-white border-b border-gray-200">
                                <button
                                    onClick={openModal}
                                    className="bg-lime-500 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded">
                                    Add Permission
                                </button>

                                <div className="mt-8">
                                <h2 className="text-xl font-semibold mb-4">Permission List</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Permission Name
                                                </th>
                                                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {permissions.map((permission) => (
                                                <tr key={permission.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {permission.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                            onClick={() => handleDeleteClick(permission)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                            <div className="bg-white px-2 py-4 sm:p-6 sm:pb-4 flex justify-center items-center">
                                <div className="text-center">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        Add Permission
                                    </h3>
                                    <div className="mt-2">
                                        <form onSubmit={handleSubmit}>
                                            <div>
                                                <label htmlFor="permissionName" className="block text-sm font-medium text-gray-700">
                                                    Permission Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="permissionName"
                                                    name="permissionName"
                                                    value={permissionName}
                                                    onChange={handlePermissionNameChange}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                                    required
                                                />
                                            </div>
                                            <div className="mt-4 sm:mt-6 sm:flex sm:flex-row-reverse">
                                                <button
                                                    type="submit"
                                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-lime-500 text-base font-medium text-white hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                                                    Submit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={closeModal}
                                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm">
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

                {isDeleteModalOpen && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                                <div className="bg-white px-2 py-4 sm:p-6 sm:pb-4 flex justify-center items-center">
                                    <div className="text-center">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Confirm Deletion
                                        </h3>
                                        <div className="mt-2">
                                            <p>Are you sure you want to delete this Permission?</p>
                                            <div className="mt-4 sm:mt-6 sm:flex sm:justify-center">
                                                <button
                                                    onClick={handleDeleteConfirm}
                                                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm mr-3">
                                                    Confirm
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleDeleteCancel}
                                                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm">
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
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
