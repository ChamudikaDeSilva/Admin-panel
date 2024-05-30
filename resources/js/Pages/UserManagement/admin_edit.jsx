import React from 'react';
import { usePage, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from "@inertiajs/react";

export default function EditUser() {
    const { props } = usePage();
    const { user, auth } = props;

    console.log('Props received:', props);  // Log received props

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

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admins.update', user.id));
    };

    return (
        <AuthenticatedLayout user={auth}>
            <Head title="Edit User" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit User</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mt-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 focus:border-amber-500 focus:outline-none focus:ring-amber-500 rounded-md shadow-sm"
                                    />
                                    {errors.name && <div className="text-red-600">{errors.name}</div>}
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 focus:border-amber-500 focus:outline-none focus:ring-amber-500 rounded-md shadow-sm"
                                    />
                                    {errors.email && <div className="text-red-600">{errors.email}</div>}
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <Link href="/admins" className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-2">
                                        Cancel
                                    </Link>
                                    <button type="submit" className="px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-amber-500">
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
