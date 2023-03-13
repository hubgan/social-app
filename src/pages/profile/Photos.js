import React from 'react'

// components
import Card from '../../components/Card'

export default function Photos() {
    return (
        <Card>
            <div className='grid md:grid-cols-2 gap-4'>
                <div className='flex items-center rounded-md h-48 overflow-hidden'>
                    <img src='https://images.unsplash.com/photo-1601581875039-e899893d520c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80' alt='user album' />
                </div>
                <div className='flex items-center rounded-md h-48 overflow-hidden'>
                    <img src='https://images.unsplash.com/photo-1563789031959-4c02bcb41319?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80' alt='user album' />
                </div>
                <div className='flex items-center rounded-md h-48 overflow-hidden'>
                    <img src='https://images.unsplash.com/photo-1560703650-ef3e0f254ae0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80' alt='user album' />
                </div>
                <div className='flex items-center rounded-md h-48 overflow-hidden'>
                    <img src='https://images.unsplash.com/photo-1601581874834-3b6065645e07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80' alt='user album' />
                </div>
            </div>
        </Card>
    );
}
