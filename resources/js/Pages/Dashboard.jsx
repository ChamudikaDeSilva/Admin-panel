import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    const user = auth.user;
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
                                <div className="h-32 rounded-lg bg-gray-200"></div>
                                <div className="h-32 rounded-lg bg-gray-200"></div>
                                <div className="h-32 rounded-lg bg-gray-200"></div>
                                <div className="h-32 rounded-lg bg-gray-200"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


