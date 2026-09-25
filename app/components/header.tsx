import classNames from 'classnames';
import { merryWeather } from '../fonts';

export default function Header({ title }: { title: string }) {
	return (
		<div className='mb-8 flex items-center gap-4'>
			<h1
				className={classNames(
					'shrink-0 text-3xl md:text-5xl text-black dark:text-white',
					merryWeather.className,
				)}
			>
				{title}
			</h1>
			<div className='w-full border-b border-primary-500' />
		</div>
	);
}
