import React from 'react'

export default function Avatar({ size, src = 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80' }) {
    let width = 'w-12';

    if (size === 'lg') {
        width = 'w-24 md:w-36';
    }

    if (size === 'xs') {
        width = 'w-6';
    }

    return (
        <div className={`${width} rounded-full overflow-hidden`}>
            <img src={src} alt='avatar' />
        </div>
    );
}
