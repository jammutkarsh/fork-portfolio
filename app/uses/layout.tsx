import type { ReactNode } from 'react';
import PageContainer from '../components/layouts/page-container';

export default function Layout({ children }: { children: ReactNode }) {
	return <PageContainer accent='#22a652'>{children}</PageContainer>;
}
