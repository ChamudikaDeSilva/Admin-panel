import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function Categories({ auth }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subcategories, setSubCategories] = useState([]);
    const [categories, setCategories] = useState([]); // New state for categories
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [subcategoriesPerPage] = useState(5);
    const [formData, setFormData] = useState({
        name: '',
        category_id: '', // Add category_id to form data
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchSubCategories();
        fetchCategories(); // Fetch categories when component mounts
    }, []);

    const fetchSubCategories = async () => {
        try {
            const response = await axios.get('/api/product/management/fetch/subcategories');
            setSubCategories(response.data.subcategories);
        } catch (error) {
            console.error('An error occurred while fetching subcategories:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/product/management/fetch/categories'); // Adjust the endpoint as needed
            setCategories(response.data.categories);
        } catch (error) {
            console.error('An error occurred while fetching categories:', error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', category_id: '' }); // Reset form data
        setErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(route('subcategories.store'), formData);
            console.log('Form data submitted:', response.data);
            closeModal();
            fetchSubCategories();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error('An error occurred:', error);
            }
        }
    };

    const searchSubCategories = (subcategories) => {
        return subcategories.filter(subcategory =>
            subcategory.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const indexOfLastSubCategory = currentPage * subcategoriesPerPage;
    const indexOfFirstSubCategory = indexOfLastSubCategory - subcategoriesPerPage;
    const currentSubCategories = searchSubCategories(subcategories).slice(indexOfFirstSubCategory, indexOfLastSubCategory);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="SubCategories" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-12 bg-white border-b border-gray-200">
                            <div className="mb-4 flex flex-col sm:flex-row items-center justify-between">
                                <button
                                    className="mb-2 sm:mb-0 px-4 py-2 bg-lime-500 text-white font-semibold rounded-md hover:bg-amber-500"
                                    onClick={openModal}
                                >
                                    Add Sub Category
                                </button>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border border-lime-500 focus:border-lime-500 focus:ring-0 rounded-md px-4 py-2"
                                />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-amber-100">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Category</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentSubCategories.map(subcategory => (
                                            <tr key={subcategory.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{subcategory.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{subcategory.category.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{subcategory.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <FontAwesomeIcon
                                                        icon={faFilePen}
                                                        className="text-amber-600 hover:text-amber-900 cursor-pointer"
                                                        onClick={() => {
                                                            window.location.href = route('subcategories.edit', { id: subcategory.id });
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 mr-2 bg-lime-500 text-white font-semibold rounded-md hover:bg-amber-500"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                </button>
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentSubCategories.length < subcategoriesPerPage}
                                    className="px-4 py-2 bg-lime-500 text-white font-semibold rounded-md hover:bg-amber-500"
                                >
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </button>
                            </div>

                            {isModalOpen && (
                               <div className="fixed z-10 inset-0 overflow-y-auto">
                                <div className="flex items-center justify-center min-h-screen">
                                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                                    <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full mx-4 sm:w-full">
                                        <div className="bg-white px-8 py-4 sm:p-6 sm:pb-4 flex justify-center items-center">
                                            <div className="w-full">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900 text-center" id="modal-title">
                                                    Create A Sub Category
                                                </h3>
                                                <div className="mt-4">
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="mb-4">
                                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                                Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="name"
                                                                name="name"
                                                                value={formData.name}
                                                                onChange={handleInputChange}
                                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                                                required
                                                            />
                                                            {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
                                                        </div>
                                                        <div className="mb-4">
                                                            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                                                                Category
                                                            </label>
                                                            <select
                                                                id="category_id"
                                                                name="category_id"
                                                                value={formData.category_id}
                                                                onChange={handleInputChange}
                                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                                                required
                                                            >
                                                                <option value="">Select a category</option>
                                                                {categories.map(category => (
                                                                    <option key={category.id} value={category.id}>
                                                                        {category.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {errors.category_id && <div className="text-red-600 text-sm">{errors.category_id}</div>}
                                                        </div>
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
