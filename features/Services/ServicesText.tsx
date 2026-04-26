import {cn} from '@/lib/utils';
interface ServicesTextProps {
	children: React.ReactNode;
	className?: string;
}
export default function ServicesText({ children, className }: ServicesTextProps) {
	return (
		<p className={cn('text-lg font-semibold leading-[100%] text-white uppercase font-ttfirs', className)}>{children}</p>
	)
};
