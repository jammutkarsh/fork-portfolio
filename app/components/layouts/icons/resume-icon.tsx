/** A document with a few lines of text: the resume link's icon. */
export function ResumeIcon({ size = 20 }: { size?: number }) {
	return (
		<span className='flex items-center justify-center rounded-md p-2'>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width={size}
				height={size}
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
				aria-hidden='true'
			>
				<path d='M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z' />
				<path d='M14 3v5h5' />
				<path d='M9 13h6M9 17h4' />
			</svg>
		</span>
	);
}
