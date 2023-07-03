import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// components
import Card from './Card';
import HomeIcon from './icons/HomeIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import NotificationIcon from './icons/NotificationIcon';
import LogoutIcon from './icons/LogoutIcon';

// hooks
import useLogout from '../hooks/useLogout';
import useAuthContext from '../hooks/useAuthContext';

const activeElementClasses =
	'text-sm md:text-md flex gap-1 md:gap-3 py-3 my-1 bg-socialBlue text-white md:-mx-7 px-6 md:px-7 rounded-md shadow-md shadow-gray-300 items-center';
const nonActiveElementClasses =
	'text-sm md:text-md flex gap-1 md:gap-3 py-2 my-2 hover:bg-blue-500 hover:bg-opacity-20 md:-mx-4 px-6 md:px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300 items-center';

export default function NavigationCard() {
	const { pathname } = useLocation();
	const { user } = useAuthContext();
	const { logout } = useLogout();

	return (
		<Card noPadding={true}>
			<div className='px-4 py-2 flex justify-between md:block shadow-md shadow-gray-500 md:shadow-none'>
				<h2 className='text-gray-400 mb-3 hidden md:block'>Navigation</h2>
				<Link
					to={'/'}
					className={
						pathname === '/' ? activeElementClasses : nonActiveElementClasses
					}
				>
					<HomeIcon />
					<span className='hidden md:block'>Home</span>
				</Link>
				<Link
					to={`/profile/${user.uid}/friends`}
					className={
						pathname === '/profile/friends'
							? activeElementClasses
							: nonActiveElementClasses
					}
				>
					<UserGroupIcon />
					<span className='hidden md:block'>Friends</span>
				</Link>
				<Link
					to={'/notifications'}
					className={
						pathname === '/notifications'
							? activeElementClasses
							: nonActiveElementClasses
					}
				>
					<NotificationIcon />
					<span className='hidden md:block'>Notifications</span>
				</Link>
				<Link onClick={logout} className={nonActiveElementClasses}>
					<LogoutIcon />
					<span className='hidden md:block'>Logout</span>
				</Link>
			</div>
		</Card>
	);
}
