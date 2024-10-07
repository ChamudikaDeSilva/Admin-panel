import React, { useState } from 'react';
import Select from 'react-select'; // Import react-select

export default function DealCreateModal({ isOpen, onClose, products, categories, discounts, onSubmit }) {
    const [imagePreview, setImagePreview] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
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

        if (name === 'category_id') {
            const filtered = products.filter(product => product.category_id === parseInt(value));
            setFilteredProducts(filtered);
        }
    };

    // Handle react-select change for products
    const handleProductChange = (selectedOptions) => {
        const selectedProductIds = selectedOptions.map(option => option.value);
        setFormData({ ...formData, product_ids: selectedProductIds });
    };

    // Handle react-select change for discounts
    const handleDiscountChange = (selectedOptions) => {
        const selectedDiscountIds = selectedOptions.map(option => option.value);
        setFormData({ ...formData, discount_ids: selectedDiscountIds });
    };

    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, isAvailable: e.target.checked });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
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
                                            <label htmlFor="name" className="block text-sm">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="description" className="block text-sm">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                            ></textarea>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="unit_price" className="block text-sm">
                                                Unit Price
                                            </label>
                                            <input
                                                type="number"
                                                name="unit_price"
                                                value={formData.unit_price}
                                                onChange={handleChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                                step="0.01"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="quantity" className="block text-sm">
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={formData.quantity}
                                                onChange={handleChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="category_id" className="block text-sm">Category</label>
                                            <select
                                                name="category_id"
                                                value={formData.category_id}
                                                onChange={handleChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                            >
                                                <option value="">Select a Category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Products dropdown using react-select */}
                                        <div className="mb-4">
                                            <label htmlFor="products" className="block text-sm font-medium text-gray-700 mb-1">
                                                Products
                                            </label>
                                            <Select
                                                id="products"
                                                name="products"
                                                isMulti
                                                options={filteredProducts.map(product => ({ value: product.id, label: product.name }))}
                                                onChange={handleProductChange}
                                                className="mt-1"
                                                isDisabled={!formData.category_id} // Disable if no category is selected
                                            />
                                        </div>

                                        {/* Discounts dropdown using react-select */}
                                        <div className="mb-4">
                                            <label htmlFor="discounts" className="block text-sm font-medium text-gray-700 mb-1">
                                                Discounts
                                            </label>
                                            <Select
                                                id="discounts"
                                                name="discounts"
                                                isMulti
                                                options={discounts.map(discount => ({ value: discount.id, label: discount.description }))}
                                                onChange={handleDiscountChange}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="isAvailable" className="block text-sm">
                                                Availability
                                            </label>
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