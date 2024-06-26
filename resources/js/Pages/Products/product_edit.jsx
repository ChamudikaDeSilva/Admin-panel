import React, { useState,useEffect } from 'react';
import { usePage,useForm } from '@inertiajs/react';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function EditProduct() {
    const { props } = usePage();
    const { auth, subcategories, categories, product } = props;
    const [showModal, setShowModal] = useState(false);
    const [purgeModal, setPurgeModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [productToDelete, setProductToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    if (!auth || !product) {
        console.log('User, Auth, or Product data is not available');
        return <div>Loading...</div>;
    }

    const { data, setData, put, errors } = useForm({
        name: product.name || '',
        category_id: product.category_id || '',
        subcategory_id: product.subcategory_id || '',
        description: product.description || '',
        price: product.price || '',
        quantity: product.quantity || '',
        availability: product.isAvailable || false,
        image: null,
        existingImage: product.image || '',
    });

    useEffect(() => {
        console.log('Product:', product);
        console.log('Form Data:', data);
    }, [product, data]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'checkbox') {
            setData(name, checked);
        } else if (type === 'file') {
            setData(name, files[0]);
        } else {
            setData(name, value);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        Inertia.visit('/product/management/products');
    };

    const handlePurgeModalOpen = (productId) => {
        setProductToDelete(productId);
        setPurgeModal(true);
    };

    const handleDeleteProduct = async () => {
        setIsLoading(true);
        try {
            await axios.delete(`/api/product/management/delete/products/${productToDelete}`);
            setModalMessage('The product was deleted successfully.');
            setShowModal(true);
            setPurgeModal(false);
        } catch (error) {
            console.error('Error deleting product:', error);
            setModalMessage('Error deleting product. Please try again.');
            setShowModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const productData = new FormData();
            productData.append('name', data.name);
            productData.append('category_id', data.category_id);
            productData.append('subcategory_id', data.subcategory_id);
            productData.append('description', data.description);
            productData.append('price', data.price);
            productData.append('quantity', data.quantity);
            productData.append('availability', data.availability);

            if (data.image) {
                productData.append('image', data.image);
            } else {
                productData.append('existingImage', data.existingImage);
            }

            const productId = product.id; // Assuming product.id is accessible here

            const response = await axios.put(`/api/product/management/update/products/${productId}`, productData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Handle success response
            setModalMessage('The product was updated successfully.');
            setShowModal(true);
        } catch (error) {
            console.error('Error updating product:', error);
            console.error('Backend errors:', error.response?.data?.errors);
            setModalMessage('Error updating product. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <AuthenticatedLayout user={auth}>
            <Head title="Edit Product" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight text-center mb-6">Edit Product</h2>
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
                                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        id="category_id"
                                        name="category_id"
                                        value={data.category_id}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 focus:border-lime-500 focus:outline-none focus:ring-lime-500 rounded-md shadow-sm"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && <div className="text-red-600">{errors.category_id}</div>}
                                </div>

                                <div className="mt-4 w-full max-w-md">
                                    <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700">Subcategory</label>
                                    <select
                                        id="subcategory_id"
                                        name="subcategory_id"
                                        value={data.subcategory_id}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 focus:border-lime-500 focus:outline-none focus:ring-lime-500 rounded-md shadow-sm"
                                    >
                                        <option value="">Select a subcategory</option>
                                        {subcategories.map((subcategory) => (
                                            <option key={subcategory.id} value={subcategory.id}>
                                                {subcategory.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.subcategory_id && <div className="text-red-600">{errors.subcategory_id}</div>}
                                </div>

                                <div className="mt-4 w-full max-w-md">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 focus:border-lime-500 focus:outline-none focus:ring-lime-500 rounded-md shadow-sm"
                                    />
                                    {errors.description && <div className="text-red-600">{errors.description}</div>}
                                </div>

                                <div className="mt-4 w-full max-w-md">
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                                    <input
                                        id="price"
                                        type="number"
                                        name="price"
                                        value={data.price}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 focus:border-lime-500 focus:outline-none focus:ring-lime-500 rounded-md shadow-sm"
                                    />
                                    {errors.price && <div className="text-red-600">{errors.price}</div>}
                                </div>

                                <div className="mt-4 w-full max-w-md">
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                                    <input
                                        id="quantity"
                                        type="number"
                                        name="quantity"
                                        value={data.quantity}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 focus:border-lime-500 focus:outline-none focus:ring-lime-500 rounded-md shadow-sm"
                                    />
                                    {errors.quantity && <div className="text-red-600">{errors.quantity}</div>}
                                </div>

                                <div className="mt-4 w-full max-w-md">
                                    <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Availability</label>
                                    <input
                                        id="availability"
                                        type="checkbox"
                                        name="availability"
                                        checked={data.availability}
                                        onChange={handleChange}
                                        className="mt-1 block border-gray-300 focus:border-lime-500 focus:outline-none focus:ring-lime-500 rounded-md shadow-sm"
                                    />
                                    {errors.availability && <div className="text-red-600">{errors.availability}</div>}
                                </div>

                                <div className="mt-4 w-full max-w-md">
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                                    {data.existingImage && (
                                        <div className="mt-2">
                                            <img src={data.existingImage} alt="Product" className="max-h-32"/>
                                        </div>
                                    )}
                                    <input
                                        id="image"
                                        type="file"
                                        name="image"
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 focus:border-lime-500 focus:outline-none focus:ring-lime-500 rounded-md shadow-sm"
                                    />
                                    {errors.image && <div className="text-red-600">{errors.image}</div>}
                                </div>

                                <div className="flex justify-center space-x-2 mt-4">
                                    <Link
                                        href="/product/management/products"
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
                                    <button
                                        type="button"
                                        onClick={() => handlePurgeModalOpen(product.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
                                    >
                                        Purge
                                    </button>
                                </div>
                            </form>

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

                            {purgeModal && (
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
                                                            Are you sure you want to delete this product?
                                                        </h3>
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-500">
                                                                This action cannot be undone. Please confirm.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                                <button onClick={handleDeleteProduct} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                                                    Delete
                                                </button>
                                                <button onClick={() => setPurgeModal(false)} type="button" className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                                    Cancel
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
