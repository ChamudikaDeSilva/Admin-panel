import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen,faArrowRight,faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function Deals({ auth }) {

    const [deals, setDeals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [categoriesPerPage] = useState(5);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/product/management/fetch/categories');
            setCategories(response.data.categories);
        } catch (error) {
            console.error('An error occurred while fetching categories:', error);
        }
    };

    // Search function
    const searchCategories = (categories) => {
        return categories.filter(category =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
            //category.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Get current admins
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = searchCategories(categories).slice(indexOfFirstCategory, indexOfLastCategory);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle checkbox selection for multiple deletion
    const handleSelectCategory = (categoryId) => {
        setSelectedCategories((prevSelectedCategories) =>
            prevSelectedCategories.includes(categoryId)
                ? prevSelectedCategories.filter((id) => id !== categoryId)
                : [...prevSelectedCategories, categoryId]
            );
        };

        const handleSelectAllCategories = (e) => {
            if (e.target.checked) {
                const allCategoryIds = currentCategories.map((category) => category.id);
                setSelectedCategories(allCategoryIds);
            } else {
                setSelectedCategories([]);
            }
        };

        const handleDeleteSelectedCategories = async () => {
            setIsPurgeModalOpen(true);
        };

        const confirmDeleteCategories = async () => {
            try {
                await axios.post(route('categories.deleteMultiple'), { category_ids: selectedCategories });
                setSelectedCategories([]);
                fetchCategories();
                setIsPurgeModalOpen(false);
            } catch (error) {
                console.error('An error occurred while deleting categories:', error);
            }
        };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Categories" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg ">
                        <div className="p-12 bg-white border-b border-gray-200">
                        <div className="mb-4">
                            <h1 className="text-2xl font-semibold text-gray-700 mb-4 italic">Categories</h1>
                            <hr className="border-lime-500 mb-4" />
                            <div className="flex flex-col sm:flex-row items-center justify-between">
                                <div className="flex flex-col sm:flex-row items-center">
                                    <button
                                        className="mb-2 sm:mb-0 px-4 py-2 bg-gradient-to-r from-lime-500 to-amber-500 text-white font-semibold rounded-md hover:bg-lime-700 sm:mr-2"
                                        onClick={openModal}
                                    >
                                        New
                                    </button>
                                    <button
                                        className="mb-2 sm:mb-0 px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-700 sm:mr-2"
                                        onClick={handleDeleteSelectedCategories}
                                        disabled={selectedCategories.length === 0}
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
                                    <thead className="bg-amber-100 ">
                                        <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAllCategories}
                                                    checked={selectedCategories.length === currentCategories.length}
                                                />
                                            </th>

                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentCategories.map(category => (
                                            <tr key={category.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCategories.includes(category.id)}
                                                            onChange={() => handleSelectCategory(category.id)}
                                                        />
                                                    </td>

                                                <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <FontAwesomeIcon icon={faFilePen} className="text-amber-600 hover:text-amber-900 cursor-pointer" onClick={() => {
                                                        // Assuming route('admins.edit', { id: admin.id }) will navigate to the edit page
                                                        window.location.href = route('categories.edit', { id: category.id });
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
                                    disabled={currentCategories.length < categoriesPerPage}
                                    className="px-4 py-2 bg-lime-500 text-white font-semibold rounded-md hover:bg-amber-500"
                                >
                                    <FontAwesomeIcon
                                    icon={faArrowRight}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
