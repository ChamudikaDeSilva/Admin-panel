import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';
import { faFilePen,faArrowRight,faArrowLeft } from '@fortawesome/free-solid-svg-icons';


export default function Discounts({ auth }) {
    const [discounts, setDiscounts] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [discountsPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDiscounts, setSelectedDiscounts] = useState([]);
    const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [formData, setFormData] = useState({
        type: 'percentage',
        value: '',
        description: '',
        start_date: '',
        end_date: '',

    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const fetchDiscounts = async () => {
        try {
            const response = await axios.get('/api/product/management/fetch/discounts');
            setDiscounts(response.data.discounts);
            setProducts(response.data.products);
        } catch (error) {
            console.error('An error occurred while fetching discounts:', error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({
            type: 'percentage',
            value: '',
            description: '',
            start_date: '',
            end_date: '',

        });
        setErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/product/management/discount/create', formData)
            .then(response => {
                //alert(response.data.message);
                setModalMessage(response.data.message);
                setShowModal(true);

                closeModal();
                fetchDiscounts();
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.errors) {
                    setErrors(error.response.data.errors);
                } else {
                    console.error('Error creating discount:', error);
                }
            });
    };

    // Search function
    const searchDiscounts = (discounts) => {
        return discounts.filter(discount =>
            discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            discount.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Get current discounts
    const indexOfLastDiscount = currentPage * discountsPerPage;
    const indexOfFirstDiscount = indexOfLastDiscount - discountsPerPage;
    const currentDiscounts = searchDiscounts(discounts).slice(indexOfFirstDiscount, indexOfLastDiscount);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle checkbox selection for multiple deletion
    const handleSelectDiscount = (discountId) => {
        setSelectedDiscounts((prevSelectedDiscounts) =>
            prevSelectedDiscounts.includes(discountId)
                ? prevSelectedDiscounts.filter((id) => id !== discountId)
                : [...prevSelectedDiscounts, discountId]
        );
    };

    const handleSelectAllDiscounts = (e) => {
        if (e.target.checked) {
            const allDiscountIds = currentDiscounts.map((discount) => discount.id);
            setSelectedDiscounts(allDiscountIds);
        } else {
            setSelectedDiscounts([]);
        }
    };

    const handleDeleteSelectedDiscounts = async () => {
        setIsPurgeModalOpen(true);
    };

    const confirmDeleteDiscounts = async () => {
        try {
            await axios.post('/api/product/management/delete/multiple/discounts', { discount_ids: selectedDiscounts });
            setSelectedDiscounts([]);
            fetchDiscounts();
            setIsPurgeModalOpen(false);
        } catch (error) {
            console.error('An error occurred while deleting discounts:', error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
    };





        return (
            <AuthenticatedLayout user={auth.user}>
                <Head title="Discounts" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg ">
                            <div className="p-12 bg-white border-b border-gray-200">
                            <div className="mb-4">
                                <h1 className="text-2xl font-semibold text-gray-700 mb-4 italic">Discounts</h1>
                                <hr className="border-lime-500 mb-4" />

                                <div className="flex flex-col sm:flex-row items-center justify-between">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="border border-lime-500 focus:border-lime-500 focus:ring-0 rounded-md mb-2 sm:mb-0 px-4 py-2 sm:w-1/5"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <button
                                            className="px-4 py-2 bg-lime-500 text-white font-semibold rounded hover:bg-lime-700"
                                            onClick={openModal}
                                        >
                                            New
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-700"
                                            onClick={handleDeleteSelectedDiscounts}
                                            disabled={selectedDiscounts.length === 0}
                                        >
                                            Delete Selected
                                        </button>
                                    </div>
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
                                                        onChange={handleSelectAllDiscounts}
                                                        checked={selectedDiscounts.length === currentDiscounts.length}
                                                    />
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {currentDiscounts.map(discount => (
                                                <tr key={discount.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedDiscounts.includes(discount.id)}
                                                                onChange={() => handleSelectDiscount(discount.id)}
                                                            />
                                                        </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{discount.code}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{discount.type}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{discount.value}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{discount.description}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{discount.start_date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{discount.end_date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <FontAwesomeIcon icon={faFilePen} className="text-amber-600 hover:text-amber-900 cursor-pointer" onClick={() => {
                                                            // Assuming route('admins.edit', { id: admin.id }) will navigate to the edit page
                                                            window.location.href = route('discounts.edit', { id: discount.id });
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
                                        disabled={currentDiscounts.length < discountsPerPage}
                                        className="px-4 py-2 bg-lime-500 text-white font-semibold rounded-md hover:bg-amber-500"
                                    >
                                        <FontAwesomeIcon
                                        icon={faArrowRight}/>
                                    </button>
                                </div>

                            {/* Modal */}
                            {isModalOpen && (
                            <div className="fixed z-10 inset-0 overflow-y-auto">
                                <div className="flex items-center justify-center min-h-screen">
                                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                                    <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full mx-4 sm:w-full">
                                        <div className="bg-white px-8 py-4 sm:p-6 sm:pb-4">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 text-center" id="modal-title">
                                                Create A Discount
                                            </h3>
                                            <div className="mt-4">
                                                <form onSubmit={handleSubmit}>
                                                    <div className="flex items-center mb-4">
                                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mr-4 w-24">
                                                            Type
                                                        </label>
                                                        <select
                                                            id="type"
                                                            name="type"
                                                            value={formData.type}
                                                            onChange={handleInputChange}
                                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                                            style={{ maxWidth: '20rem' }}
                                                        >
                                                            <option value="percentage">Percentage</option>
                                                            <option value="fixed">Fixed</option>
                                                        </select>
                                                    </div>
                                                    {errors.type && <div className="text-red-600 text-sm">{errors.type}</div>}

                                                    <div className="flex items-center mb-4">
                                                        <label htmlFor="value" className="block text-sm font-medium text-gray-700 mr-4 w-24">
                                                            Value
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id="value"
                                                            name="value"
                                                            value={formData.value}
                                                            onChange={handleInputChange}
                                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                                            style={{ maxWidth: '20rem' }}
                                                            required
                                                        />
                                                    </div>
                                                    {errors.value && <div className="text-red-600 text-sm">{errors.value}</div>}

                                                    <div className="flex items-center mb-4">
                                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mr-4 w-24">
                                                            Description
                                                        </label>
                                                        <textarea
                                                            id="description"
                                                            name="description"
                                                            value={formData.description}
                                                            onChange={handleInputChange}
                                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                                            style={{ maxWidth: '20rem' }}
                                                        />
                                                    </div>
                                                    {errors.description && <div className="text-red-600 text-sm">{errors.description}</div>}

                                                    <div className="flex items-center mb-4">
                                                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mr-4 w-24">
                                                            Start Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="start_date"
                                                            name="start_date"
                                                            value={formData.start_date}
                                                            onChange={handleInputChange}
                                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                                            style={{ maxWidth: '20rem' }}
                                                        />
                                                    </div>
                                                    {errors.start_date && <div className="text-red-600 text-sm">{errors.start_date}</div>}

                                                    <div className="flex items-center mb-4">
                                                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mr-4 w-24">
                                                            End Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="end_date"
                                                            name="end_date"
                                                            value={formData.end_date}
                                                            onChange={handleInputChange}
                                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                                                            style={{ maxWidth: '20rem' }}
                                                        />
                                                    </div>
                                                    {errors.end_date && <div className="text-red-600 text-sm">{errors.end_date}</div>}

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
                                                Are you sure you want to delete the selected discounts?
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
                                            <button onClick={confirmDeleteDiscounts} type="button" className="w-full sm:w-auto mb-2 sm:mb-0 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:text-sm">
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
