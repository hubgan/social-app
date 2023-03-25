import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import useLogin from '../hooks/useLogin';

// components
import Layout from '../components/Layout';
import Card from '../components/Card';

export default function Login() {
    const { pathname } = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useLogin();

    const nonActiveClasses = 'w-1/2';
    const activeClasses = 'w-1/2 border-socialBlue border-b-4 text-socialBlue font-bold'

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    }

    return (
        <Layout hideNavigation={true}>
            <div className="h-screen flex items-center">
                <div className="max-w-xs md:max-w-lg mx-auto grow -mt-24">
                    <h1 className="text-6xl mb-4 text-gray-300 text-center">Login</h1>
                    <Card noPadding={true}>
                        <div className='p-4'>
                            <div className='flex items-center text-center text-2xl mb-4'>
                                <div className={pathname === '/login' ? activeClasses : nonActiveClasses}>
                                    <Link to={'/login'} className='block w-full'>
                                        Login
                                    </Link>
                                </div>
                                <div className={pathname === '/signup' ? activeClasses : nonActiveClasses}>
                                    <Link to={'/signup'} className='block w-full'>
                                        Signup
                                    </Link>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-3'>
                                <div className="col-span-1 form-input relative z-10 border-2 focus-within:border-socialBlue rounded-md">
                                    <input type="email" name="email" placeholder=" " className="block px-4 py-2 w-full text-lg appearance-none focus:outline-none bg-transparent rounded-md"
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <label htmlFor="email" className="absolute top-0 left-0 text-lg bg-white px-4 py-2 -z-1 duration-300 origin-0">Email</label>
                                </div>
                                <div className="col-span-1 form-input relative z-10 border-2 focus-within:border-socialBlue rounded-md">
                                    <input type="password" name="password" placeholder=" " className="block px-4 py-2 w-full text-lg appearance-none focus:outline-none bg-transparent rounded-md"
                                        required
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <label htmlFor="password" className="absolute top-0 left-0 text-lg bg-white px-4 py-2 -z-1 duration-300 origin-0">Password</label>
                                </div>
                                <div className='col-span-1 flex items-center justify-center'>
                                    <button className='bg-socialBlue text-white px-6 py-2 rounded-md hover:cursor-pointer hover:bg-blue-500'>
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
