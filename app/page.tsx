import { createClient } from '@/lib/supabase/server';
import { Suspense } from 'react';
import { FAQSection } from '@/features/FAQ';
import { ServicesSection } from '@/features/Services';

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

export default async function Home() {
	const supabase = await createClient();

	const { data: faqs } = await supabase
		.from('faq')
		.select('*')
		.order('created_at', { ascending: false });

		console.log('faq', faqs)

		const { data: services } = await supabase
			.from('services')
			.select('*')
			.order('created_at', { ascending: false });

			console.log('services', services);

	return (
		<main className='min-h-screen'>
			<Suspense
				fallback={
					<div className='w-full max-w-6xl px-4'>
						<div className='animate-pulse'>
							<div className='h-12 bg-gray-200 rounded w-64 mx-auto mb-12'></div>
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
								{[1, 2, 3].map(i => (
									<div key={i} className='h-48 bg-gray-200 rounded'></div>
								))}
							</div>
						</div>
					</div>
				}
			>
				<ServicesSection />
			</Suspense>

			<Suspense
				fallback={
					<div className='w-full max-w-4xl px-4'>
						<div className='animate-pulse'>
							<div className='h-12 bg-gray-200 rounded w-64 mx-auto mb-12'></div>
							<div className='space-y-4'>
								{[1, 2, 3, 4].map(i => (
									<div key={i} className='h-20 bg-gray-200 rounded'></div>
								))}
							</div>
						</div>
					</div>
				}
			>
				<FAQSection faqs={faqs} />
			</Suspense>
		</main>
	);
}
