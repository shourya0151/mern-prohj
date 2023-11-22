import React, { useEffect, useState } from 'react'
import {FaSearch} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux';

export default function Header() {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const [searchTerm,setSearchTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        //to get the dat ain the search bar we use react inbuild functionality 
        //url serach params

        const urlParams = new URLSearchParams(window.location.search);
        //and then change its search term
        urlParams.set('searchTerm',searchTerm);
        const searchQuery = urlParams.toString();
        //and then navigate to the new query
        navigate(`/search?${searchQuery}`);
    };

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl){
            setSearchTerm(searchTermFromUrl);
        }

    },[location.search]);


    return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to='/'>
                <h1 className='font-bold text-sm sm:text-xl flex-wrap'>
                    
                    <span className='text-slate-500'>Booko</span>
                    <span className='text-slate-700'>Mania</span>
                    
                </h1>
            </Link>
            <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
                <input type="text" 
                placeholder='Search...'
                className='bg-transparent focus:outline-none w-24 sm:w-24'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <button>
                    <FaSearch className='text-slate-600' /> 
                </button>
            </form>
            <ul className='flex gap-4'>
                <Link to='/'>
                <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                </Link>

                <Link to='/about'>
                <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
                </Link>

                <Link to='/profile'>
                {currentUser ? (
                    <img className='rounded-full h-7 w-7 
                    object-cover'
                    src={currentUser.avatar} alt="profile" />
                ):(<li className=' text-slate-700 
                    hover:underline'>Sign in</li>
                    )}
                </Link>
                
            </ul>
        </div>
    </header>
  );
}
