import { Fragment, type ReactNode } from 'react';
import OpenFrame from './open-frame';
import ScrollProgressBar from './scroll-progress-bar';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<Fragment>
			<ScrollProgressBar />
			<OpenFrame>{children}</OpenFrame>
		</Fragment>
	);
}
