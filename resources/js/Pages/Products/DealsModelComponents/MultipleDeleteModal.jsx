import react from   'react';

const MultipleDeleteModal =({closeModal,confirmDeleteDeals})=>{
    return(
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
                                    Are you sure you want to delete the selected Deals?
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
                            <button onClick={closeModal} type="button" className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 border-transparent shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:ml-3 sm:text-sm">
                                Cancel
                            </button>
                            <button onClick={confirmDeleteDeals} type="button" className="w-full sm:w-auto mb-2 sm:mb-0 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:text-sm">
                                Delete
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MultipleDeleteModal;
