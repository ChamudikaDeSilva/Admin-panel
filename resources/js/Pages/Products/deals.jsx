import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';

export default function Products({ auth }) {

    const [products, setProducts] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        try {
            const response = await axios.get('/api/product/management/fetch/deals');
            setProducts(response.data.deals);

        } catch (error) {
            console.error('An error occurred while fetching deals:', error);
        }
    };

 // Search function
    const searchDeals = (products) => {
        return deals.filter(
            (deal) =>
                deal.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Pagination
    const indexOfLastDeal = currentPage * dealsPerPage;
    const indexOfFirstDeal = indexOfLastDeal - dealsPerPage;
    const currentDeals = searchDeals(deal).slice(indexOfFirstDeal, indexOfLastDeal);

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
                                                    onChange={handleSelectAllDeals}
                                                    checked={selectedDeals.length === currentProducts.length}
                                                />
                                            </th>

                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Unit Price
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Current Price
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
                                                                window.location.href = route('deals.edit', { id: deal.id });
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No Deals found.
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
                                    disabled={currentDeals.length < dealsPerPage}
                                    className="px-4 py-2 bg-lime-500 text-white font-semibold rounded-md hover:bg-amber-500"
                                >
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
