import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Settings, HelpCircle } from 'lucide-react';

export default function AdminDashboard() {
	return (
		<div>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Link href="/admin/services">
					<Card className="hover:shadow-lg transition-shadow cursor-pointer">
						<CardHeader>
							<div className="flex items-center gap-2">
								<Settings className="h-6 w-6 text-primary" />
								<CardTitle>Послуги</CardTitle>
							</div>
							<CardDescription>
								Керування послугами
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Додавайте, редагуйте та видаляйте послуги
							</p>
						</CardContent>
					</Card>
				</Link>

				<Link href="/admin/faq">
					<Card className="hover:shadow-lg transition-shadow cursor-pointer">
						<CardHeader>
							<div className="flex items-center gap-2">
								<HelpCircle className="h-6 w-6 text-primary" />
								<CardTitle>FAQ</CardTitle>
							</div>
							<CardDescription>
								Керування питаннями та відповідями
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Додавайте, редагуйте та видаляйте FAQ
							</p>
						</CardContent>
					</Card>
				</Link>
			</div>
		</div>
	);
}
