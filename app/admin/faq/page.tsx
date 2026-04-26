'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';

interface FAQItem {
	title: string;
	description: string;
}

interface FAQ {
	id: number;
	section_title: string;
	items: FAQItem[];
	created_at: string;
}

export default function FAQPage() {
	const [faqs, setFaqs] = useState<FAQ[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [isAdding, setIsAdding] = useState(false);
	const [formData, setFormData] = useState({ 
		section_title: '', 
		items: [] as FAQItem[] 
	});

	const supabase = createClient();

	const fetchFAQs = useCallback(async () => {
		setIsLoading(true);
		const { data, error } = await supabase
			.from('faq')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching FAQs:', error);
		} else {
			setFaqs(data || []);
		}
		setIsLoading(false);
	}, [supabase]);

	useEffect(() => {
		fetchFAQs();
	}, [fetchFAQs]);

	async function handleAdd() {
		if (!formData.section_title || formData.items.length === 0) {
			alert('Заповніть назву секції та додайте хоча б один елемент');
			return;
		}

		const { error } = await supabase
			.from('faq')
			.insert([{ 
				section_title: formData.section_title, 
				items: formData.items 
			}]);

		if (error) {
			console.error('Error adding FAQ:', error);
		} else {
			setFormData({ section_title: '', items: [] });
			setIsAdding(false);
			fetchFAQs();
		}
	}

	async function handleUpdate(id: number) {
		if (!formData.section_title || formData.items.length === 0) {
			alert('Заповніть назву секції та додайте хоча б один елемент');
			return;
		}

		const { error } = await supabase
			.from('faq')
			.update({ 
				section_title: formData.section_title, 
				items: formData.items 
			})
			.eq('id', id);

		if (error) {
			console.error('Error updating FAQ:', error);
		} else {
			setEditingId(null);
			setFormData({ section_title: '', items: [] });
			fetchFAQs();
		}
	}

	async function handleDelete(id: number) {
		if (!confirm('Ви впевнені, що хочете видалити цю секцію FAQ?')) return;

		const { error } = await supabase.from('faq').delete().eq('id', id);

		if (error) {
			console.error('Error deleting FAQ:', error);
		} else {
			fetchFAQs();
		}
	}

	function startEdit(faq: FAQ) {
		setEditingId(faq.id);
		setFormData({ 
			section_title: faq.section_title, 
			items: [...faq.items] 
		});
		setIsAdding(false);
	}

	function cancelEdit() {
		setEditingId(null);
		setIsAdding(false);
		setFormData({ section_title: '', items: [] });
	}

	function addItem() {
		setFormData({
			...formData,
			items: [...formData.items, { title: '', description: '' }]
		});
	}

	function removeItem(index: number) {
		const newItems = formData.items.filter((_, i) => i !== index);
		setFormData({ ...formData, items: newItems });
	}

	function updateItem(index: number, field: keyof FAQItem, value: string) {
		const newItems = [...formData.items];
		newItems[index] = { ...newItems[index], [field]: value };
		setFormData({ ...formData, items: newItems });
	}

	return (
		<div>
			<div className='mb-6 flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold font-tactic-med'>FAQ</h1>
					<p className='text-gray-600 font-tektur dark:text-gray-400 mt-2'>
						Керуйте питаннями та відповідями
					</p>
				</div>
				{faqs.length < 1 && (
					<Button
						onClick={() => setIsAdding(true)}
						disabled={isAdding || editingId !== null}
					>
						<Plus className='mr-2 h-4 w-4' />
						Додати секцію
					</Button>
				)}
			</div>

			{isAdding && (
				<Card className='mb-6'>
					
					<CardContent>
						<div className='space-y-6'>
							<div>
								<Label htmlFor='section_title'>Назва секції</Label>
								<Input
									id='section_title'
									value={formData.section_title}
									onChange={e =>
										setFormData({ ...formData, section_title: e.target.value })
									}
									placeholder='Введіть назву секції'
								/>
							</div>

							<div className='border-t pt-4'>
								<div className='flex items-center justify-between mb-4'>
									<Label>Питання та відповіді</Label>
									<Button size='sm' onClick={addItem}>
										<Plus className='mr-2 h-3 w-3' />
										Додати питання
									</Button>
								</div>

								<div className='space-y-4'>
									{formData.items.map((item, index) => (
										<Card key={index} className='p-4'>
											<div className='space-y-3'>
												<div className='flex items-center justify-between mb-2'>
													<span className='text-sm font-medium'>
														Питання {index + 1}
													</span>
													<Button
														size='sm'
														variant='ghost'
														onClick={() => removeItem(index)}
													>
														<Trash2 className='h-4 w-4 text-red-500' />
													</Button>
												</div>

												<div>
													<Label htmlFor={`title-${index}`}>
														Заголовок питання
													</Label>
													<Input
														id={`title-${index}`}
														value={item.title}
														onChange={e =>
															updateItem(index, 'title', e.target.value)
														}
														placeholder='Введіть питання'
													/>
												</div>

												<div>
													<Label htmlFor={`description-${index}`}>
														Відповідь
													</Label>
													<Input
														id={`description-${index}`}
														value={item.description}
														onChange={e =>
															updateItem(index, 'description', e.target.value)
														}
														placeholder='Введіть відповідь'
													/>
												</div>
											</div>
										</Card>
									))}
									{formData.items.length === 0 && (
										<p className='text-sm text-gray-500 text-center py-4'>
											Немає питань. Натисніть &quot;Додати питання&quot;
										</p>
									)}
								</div>
							</div>

							<div className='flex gap-2'>
								<Button onClick={handleAdd}>
									<Check className='mr-2 h-4 w-4' />
									Зберегти
								</Button>
								<Button variant='outline' onClick={cancelEdit}>
									<X className='mr-2 h-4 w-4' />
									Скасувати
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{isLoading ? (
				<div className='text-center py-8'>Завантаження...</div>
			) : (
				<div className='space-y-4'>
					{faqs.map(faq => (
						<Card key={faq.id}>
							<CardContent className='pt-6'>
								{editingId === faq.id ? (
									<div className='space-y-6'>
										<div>
											<Label htmlFor={`edit-section-title-${faq.id}`}>
												Назва секції
											</Label>
											<Input
												id={`edit-section-title-${faq.id}`}
												value={formData.section_title}
												onChange={e =>
													setFormData({
														...formData,
														section_title: e.target.value,
													})
												}
											/>
										</div>

										<div className='border-t pt-4'>
											<div className='flex items-center justify-between mb-4'>
												<Label>Питання та відповіді</Label>
												<Button size='sm' onClick={addItem}>
													<Plus className='mr-2 h-3 w-3' />
													Додати питання
												</Button>
											</div>

											<div className='space-y-4'>
												{formData.items.map((item, index) => (
													<Card key={index} className='p-4'>
														<div className='space-y-3'>
															<div className='flex items-center justify-between mb-2'>
																<span className='text-sm font-medium'>
																	Питання {index + 1}
																</span>
																<Button
																	size='sm'
																	variant='ghost'
																	onClick={() => removeItem(index)}
																>
																	<Trash2 className='h-4 w-4 text-red-500' />
																</Button>
															</div>

															<div>
																<Label
																	htmlFor={`edit-title-${faq.id}-${index}`}
																>
																	Заголовок питання
																</Label>
																<Input
																	id={`edit-title-${faq.id}-${index}`}
																	value={item.title}
																	onChange={e =>
																		updateItem(index, 'title', e.target.value)
																	}
																	placeholder='Введіть питання'
																/>
															</div>

															<div>
																<Label
																	htmlFor={`edit-description-${faq.id}-${index}`}
																>
																	Відповідь
																</Label>
																<Input
																	id={`edit-description-${faq.id}-${index}`}
																	value={item.description}
																	onChange={e =>
																		updateItem(
																			index,
																			'description',
																			e.target.value,
																		)
																	}
																	placeholder='Введіть відповідь'
																/>
															</div>
														</div>
													</Card>
												))}
											</div>
										</div>

										<div className='flex gap-2'>
											<Button onClick={() => handleUpdate(faq.id)}>
												<Check className='mr-2 h-4 w-4' />
												Зберегти
											</Button>
											<Button variant='outline' onClick={cancelEdit}>
												<X className='mr-2 h-4 w-4' />
												Скасувати
											</Button>
										</div>
									</div>
								) : (
									<div className='flex items-start justify-between'>
										<div className='flex-1'>
											<h3 className='text-xl font-semibold mb-4 font-tactic-med'>
												FAQ&apos;s
											</h3>
											<div className='space-y-3'>
												{faq.items.map((item, index) => (
													<div
														key={index}
														className='p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'
													>
														<h4 className='font-tactic-bold font-medium mb-1'>{item.title}</h4>
														<p className='text-gray-600 font-tektur dark:text-gray-400'>
															{item.description}
														</p>
													</div>
												))}
											</div>
										</div>
										<div className='flex gap-2 ml-4'>
											<Button
												variant='outline'
												size='sm'
												onClick={() => startEdit(faq)}
												disabled={isAdding || editingId !== null}
											>
												<Edit className='h-4 w-4' />
											</Button>
											<Button
												variant='destructive'
												size='sm'
												onClick={() => handleDelete(faq.id)}
												disabled={isAdding || editingId !== null}
											>
												<Trash2 className='h-4 w-4' />
											</Button>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					))}
					{faqs.length === 0 && (
						<div className='text-center py-8 text-gray-500'>
							Немає секцій. Додайте першу!
						</div>
					)}
				</div>
			)}
		</div>
	);
}
