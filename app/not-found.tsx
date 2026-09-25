import PageContainer from 'app/components/layouts/page-container';
import Link from 'next/link';

export default function FourZeroFour() {
	return (
		<PageContainer>
			<div className='flex-1 flex flex-col items-center justify-center space-y-4'>
				<h1 className='text-4xl font-extrabold leading-10 tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl sm:leading-none md:text-6xl'>
					404
				</h1>
				<p className='text-lg leading-7 text-gray-500 dark:text-gray-400'>
					Looks like you&apos;re lost.
				</p>
				<Link href='/' className='underline-magical'>
					Go back home
				</Link>
			</div>
		</PageContainer>
	);
}
