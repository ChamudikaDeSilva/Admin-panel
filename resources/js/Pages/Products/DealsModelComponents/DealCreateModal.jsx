import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#app');

export default function DealCreateModal({ isOpen, onClose, products, categories, discounts, onSubmit }) {
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

    const handleMultiSelectChange = (e, fieldName) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormData({ ...formData, [fieldName]: selectedOptions });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            //onRequestClose={onClose}
            contentLabel="Create Deal Modal"
            className="modal"
            overlayClassName="modal-overlay"
        >
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
                <h2 className="text-2xl font-bold mb-4">Create New Deal</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block font-medium">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block font-medium">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-md"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="unit_price" className="block font-medium">
                            Unit Price
                        </label>
                        <input
                            type="number"
                            name="unit_price"
                            value={formData.unit_price}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-md"
                            step="0.01"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="quantity" className="block font-medium">
                            Quantity
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category_id" className="block font-medium">
                            Category
                        </label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-md"
                        >
                            <option value="">Select a Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="product_ids" className="block font-medium">
                            Products
                        </label>
                        <select
                            name="product_ids"
                            value={formData.product_ids}
                            onChange={(e) => handleMultiSelectChange(e, 'product_ids')}
                            className="w-full border border-gray-300 p-2 rounded-md"
                            multiple
                        >
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="discount_ids" className="block font-medium">
                            Discounts
                        </label>
                        <select
                            name="discount_ids"
                            value={formData.discount_ids}
                            onChange={(e) => handleMultiSelectChange(e, 'discount_ids')}
                            className="w-full border border-gray-300 p-2 rounded-md"
                            multiple
                        >
                            {discounts.map((discount) => (
                                <option key={discount.id} value={discount.id}>
                                    {discount.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="isAvailable" className="block font-medium">
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
                        <label htmlFor="image" className="block font-medium">
                            Image
                        </label>
                        <input type="file" name="image" onChange={handleImageChange} className="w-full" />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-400 text-white rounded-md mr-2"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-lime-500 text-white rounded-md">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
