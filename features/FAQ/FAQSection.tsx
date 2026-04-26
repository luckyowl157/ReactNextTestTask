'use client';
import React, { useState } from 'react';
import FAQWrapper from './FAQWrapper';
import FaqQuestion from './FaqQuestion';
import FaqAnswer from './FaqAnswer';
import Headline from '@/components/Headline';

interface FAQItem {
	title: string;
	description: string;
}

interface FAQ {
	id: number;
	section_title: string;
	items: FAQItem[];
}

interface FAQSectionProps {
	faqs: FAQ[] | null;
}

export default function FAQSection({ faqs }: FAQSectionProps) {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	return (
		<FAQWrapper>
			{faqs?.map((faq: FAQ) => {
				
				return (
					<div key={faq.id}>
						<Headline>{faq.section_title}</Headline>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-b border-white/20'>
							{faq.items.map((item, index) => {
								
								return (
									<div 
										key={index} 
										className={`p-6 md:p-10 border-b border-r border-white/20 `}
									>
									<div className='md:hidden space-y-6'>
										<FaqQuestion 
											isOpen={activeIndex === index}
											onClick={() => setActiveIndex(activeIndex === index ? null : index)}
										>
											{item.title}
										</FaqQuestion>
										{activeIndex === index && <FaqAnswer>{item.description}</FaqAnswer>}
									</div>										
									<div className='hidden md:block space-y-6'>
											{/* <h3 className='text-lg font-medium text-white'>{item.title}</h3> */}
											<FaqQuestion>{item.title}</FaqQuestion>
											<FaqAnswer>{item.description}</FaqAnswer>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				);
			})}
		</FAQWrapper>
	);
}
