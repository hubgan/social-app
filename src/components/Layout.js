import React from 'react'

// components
import NavigationCard from './NavigationCard';
import Search from './Search';

export default function Layout({ children, hideNavigation }) {
    let mainColumnClasses;
    if (hideNavigation) {
        mainColumnClasses = "w-full";
    }
    else {
        mainColumnClasses = "md:w-3/4 md:mx-0 mx-4";
    }

    return (
        <div className='md:flex gap-6 mt-48 max-w-4xl mx-auto md:mt-4 md:mb-0'>
            {!hideNavigation && (
                <div className='fixed z-50 w-full top-0 -mb-5 md:static md:w-1/4 md:mb-0'>
                    <Search />
                    <NavigationCard />
                </div>
            )}
            <div className={mainColumnClasses}>
                {children}
            </div>
        </div>
    );
}
