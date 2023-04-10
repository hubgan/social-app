import React from 'react'

export default function Card({ children, noPadding, noMargin }) {
    let classes = 'bg-white shadow-md shadow-gray-300 rounded-md md:mb-5';

    if (!noPadding) {
        classes += ' p-4';
    }

    if (!noMargin) {
        classes += ' mb-0';
    }

    return (
        <div className={classes}>
            {children}
        </div>
    );
}
