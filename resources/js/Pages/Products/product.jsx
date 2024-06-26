import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function Products({ auth }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [subcategories, setSubCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: '',
        price: '',
        isAvailable: false,
        image: null,
        category_id: '',
        subcategory_id: '', // New state for subcategory selection
    });
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null); // State to preview selected image

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/product/management/fetch/products');
            setProducts(response.data.products);
            setSubCategories(response.data.subcategories);
            setCategories(response.data.categories);
            //console.log(response.data);


        } catch (error) {
            console.error('An error occurred while fetching products:', error);
        }
    };


    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({
            name: '',
            description: '',
            quantity: '',
            price: '',
            isAvailable: false,
            image: null,
            category_id: '',
            subcategory_id: '',
        });
        setErrors({});
        setImagePreview(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('quantity', formData.quantity);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('isAvailable', formData.isAvailable ? 1 : 0);
        formDataToSend.append('category_id', formData.category_id);
        if (formData.subcategory_id) {
            formDataToSend.append('subcategory_id', formData.subcategory_id);
        }
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        try {
            const response = await axios.post(route('products.store'), formDataToSend);
            console.log('Form data submitted:', response.data);
            closeModal();
            fetchProducts();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error('An error occurred:', error);
            }
        }
    };

    // Search function
    const searchProducts = (products) => {
        return products.filter(
            (product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = searchProducts(products).slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Products" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg ">
                        <div className="p-12 bg-white border-b border-gray-200">
                            <div className="mb-4 flex flex-col sm:flex-row items-center justify-between">
                                <button
                                    className="mb-2 sm:mb-0 px-4 py-2 bg-lime-500 text-white font-semibold rounded-md hover:bg-amber-500"
                                    onClick={openModal}
                                >
                                    Add Product
                                </button>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border border-lime-500 focus:border-lime-500 focus:ring-0 rounded-md px-4 py-2 "
                                />
                            </div>
                            {/* Responsive Tailwind CSS table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-amber-100">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Sub Category
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Slug
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Availability
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Image
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentProducts.length > 0 ? (
                                            currentProducts.map(product => (
                                                <tr key={product.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">{product.category ? product.category.name : 'No Category'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{product.sub_category ? product.sub_category.name : 'No Subcategory'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{product.slug}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{product.description}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{product.price}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{product.isAvailable ? 'Yes' : 'No'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{product.image}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <FontAwesomeIcon
                                                            icon={faFilePen}
                                                            className="text-amber-600 hover:text-amber-900 cursor-pointer"
                                                            onClick={() => {
                                                                window.location.href = route('products.edit', { id: product.id });
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No products found.
                                                </td>
                                            </tr>
                                        )}
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
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                </button>
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentProducts.length < productsPerPage}
                                    className="px-4 py-2 bg-lime-500 text-white font-semibold rounded-md hover:bg-amber-500"
                                >
                                    <FontAwesomeIcon icon={faArrowRight} />
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
                                                        Create A Product
                                                    </h3>
                                                    <div className="mt-4">
                                                        <form onSubmit={handleSubmit}>
                                                            <div className="mb-4">
                                                                <label
                                                                    htmlFor="name"
                                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                                >
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
                                                                {errors.name && (
                                                                    <div className="text-red-600 text-sm">{errors.name}</div>
                                                                )}
                                                            </div>
                                                            <div className="mb-4">
                                                                <label
                                                                    htmlFor="description"
                                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                                >
                                                                    Description
                                                                </label>
                                                                <textarea
                                                                    id="description"
                                                                    name="description"
                                                                    value={formData.description}
                                                                    onChange={handleInputChange}
                                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                                                    required
                                                                ></textarea>
                                                                {errors.description && (
                                                                    <div className="text-red-600 text-sm">{errors.description}</div>
                                                                )}
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="mb-4">
                                                                    <label
                                                                        htmlFor="quantity"
                                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                                    >
                                                                        Quantity
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        id="quantity"
                                                                        name="quantity"
                                                                        value={formData.quantity}
                                                                        onChange={handleInputChange}
                                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                                                        required
                                                                    />
                                                                    {errors.quantity && (
                                                                        <div className="text-red-600 text-sm">{errors.quantity}</div>
                                                                    )}
                                                                </div>
                                                                <div className="mb-4">
                                                                    <label
                                                                        htmlFor="price"
                                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                                    >
                                                                        Price
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        id="price"
                                                                        name="price"
                                                                        value={formData.price}
                                                                        onChange={handleInputChange}
                                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                                                        required
                                                                    />
                                                                    {errors.price && (
                                                                        <div className="text-red-600 text-sm">{errors.price}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="mb-4">
                                                                <label
                                                                    htmlFor="category_id"
                                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                                >
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
                                                                    {categories.map((category) => (
                                                                        <option key={category.id} value={category.id}>
                                                                            {category.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {errors.category_id && (
                                                                    <div className="text-red-600 text-sm">{errors.category_id}</div>
                                                                )}
                                                            </div>
                                                            <div className="mb-4">
                                                                <label
                                                                    htmlFor="subcategory_id"
                                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                                >
                                                                    Subcategory
                                                                </label>
                                                                <select
                                                                    id="subcategory_id"
                                                                    name="subcategory_id"
                                                                    value={formData.subcategory_id}
                                                                    onChange={handleInputChange}
                                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                                                >
                                                                    <option value="">Select a subcategory (optional)</option>
                                                                    {subcategories.map((subcategory) => (
                                                                        <option key={subcategory.id} value={subcategory.id}>
                                                                            {subcategory.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="mb-4">
                                                                <label
                                                                    htmlFor="isAvailable"
                                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                                >
                                                                    Availability
                                                                </label>
                                                                <input
                                                                    type="checkbox"
                                                                    id="isAvailable"
                                                                    name="isAvailable"
                                                                    checked={formData.isAvailable}
                                                                    onChange={handleCheckboxChange}
                                                                    className="mt-1 border-gray-300 rounded shadow-sm focus:border-lime-500 focus:ring-lime-500"
                                                                />
                                                            </div>
                                                            <div className="mb-4">
                                                                <label
                                                                    htmlFor="image"
                                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                                >
                                                                    Image
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    id="image"
                                                                    name="image"
                                                                    accept="image/*"
                                                                    onChange={handleImageChange}
                                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                                                />
                                                                {imagePreview && (
                                                                    <img
                                                                        src={imagePreview}
                                                                        alt="Product Preview"
                                                                        className="mt-2 h-32 w-auto object-contain"
                                                                    />
                                                                )}
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
