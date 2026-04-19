export default function Breadcrumb({ section, page }) {
	return (
		<div className="flex">
			<div className='text-sm text-gray-400'>
				<span className='cursor-pointer'><span className="hover:underline">Home</span> / </span> 
				{section && (<span>{section} / </span>)}
				<span className='border-b border-gray-400'>{page}</span>
			</div>
		</div>
	);
}