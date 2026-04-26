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

// async function ServicesSection() {
// 	const supabase = await createClient();
	
// 	const { data: services } = await supabase
// 		.from('services')
// 		.select('*')
// 		.order('created_at', { ascending: false });

// 	return (
// 		<>
// 			{services?.map((service: Service) => (
// 				<section key={service.id} className="w-full max-w-6xl px-4">
// 					<h2 className="text-4xl font-bold text-center mb-12">
// 						{service.section_title}
// 					</h2>
// 					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// 						{service.items.map((item, index) => (
// 							<div
// 								key={index}
// 								className="group flex flex-col items-center text-center p-6 rounded-lg border transition-all hover:shadow-lg"
// 								style={{ borderColor: item.color }}
// 							>
// 								<div className="mb-4 transition-opacity">
// 									<img
// 										src={item.icon_default}
// 										alt={item.text}
// 										className="h-16 w-16 object-contain group-hover:hidden"
// 									/>
// 									<img
// 										src={item.icon_active}
// 										alt={item.text}
// 										className="h-16 w-16 object-contain hidden group-hover:block"
// 									/>
// 								</div>
// 								<p className="text-lg" style={{ color: item.color }}>
// 									{item.text}
// 								</p>
// 							</div>
// 						))}
// 					</div>
// 				</section>
// 			))}
// 		</>
// 	);
// }

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
