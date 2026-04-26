import { cn } from '@/lib/utils';

interface FaqQuestionProps {
	children: React.ReactNode;
	className?: string;
	onClick?: () => void;
	isOpen?: boolean;
}

export default function FaqQuestion({ children, className, onClick, isOpen }: FaqQuestionProps) {
	return (
		<div
			onClick={onClick}
			className={cn(
				'relative font-normal text-[20px] md:text-2xl font-tactic-med leading-[100%] uppercase text-white flex flex-row gap-5 justify-between cursor-pointer',
				className,
			)}
		>
			{children}

			<div className='relative size-6 opacity-100 md:opacity-0 md:hidden flex shrink-0 items-center justify-center'>
				<span className={cn(
					'absolute w-0.5 h-full bg-white transition-opacity',
					isOpen ? 'opacity-0' : 'opacity-100'
				)} />
				<span className='absolute w-full h-0.5 bg-white' />
			</div>
		</div>
	);
}