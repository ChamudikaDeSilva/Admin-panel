import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';

export default function Products({ auth }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [subcategories, setSubCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: '',
        price: '',
        isAvailable: false,
        image: null,
        category_id: '',
        subcategory_id: '', // New state for subcategory selection
        discounts: [],
        unit: '',
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
            setDiscounts(response.data.discounts);
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
            discounts: '',
            unit: '',
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
        formDataToSend.append('unit', formData.unit);
        if (formData.subcategory_id) {
            formDataToSend.append('subcategory_id', formData.subcategory_id);
        }
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        // Append discounts to the formDataToSend
        formData.discounts.forEach((discount, index) => {
            formDataToSend.append(`discounts[${index}]`, discount);
        });

        try {
            const response = await axios.post(route('products.store'), formDataToSend);

            // Close modal and show success message
            closeModal();
            setModalMessage('The product is created successfully.');
            setShowModal(true);
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
                product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = searchProducts(products).slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);



    // Handle checkbox selection for multiple deletion
    const handleSelectProduct = (productId) => {
    setSelectedProducts((prevSelectedProducts) =>
        prevSelectedProducts.includes(productId)
            ? prevSelectedProducts.filter((id) => id !== productId)
            : [...prevSelectedProducts, productId]
        );
    };

    const handleSelectAllProducts = (e) => {
        if (e.target.checked) {
            const allProductIds = currentProducts.map((product) => product.id);
            setSelectedProducts(allProductIds);
        } else {
            setSelectedProducts([]);
        }
    };

    const handleDeleteSelectedProducts = async () => {
        setIsPurgeModalOpen(true);
    };

    const confirmDeleteProducts = async () => {
        try {
            await axios.post(route('products.deleteMultiple'), { product_ids: selectedProducts });
            setSelectedProducts([]);
            fetchProducts();
            setIsPurgeModalOpen(false);
        } catch (error) {
            console.error('An error occurred while deleting products:', error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleDiscountChange = (selectedOptions) => {
        setFormData({ ...formData, discounts: selectedOptions.map(option => option.value) });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Products" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg ">
                        <div className="p-12 bg-white border-b border-gray-200">
                        <div className="mb-4">
                            <h1 className="text-2xl font-semibold text-gray-700 mb-4 italic">Products</h1>
                                <hr className="border-lime-500 mb-4" /> {/* Added hr element */}
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
                                                onClick={handleDeleteSelectedProducts}
                                                disabled={selectedProducts.length === 0}
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
                                    <thead className="bg-amber-100">
                                        <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAllProducts}
                                                    checked={selectedProducts.length === currentProducts.length}
                                                />
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Sub Category
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
                                                Unit
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Unit Price
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
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedProducts.includes(product.id)}
                                                            onChange={() => handleSelectProduct(product.id)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{product.category ? product.category.name : 'No Category'}</td>
                                                    <td className={`px-6 py-4 whitespace-nowrap ${product.sub_category ? '' : 'text-blue-500'}`}>
                                                        {product.sub_category ? product.sub_category.name : 'No Subcategory'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{product.description}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{product.unit}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{product.unit_price}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{product.isAvailable ? 'Yes' : 'No'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="h-12 w-12 object-cover rounded"
                                                        />
                                                    </td>
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
                                {/* Name Field */}
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
                                    {errors.name && (
                                        <div className="text-red-600 text-sm">{errors.name}</div>
                                    )}
                                </div>

                                {/* Description Field */}
                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
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
                                    {/* Quantity Field */}
                                    <div className="mb-4">
                                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
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

                                    {/* Price Field */}
                                    <div className="mb-4">
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
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

                                {/* Unit Field */}
                                <div className="mb-4">
                                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                                        Unit
                                    </label>
                                    <input
                                        type="text"
                                        id="unit"
                                        name="unit"
                                        value={formData.unit}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                        required
                                    />
                                    {errors.unit && (
                                        <div className="text-red-600 text-sm">{errors.unit}</div>
                                    )}
                                </div>

                                {/* Remaining Fields */}
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

                                {/* Subcategory Field */}
                                <div className="mb-4">
                                    <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700 mb-1">
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

                                {/* Discounts Field */}
                                <div className="mb-4">
                                    <label htmlFor="discounts" className="block text-sm font-medium text-gray-700 mb-1">
                                        Discounts
                                    </label>
                                    <Select
                                        id="discounts"
                                        name="discounts"
                                        isMulti
                                        options={discounts.map(discount => ({ value: discount.id, label: discount.code }))}
                                        onChange={handleDiscountChange}
                                        className="mt-1"
                                    />
                                </div>

                                {/* Availability Field */}
                                <div className="mb-4">
                                    <label htmlFor="isAvailable" className="block text-sm font-medium text-gray-700 mb-1">
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

                                {/* Image Upload Field */}
                                <div className="mb-4">
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
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
                                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-lime-500 text-base font-medium text-white hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:w-auto sm:text-sm"
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


                            {/* Purge Modal */}
                            {isPurgeModalOpen && (
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
                                                Are you sure you want to delete the selected products?
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
                                            <button onClick={() => setIsPurgeModalOpen(false)} type="button" className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 border-transparent shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:ml-3 sm:text-sm">
                                                Cancel
                                            </button>
                                            <button onClick={confirmDeleteProducts} type="button" className="w-full sm:w-auto mb-2 sm:mb-0 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:text-sm">
                                                Delete
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}

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

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
