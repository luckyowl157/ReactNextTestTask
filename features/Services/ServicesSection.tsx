import { createClient } from '@/lib/supabase/server';
import ServicesClient from './ServicesClient';

export default async function ServicesSection() {
	const supabase = await createClient();
	
	const { data: services } = await supabase
		.from('services')
		.select('*')
		.order('created_at', { ascending: false });

	return <ServicesClient services={services} />;
}
