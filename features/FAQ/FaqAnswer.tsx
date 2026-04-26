import { cn } from '@/lib/utils';

interface FaqAnswerProps {
	children: React.ReactNode;
	className?: string;
}



export default function FaqAnswer({ children, className }: FaqAnswerProps) {
	return (
		<div className={cn(className)}>
			<p className='font-normal text-base leading-[100%] text-white font-tektur'>
				{children}
			</p>
		</div>
	);
}
