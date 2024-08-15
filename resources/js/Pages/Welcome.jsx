import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />
                <div className="flex flex-wrap">
                    <div className="w-full sm:w-8/12 mb-10">
                        <div className="container mx-auto h-full sm:p-10">
                            <nav className="flex px-4 justify-between items-center">
                                <div className="text-7xl font-bold">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-500 to-green-600 via-amber-400">Pamona's Harvest Haven</span>
                                </div>
                                <div>
                                    <img src="https://image.flaticon.com/icons/svg/497/497348.svg" alt="" className="w-8"></img>
                                </div>
                            </nav>
                            <header className="container px-4 lg:flex mt-10 items-center h-full lg:mt-0">
                                <div className="w-full">
                                    <h1 className="text-4xl lg:text-6xl font-bold">Find your <span className="text-green-700">greeny</span> stuff for your kitchen</h1>
                                    <div className="w-20 h-2 bg-amber-500 my-4"></div>
                                    <p className="text-xl mb-10 text-gray-600">Welcome to Pamona's Harvest Haven. Discover premium greenery and accessories to transform your home into a serene oasis.
                                        Elevate your living space with our curated selection designed to bring life and tranquility.</p>
                                    <Link
                                        href={route('register')}
                                        className="bg-lime-500 hover:bg-amber-500 text-white text-2xl font-medium px-4 py-2 rounded shadow inline-block mr-4">
                                        Register
                                    </Link>

                                    <Link
                                        href={route('login')}
                                        className="bg-lime-500 hover:bg-amber-500 text-white text-2xl font-medium px-4 py-2 rounded shadow inline-block">
                                        Log in
                                    </Link>
                                </div>
                            </header>
                        </div>
                    </div>
                    <img src="https://images.unsplash.com/photo-1536147116438-62679a5e01f2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80" alt="Leafs" className="w-full h-48 object-cover sm:h-screen sm:w-4/12"></img>
                </div>
        </>
    );
}
