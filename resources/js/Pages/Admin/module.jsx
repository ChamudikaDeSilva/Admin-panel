import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Modules({ auth }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [moduleName, setModuleName] = useState('');
    const [modules, setModules] = useState([]);


    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const response = await axios.get('/api/modules');
            setModules(response.data);
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleModuleNameChange = (e) => setModuleName(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/modules', { name: moduleName });
            setModules([...modules, response.data]);
            setModuleName('');
            closeModal();
        } catch (error) {
            console.error('Error adding module:', error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}>
            <Head title="Modules" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-12 bg-white border-b border-gray-200">
                                <button
                                    onClick={openModal}
                                    className="bg-lime-500 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded">
                                    Add Module
                                </button>

                            <div className="mt-4">
                                <h2 className="text-xl font-semibold">Modules List</h2>
                                <ul>
                                    {modules.map((module) => (
                                        <li key={module.id} className="mt-2">
                                            {module.name}
                                        </li>
                                    ))}
                                </ul>
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
                                        Add Module
                                    </h3>
                                    <div className="mt-2">
                                        <form onSubmit={handleSubmit}>
                                            <div>
                                                <label htmlFor="moduleName" className="block text-sm font-medium text-gray-700">
                                                    Module Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="moduleName"
                                                    name="moduleName"
                                                    value={moduleName}
                                                    onChange={handleModuleNameChange}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    required
                                                />
                                            </div>
                                            <div className="mt-4 sm:mt-6 sm:flex sm:flex-row-reverse">
                                                <button
                                                    type="submit"
                                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-lime-500 text-base font-medium text-white hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                >
                                                    Submit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={closeModal}
                                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
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
        </AuthenticatedLayout>
    );
}
