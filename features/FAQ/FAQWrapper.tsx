import { cn } from '@/lib/utils';

interface FAQWrapperProps {
	children: React.ReactNode;
	className?: string;
}

export default function FAQWrapper({ children, className }: FAQWrapperProps) {
	return (
		<div className={cn('w-full', className)}>
			{children}
		</div>
	);
}
