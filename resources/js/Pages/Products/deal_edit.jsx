import React, { useState,useEffect } from 'react';
import { usePage,useForm } from '@inertiajs/react';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Select from 'react-select';

export default function EditDeal() {
    const { props } = usePage();
    const { auth, categories, discounts, products, deal } = props;
    const [showModal, setShowModal] = useState(false);
    const [purgeModal, setPurgeModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [dealToDelete, setProductToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(deal?.image || '');
    const [imageName, setImageName] = useState(deal?.image ? deal.image.split('/').pop() : '');

    const { data, setData, errors } = useForm({
        name: deal.name || '',
        category_id: deal.categorydeals.length > 0 ? deal.categorydeals[0].id : '',
        description: deal.description || '',
        unit_price: deal.unit_price || '',
        quantity: deal.quantity || '',
        availability: deal.isAvailable || false,
        image: null,
        existingImage: deal.image || '',
        discounts: deal.discountdeals.map(discount => ({
            value: discount.id,
            label: discount.description,
        })), // Format discounts correctly for Select component
    });
    //console.log(data);

    if (!auth || !deal) {
        console.log('User, Auth, or Deal data is not available');
        return <div>Loading...</div>;
    }

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

    const handleDiscountChange = (selectedOptions) => {
        setData('discounts', selectedOptions || []);
    };


    const handleModalClose = () => {
        setShowModal(false);
        Inertia.visit('/product/management/deals');
    };

    const handlePurgeModalOpen = (dealId) => {
        setProductToDelete(dealId);
        setPurgeModal(true);
    };

    const handleDeleteProduct = async () => {
        setIsLoading(true);
        try {
            await axios.delete(`/api/product/management/delete/deals/${dealToDelete}`);
            setModalMessage('The deal was deleted successfully.');
            setShowModal(true);
            setPurgeModal(false);
        } catch (error) {
            console.error('Error deleting deal:', error);
            setModalMessage('Error deleting deal. Please try again.');
            setShowModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const dealId = deal.id;
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('category_id', data.category_id);
        formData.append('description', data.description);
        formData.append('unit_price', data.unit_price);
        formData.append('quantity', data.quantity);
        formData.append('availability', data.availability);

        if (data.image instanceof File) {
            formData.append('image', data.image);
        } else {
            formData.append('existingImage', data.existingImage);
        }

        // Append selected discounts to formData
        data.discounts.forEach(discount => {
            formData.append('discounts[]', discount.value); // Use discount.value if using react-select
        });

        try {
            await axios.post(`/api/product/management/update/deals/${dealId}`, formData);
            setModalMessage('The deal was updated successfully.');
            setShowModal(true);
        } catch (errors) {
            console.error('Error updating deal:', errors);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
            setImageName(file.name);
        }
    };

    return (
        <AuthenticatedLayout user={auth}>
            <Head title="Edit Deal" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200 ">
                        {/*<div className="p-6 bg-white border-b border-gray-200">*/}
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight text-center mb-6">Edit Deal</h2>
                            <form onSubmit={handleSubmit} className="flex flex-col items-center pb-20" encType="multipart/form-data">

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
                                    <label htmlFor="discounts" className="block text-sm font-medium text-gray-700 mb-1">
                                        Discounts
                                    </label>
                                    <Select
                                        id="discounts"
                                        name="discounts"
                                        isMulti
                                        options={discounts.map(discount => ({ value: discount.id, label: discount.description }))} // All available options
                                        value={data.discounts} // Pre-selected values for the specific deal
                                        onChange={handleDiscountChange}
                                        className="mt-1 block w-full border-gray-300 focus:border-lime-500 focus:outline-none focus:ring-lime-500 rounded-md shadow-sm"
                                    />


                                    {errors.discounts && <div className="text-red-600">{errors.discounts}</div>}
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
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Unit Price</label>
                                    <input
                                        id="price"
                                        type="number"
                                        name="unit_price"
                                        value={data.unit_price}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 focus:border-lime-500 focus:outline-none focus:ring-lime-500 rounded-md shadow-sm"
                                    />
                                    {errors.unit_price && <div className="text-red-600">{errors.unit_price}</div>}
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
                                    <div className="flex items-center mt-1">
                                        <input
                                            id="image"
                                            type="file"
                                            name="image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <label htmlFor="image" className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 cursor-pointer">
                                            Choose File
                                        </label>
                                        <span className="ml-2">{imageName || 'No file chosen'}</span>
                                    </div>
                                    {imagePreview && (
                                        <img
                                            src={imagePreview}
                                            alt="Product Preview"
                                            className="mt-2 h-32 w-auto object-contain"
                                        />
                                    )}
                                    {errors.image && <div className="text-red-600">{errors.image}</div>}
                                </div>

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
                                    <button
                                        type="button"
                                        onClick={() => handlePurgeModalOpen(deal.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
                                    >
                                        Purge
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
