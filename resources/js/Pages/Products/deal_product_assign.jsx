import React, { useState,useEffect } from 'react';
import { usePage,useForm } from '@inertiajs/react';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';


export default function AssignProducts() {
    const { props } = usePage();
    const { auth,  deal } = props;


    return (
        <AuthenticatedLayout user={auth}>
            <Head title="Edit Deal" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight text-center mb-6 mt-6">Assign Products</h2>

                            <form onSubmit="" className="flex flex-col items-center pb-20" encType="multipart/form-data">
                                <div className="flex justify-center space-x-2 mt-4">

                                    
                                    <Link
                                        href="/product/management/deals"
                                        className="px-4 py-2 bg-white-500 hover:bg-gray-200 text-gray-700 text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:w-auto sm:text-sm"
                                    >
                                        Save
                                    </button>

                                </div>
                            </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
