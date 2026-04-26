'use client';
import { useState } from 'react';
import Image from 'next/image';
import {cn} from '@/lib/utils';
import Headline from '@/components/Headline';
import ServicesText from './ServicesText';

interface ServiceItem {
	color: string;
	icon_default: string;
	icon_active: string;
	text: string;
}

interface Service {
	id: number;
	section_title: string;
	items: ServiceItem[];
}

interface ServicesClientProps {
	services: Service[] | null;
}

export default function ServicesClient({ services }: ServicesClientProps) {
	const [activeIndex, setActiveIndex] = useState<string | null>(null);
	const [mobileActiveIndex, setMobileActiveIndex] = useState<string>('');

	return (
		<section>
			{services?.map((service: Service) => {
				const totalItems = service.items.length;
				
				// Set default mobile active index to first item
				if (!mobileActiveIndex && service.items.length > 0) {
					setMobileActiveIndex(`${service.id}-0`);
				}
				
				return (
					<div key={service.id}>
						<Headline >{service.section_title}</Headline>
						
						{/* Mobile Navigation */}
						<div className='lg:hidden'>
							{/* Buttons with icons */}
							<div className='flex flex-row border-t border-white/20'>
								{service.items.map((item, index) => {
									const itemKey = `${service.id}-${index}`;
									const isActive = mobileActiveIndex === itemKey;
									
									return (
										<button
											key={index}
											onClick={() => setMobileActiveIndex(itemKey)}
											className={cn(
												'flex-1 border-r border-white/20 p-[15px] transition-all duration-300 size-[78px]',
												isActive ? 'opacity-100' : 'opacity-50'
											)}
											style={{
												backgroundColor: isActive ? item.color : 'transparent'
											}}
										>
											<Image 
												src={isActive ? item.icon_active : item.icon_default}
												alt={item.text}
												width={48}
												height={60}
												className='size-12 mx-auto'
											/>
										</button>
									);
								})}
							</div>
							
							{/* Content */}
							<div className='min-h-[400px] border-b border-white/20'>
								{service.items.map((item, index) => {
									const itemKey = `${service.id}-${index}`;
									const isActive = mobileActiveIndex === itemKey;
									
									if (!isActive) return null;
									
									return (
										<div 
											key={index}
											className='flex flex-col items-center justify-center text-center p-10 h-full'
											style={{ backgroundColor: item.color }}
										>
											<Image 
												src={item.icon_active}
												alt={item.text}
												width={160}
												height={160}
												className='w-40 h-40 mb-6'
											/>
											<ServicesText>{item.text}</ServicesText>
										</div>
									);
								})}
							</div>
						</div>
						
						{/* Desktop - keep original */}
						<div className='hidden lg:flex flex-row h-[604px] max-h-[604px] border-t border-b border-white/20 w-full'>
							{service.items.map((item, index) => {
								const itemKey = `${service.id}-${index}`;
								const isActive = activeIndex === itemKey;
								const inactiveWidthStyle = activeIndex 
									? (isActive ? {} : { width: `calc((100% - 515px) / ${totalItems - 1})` })
									: { width: `${100 / totalItems}%` };
								
								return (
									<div 
										key={index} 
										onMouseEnter={() => setActiveIndex(itemKey)}
										onMouseLeave={() => setActiveIndex(null)}
										className={cn(
											'border-r border-white/20 cursor-pointer transition-all duration-300 h-full flex flex-col items-center justify-center text-center gap-6 px-10',
											isActive ? 'w-[515px]' : ''
										)}
										style={{
											backgroundColor: isActive ? item.color : 'transparent',
											...inactiveWidthStyle
										}}
									>
										<Image 
											src={isActive ? item.icon_active : item.icon_default}
											alt={item.text}
											width={160}
											height={160}
											className='w-40 h-40'
										/>
										<ServicesText>{item.text}</ServicesText>
									</div>
								);
							})}
						</div>
					</div>
				);
			})}
		</section>
	);
}
