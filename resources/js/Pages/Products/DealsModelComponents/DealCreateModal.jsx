import React, { useState } from 'react';
import Select from 'react-select';

export default function DealCreateModal({ isOpen, onClose, products, categories, discounts, onSubmit }) {
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        unit_price: '',
        quantity: '',
        category_id: '',
        product_ids: [],
        discount_ids: [],
        isAvailable: false,
        image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, isAvailable: e.target.checked });
    };

    const handleMultiSelectChange = (selectedOptions, fieldName) => {
        const selectedValues = selectedOptions.map(option => option.value);
        setFormData({ ...formData, [fieldName]: selectedValues });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData);

        const formDataObj = new FormData();

        // Add the form data fields to FormData object
        formDataObj.append('name', formData.name);
        formDataObj.append('description', formData.description);
        formDataObj.append('unit_price', formData.unit_price);
        formDataObj.append('quantity', formData.quantity);
        formDataObj.append('category_id', formData.category_id);

        // Correctly add isAvailable as a boolean
        formDataObj.append('isAvailable', formData.isAvailable ?  1 : 0);

        // Add selected products
        formData.product_ids.forEach(productId => {
            formDataObj.append('product_ids[]', productId);
        });

        // Add selected discounts
        formData.discount_ids.forEach(discountId => {
            formDataObj.append('discount_ids[]', discountId);
        });

        // Add image if it's selected
        if (formData.image) {
            formDataObj.append('image', formData.image);
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/product/management/create/deals', {
                method: 'POST',
                body: formDataObj,
            });

            const result = await response.json();

            if (response.ok) {
                // Handle success, e.g., show success message or redirect
                console.log('Deal created successfully', result);
                onSubmit(result); // Optionally pass result back to the parent component
            } else {
                // Handle errors, e.g., show validation errors
                console.error('Failed to create deal', result);
            }
        } catch (error) {
            console.error('Error submitting form', error);
        }
    };



    if (!isOpen) return null;

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full mx-4 sm:w-full">
                    <div className="bg-white px-8 py-4 sm:p-6 sm:pb-4 flex justify-center items-center">
                        <div className="w-full">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 text-center" id="modal-title">Create New Deal</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-sm">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="unit_price" className="block text-sm">Unit Price</label>
                                    <input
                                        type="number"
                                        name="unit_price"
                                        value={formData.unit_price}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                        step="0.01"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="quantity" className="block text-sm">Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="category_id" className="block text-sm">Category</label>
                                    <select
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    >
                                        <option value="">Select a Category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Product Multi-Select */}
                                <div className="mb-4">
                                    <label htmlFor="product_ids" className="block text-sm">Products</label>
                                    <Select
                                        isMulti
                                        name="product_ids"
                                        options={products.map(product => ({ value: product.id, label: product.name }))}
                                        onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'product_ids')}
                                        className="mt-1"
                                    />
                                </div>

                                {/* Discount Multi-Select */}
                                <div className="mb-4">
                                    <label htmlFor="discount_ids" className="block text-sm">Discounts</label>
                                    <Select
                                        isMulti
                                        name="discount_ids"
                                        options={discounts.map(discount => ({ value: discount.id, label: discount.description }))}
                                        onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'discount_ids')}
                                        className="mt-1"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="isAvailable" className="block text-sm">Availability</label>
                                    <input
                                        type="checkbox"
                                        name="isAvailable"
                                        checked={formData.isAvailable}
                                        onChange={handleCheckboxChange}
                                        className="mr-2"
                                    />
                                    Available
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="image" className="block text-sm">Image</label>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    />
                                    {imagePreview && (
                                        <img
                                            src={imagePreview}
                                            alt="Product Preview"
                                            className="mt-2 h-32 w-auto object-contain"
                                        />
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 bg-gray-400 text-white rounded-md mr-2"
                                    >
                                        Discard
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-lime-500 text-white rounded-md">
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
