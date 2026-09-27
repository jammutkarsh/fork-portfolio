import type { ReactNode } from 'react';
import OpenFrame from '../../components/layouts/open-frame';

export default function Layout({ children }: { children: ReactNode }) {
	return <OpenFrame>{children}</OpenFrame>;
}
