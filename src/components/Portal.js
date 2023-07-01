import { createPortal } from 'react-dom';

export default function Portal({ Component, data, isOpen, close }) {
	if (!isOpen) return null;

	return createPortal(
		<Component data={data} isOpen={isOpen} close={close} />,
		document.getElementById('modal'),
	);
}
