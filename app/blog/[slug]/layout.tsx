import { Fragment, type ReactNode } from 'react';
import OpenFrame from '../../components/layouts/open-frame';
import ScrollProgressBar from './scroll-progress-bar';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<Fragment>
			<ScrollProgressBar />
			<OpenFrame>
				<div className='mx-auto flex w-full max-w-220 flex-col gap-4'>
					{children}
				</div>
			</OpenFrame>
		</Fragment>
	);
}
