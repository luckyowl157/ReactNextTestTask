import { AdminSidebar } from '@/components/admin/sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect('/auth/login');
	}

	return (
		<div className="flex h-screen">
			<AdminSidebar />
			<main className="flex-1 overflow-y-auto bg-white dark:bg-gray-950">
				<div className="container mx-auto p-6">
					{children}
				</div>
			</main>
		</div>
	);
}
