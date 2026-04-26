import {cn} from '@/lib/utils';

interface HeadlineProps {
	children: React.ReactNode;
	className?: string;
}

export default function Headline({ children, className }: HeadlineProps) {
	return (
		<h1
			className={cn(
				'font-tactic-bold py-[30px] px-10 font-bold text-white text-[28px] leading-[100%] uppercase',
				className,
			)}
		>
			{children}
		</h1>
	);
};
