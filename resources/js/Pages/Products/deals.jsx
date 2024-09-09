import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen, faArrowLeft, faArrowRight, faFolderPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import DealCreateModal from './DealsModelComponents/DealCreateModal';

export default function Deals({ auth }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [deals, setDeals] = useState([]);
    const [categories, setCategories] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [dealsPerPage] = useState(5);
    const [selectedDeals, setSelectedDeals] = useState([]);

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        try {
            const response = await axios.get('/api/product/management/fetch/deals');
            setDeals(response.data.deals);
            setProducts(response.data.products);
            setCategories(response.data.categories);
            setDiscounts(response.data.discounts);
        } catch (error) {
            console.error('An error occurred while fetching deals:', error);
        }
    };

    // Search function
    const searchDeals = (deals) => {
        return deals.filter(
            (deal) =>
                deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                deal.category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Pagination
    const indexOfLastDeal = currentPage * dealsPerPage;
    const indexOfFirstDeal = indexOfLastDeal - dealsPerPage;
    const currentDeals = searchDeals(deals).slice(indexOfFirstDeal, indexOfLastDeal);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle checkbox selection for multiple deletion
    const handleSelectDeal = (dealId) => {
        setSelectedDeals((prevSelectedDeals) =>
            prevSelectedDeals.includes(dealId)
                ? prevSelectedDeals.filter((id) => id !== dealId)
                : [...prevSelectedDeals, dealId]
        );
    };

    const handleSelectAllDeals = (e) => {
        if (e.target.checked) {
            const allDealIds = currentDeals.map((deal) => deal.id);
            setSelectedDeals(allDealIds);
        } else {
            setSelectedDeals([]);
        }
    };

    const handleDeleteSelectedDeals = async () => {
        // Logic to delete selected deals
    };

    const handleSubmit = async (formData) => {
        // Logic to handle form submission (e.g., create new deal)
        closeModal();
        fetchDeals();
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Deals" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-12 bg-white border-b border-gray-200">
                            <div className="mb-4">
                                <h1 className="text-2xl font-semibold text-gray-700 mb-4 italic">Deals</h1>
                                <hr className="border-lime-500 mb-4" />
                                <div className="flex flex-col sm:flex-row items-center justify-between">
                                    <div className="flex flex-col sm:flex-row items-center">
                                        <FontAwesomeIcon
                                            icon={faFolderPlus}
                                            className="mb-2 sm:mb-0 px-4 py-2 text-lime-600 hover:text-lime-700 cursor-pointer fa-2x"
                                            onClick={openModal}
                                        />
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className={`mb-2 sm:mb-0 px-4 py-2 text-red-600 hover:text-red-700 cursor-pointer fa-2x ${selectedDeals.length === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                                            onClick={handleDeleteSelectedDeals}
                                            disabled={selectedDeals.length === 0}
                                        />
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAllDeals}
                                                    checked={selectedDeals.length === currentDeals.length}
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Unit Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Available
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Image
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentDeals.length > 0 ? (
                                            currentDeals.map((deal) => (
                                                <tr key={deal.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedDeals.includes(deal.id)}
                                                            onChange={() => handleSelectDeal(deal.id)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{deal.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{deal.description}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{deal.category.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{deal.quantity}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{deal.unit_price}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{deal.isAvailable ? 'Yes' : 'No'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <img
                                                            src={deal.image}
                                                            alt={deal.name}
                                                            className="h-12 w-12 object-cover rounded"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <FontAwesomeIcon
                                                            icon={faFilePen}
                                                            className="text-amber-600 hover:text-amber-900 cursor-pointer"
                                                            onClick={() => {
                                                                window.location.href = route('deals.edit', { id: deal.id });
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No deals found.
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
                                    className="px-4 py-2 mr-2 bg-lime-500 text-white font-semibold rounded-md hover:bg-lime-600"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                </button>
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentDeals.length < dealsPerPage}
                                    className="px-4 py-2 bg-lime-500 text-white font-semibold rounded-md hover:bg-lime-600"
                                >
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DealCreateModal
                isOpen={isModalOpen}
                onClose={closeModal}
                products={products}
                categories={categories}
                discounts={discounts}
                onSubmit={handleSubmit}
            />
        </AuthenticatedLayout>
    );
}
