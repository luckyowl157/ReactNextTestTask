'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Settings, HelpCircle, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const menuItems = [
	{
		title: 'Панель керування',
		href: '/admin',
		icon: Home,
	},
	{
		title: 'Послуги',
		href: '/admin/services',
		icon: Settings,
	},
	{
		title: 'FAQ',
		href: '/admin/faq',
		icon: HelpCircle,
	},
];

export function AdminSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const supabase = createClient();

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.push('/auth/login');
		router.refresh();
	};

	return (
		<div className="flex h-full w-64 flex-col border-r bg-gray-50 dark:bg-gray-900">
			<div className="flex h-16 items-center border-b px-6">
				<h2 className="text-xl font-bold">Dashboard Panel</h2>
			</div>
			<nav className="flex-1 space-y-1 px-3 py-4">
				{menuItems.map((item) => {
					const Icon = item.icon;
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
								isActive
									? 'bg-primary text-primary-foreground'
									: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
							)}
						>
							<Icon className="h-5 w-5" />
							{item.title}
						</Link>
					);
				})}
			</nav>
			<div className="border-t p-4 space-y-2">

				<Link
					href="/"
					className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
				>
					<Home className="h-5 w-5" />
					Повернутись на сайт
				</Link>
				<button
					onClick={handleLogout}
					className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
				>
					<LogOut className="h-5 w-5" />
					Вийти
				</button>
			</div>
		</div>
	);
}
