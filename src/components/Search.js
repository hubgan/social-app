import React, { useState } from 'react'

// components
import Card from './Card';
import Avatar from './Avatar';

// hooks
import { useCollection } from '../hooks/useCollection';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';

export default function Search() {
    const { documents } = useCollection('users');
    const [users, setUsers] = useState([]);

    const filterUsers = debounce((e) => {
        if (e.target.value === '') {
            setUsers([]);
            return;
        }

        const result = documents.filter((user) => user.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setUsers(result);
    }, 100)

    return (
        <Card noMargin={true}>
            <div className="flex flex-col justify-center">
                <div className="relative flex w-full flex-wrap items-stretch">
                    <input
                        type="search"
                        className="relative m-0 -mr-px block w-[1%] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-neutral-700 outline-none transition duration-300 ease-in-out focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:text-neutral-200 dark:placeholder:text-neutral-200"
                        placeholder="Search"
                        aria-label="Search"
                        aria-describedby="button-addon1"
                        onChange={filterUsers}
                    />
                </div>
                <div className='mt-2 max-h-60 overflow-y-auto'>
                    {users && users.map((user) => (
                        <Link to={`/profile/${user.id}/posts`} key={`search/${user.id}`} className='flex items-center gap-3 mb-2 cursor-pointer hover:bg-slate-100 h-12'>
                            <Avatar src={user.avatar} />
                            <div>
                                <p className='text-sm'>{user.name}</p>
                                <p className='text-xs text-gray-500'>{user.location}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </Card>
    );
}
