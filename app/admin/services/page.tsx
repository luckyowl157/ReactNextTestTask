'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, X, Check, Upload } from 'lucide-react';

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
	created_at: string;
}

export default function ServicesPage() {
	const [services, setServices] = useState<Service[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [isAdding, setIsAdding] = useState(false);
	const [formData, setFormData] = useState({ 
		section_title: '', 
		items: [] as ServiceItem[] 
	});
	const [uploadingIcon, setUploadingIcon] = useState<number | null>(null);

	const supabase = createClient();

	const fetchServices = useCallback(async () => {
		setIsLoading(true);
		const { data, error } = await supabase
			.from('services')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching services:', error);
		} else {
			setServices(data || []);
		}
		setIsLoading(false);
	}, [supabase]);

	useEffect(() => {
		fetchServices();
	}, [fetchServices]);

	async function uploadIcon(file: File): Promise<string | null> {
		const fileExt = file.name.split('.').pop();
		const fileName = `${Math.random()}.${fileExt}`;
		const filePath = `${fileName}`;

		const { error: uploadError } = await supabase.storage
			.from('service-icons')
			.upload(filePath, file);

		if (uploadError) {
			console.error('Error uploading icon:', uploadError);
			return null;
		}

		const { data } = supabase.storage
			.from('service-icons')
			.getPublicUrl(filePath);

		return data.publicUrl;
	}

	async function handleAdd() {
		if (!formData.section_title || formData.items.length === 0) {
			alert('Заповніть назву секції та додайте хоча б один елемент');
			return;
		}

		const { error } = await supabase
			.from('services')
			.insert([{ 
				section_title: formData.section_title, 
				items: formData.items 
			}]);

		if (error) {
			console.error('Error adding service:', error);
		} else {
			setFormData({ section_title: '', items: [] });
			setIsAdding(false);
			fetchServices();
		}
	}

	async function handleUpdate(id: number) {
		if (!formData.section_title || formData.items.length === 0) {
			alert('Заповніть назву секції та додайте хоча б один елемент');
			return;
		}

		const { error } = await supabase
			.from('services')
			.update({ 
				section_title: formData.section_title, 
				items: formData.items 
			})
			.eq('id', id);

		if (error) {
			console.error('Error updating service:', error);
		} else {
			setEditingId(null);
			setFormData({ section_title: '', items: [] });
			fetchServices();
		}
	}

	async function handleDelete(id: number) {
		if (!confirm('Ви впевнені, що хочете видалити цю секцію послуг?')) return;

		const { error } = await supabase.from('services').delete().eq('id', id);

		if (error) {
			console.error('Error deleting service:', error);
		} else {
			fetchServices();
		}
	}

	function startEdit(service: Service) {
		setEditingId(service.id);
		setFormData({ 
			section_title: service.section_title, 
			items: [...service.items] 
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
			items: [...formData.items, { color: '#000000', icon_default: '', icon_active: '', text: '' }]
		});
	}

	function removeItem(index: number) {
		const newItems = formData.items.filter((_, i) => i !== index);
		setFormData({ ...formData, items: newItems });
	}

	function updateItem(index: number, field: keyof ServiceItem, value: string) {
		const newItems = [...formData.items];
		newItems[index] = { ...newItems[index], [field]: value };
		setFormData({ ...formData, items: newItems });
	}

	async function handleIconUpload(index: number, file: File, type: 'icon_default' | 'icon_active') {
		setUploadingIcon(index);
		const url = await uploadIcon(file);
		if (url) {
			updateItem(index, type, url);
		}
		setUploadingIcon(null);
	}

	return (
		<div>
			<div className='mb-6 flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold'>Послугии</h1>
					<p className='text-gray-600 dark:text-gray-400 mt-2'>
						Керування секціями послуг
					</p>
				</div>

				{services.length < 1 && (
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
					<CardHeader>
						<CardTitle>Нова секція послуг</CardTitle>
					</CardHeader>
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
									<Label>Елементи послуг</Label>
									<Button size='sm' onClick={addItem}>
										<Plus className='mr-2 h-3 w-3' />
										Додати елемент
									</Button>
								</div>

								<div className='space-y-4'>
									{formData.items.map((item, index) => (
										<Card key={index} className='p-4'>
											<div className='space-y-3'>
												<div className='flex items-center justify-between mb-2'>
													<span className='text-sm font-medium'>
														Елемент {index + 1}
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
													<Label htmlFor={`color-${index}`}>Колір</Label>
													<div className='flex gap-2'>
														<Input
															id={`color-${index}`}
															type='color'
															value={item.color}
															onChange={e =>
																updateItem(index, 'color', e.target.value)
															}
															className='w-20'
														/>
														<Input
															id={`color-text-${index}`}
															type='text'
															value={item.color}
															onChange={e =>
																updateItem(index, 'color', e.target.value)
															}
															placeholder='#000000'
															className='flex-1'
														/>
													</div>
												</div>

												<div>
													<Label htmlFor={`icon-default-${index}`}>
														Іконка (Default)
													</Label>
													<div className='flex gap-2 items-center'>
														<Input
															id={`icon-default-${index}`}
															type='file'
															accept='image/*'
															onChange={e => {
																const file = e.target.files?.[0];
																if (file)
																	handleIconUpload(index, file, 'icon_default');
															}}
															className='flex-1'
														/>
														{item.icon_default && (
															<Image
																width={40}
																height={40}
																src={item.icon_default}
																alt='default icon'
																className='size-10 object-contain'
															/>
														)}
													</div>
												</div>

												<div>
													<Label htmlFor={`icon-active-${index}`}>
														Іконка (Active)
													</Label>
													<div className='flex gap-2 items-center'>
														<Input
															id={`icon-active-${index}`}
															type='file'
															accept='image/*'
															onChange={e => {
																const file = e.target.files?.[0];
																if (file)
																	handleIconUpload(index, file, 'icon_active');
															}}
															className='flex-1'
														/>
														{item.icon_active && (
															<Image
																width={40}
																height={40}
																src={item.icon_active}
																alt='active icon'
																className='size-10 object-contain'
															/>
														)}
													</div>
												</div>

												<div>
													<Label htmlFor={`text-${index}`}>Опис</Label>
													<Input
														id={`text-${index}`}
														value={item.text}
														onChange={e =>
															updateItem(index, 'text', e.target.value)
														}
														placeholder='Введіть опис послуги'
													/>
												</div>
											</div>
										</Card>
									))}
									{formData.items.length === 0 && (
										<p className='text-sm text-gray-500 text-center py-4'>
											Немає елементів. Натисніть &quot;Додати елемент&quot;
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
					{services.map(service => (
						<Card key={service.id}>
							<CardContent className='pt-6'>
								{editingId === service.id ? (
									<div className='space-y-6'>
										<div>
											<Label htmlFor={`edit-section-title-${service.id}`}>
												Назва секції
											</Label>
											<Input
												id={`edit-section-title-${service.id}`}
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
												<Label>Елементи послуг</Label>
												<Button size='sm' onClick={addItem}>
													<Plus className='mr-2 h-3 w-3' />
													Додати елемент
												</Button>
											</div>

											<div className='space-y-4'>
												{formData.items.map((item, index) => (
													<Card key={index} className='p-4'>
														<div className='space-y-3'>
															<div className='flex items-center justify-between mb-2'>
																<span className='text-sm font-medium'>
																	Елемент {index + 1}
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
																	htmlFor={`edit-color-${service.id}-${index}`}
																>
																	Колір
																</Label>
																<div className='flex gap-2'>
																	<Input
																		id={`edit-color-${service.id}-${index}`}
																		type='color'
																		value={item.color}
																		onChange={e =>
																			updateItem(index, 'color', e.target.value)
																		}
																		className='w-20'
																	/>
																	<Input
																		id={`edit-color-text-${service.id}-${index}`}
																		type='text'
																		value={item.color}
																		onChange={e =>
																			updateItem(index, 'color', e.target.value)
																		}
																		placeholder='#000000'
																		className='flex-1'
																	/>
																</div>
															</div>

															<div>
																<Label
																	htmlFor={`edit-icon-default-${service.id}-${index}`}
																>
																	Іконка (Default)
																</Label>
																<div className='flex gap-2 items-center'>
																	<Input
																		id={`edit-icon-default-${service.id}-${index}`}
																		type='file'
																		accept='image/*'
																		onChange={e => {
																			const file = e.target.files?.[0];
																			if (file)
																				handleIconUpload(
																					index,
																					file,
																					'icon_default',
																				);
																		}}
																		className='flex-1'
																	/>
																	{item.icon_default && (
																		<Image
																			width={40}
																			height={40}
																			src={item.icon_default}
																			alt='default icon'
																			className='size-10 object-contain'
																		/>
																	)}
																</div>
															</div>

															<div>
																<Label
																	htmlFor={`edit-icon-active-${service.id}-${index}`}
																>
																	Іконка (Active)
																</Label>
																<div className='flex gap-2 items-center'>
																	<Input
																		id={`edit-icon-active-${service.id}-${index}`}
																		type='file'
																		accept='image/*'
																		onChange={e => {
																			const file = e.target.files?.[0];
																			if (file)
																				handleIconUpload(
																					index,
																					file,
																					'icon_active',
																				);
																		}}
																		className='flex-1'
																	/>
																	{item.icon_active && (
																		<Image
																			src={item.icon_active}
																			alt='active icon'
																			width={40}
																			height={40}
																			className='size-10 object-contain'
																		/>
																	)}
																</div>
															</div>

															<div>
																<Label
																	htmlFor={`edit-text-${service.id}-${index}`}
																>
																	Опис
																</Label>
																<Input
																	id={`edit-text-${service.id}-${index}`}
																	value={item.text}
																	onChange={e =>
																		updateItem(index, 'text', e.target.value)
																	}
																	placeholder='Введіть опис послуги'
																/>
															</div>
														</div>
													</Card>
												))}
											</div>
										</div>

										<div className='flex gap-2'>
											<Button onClick={() => handleUpdate(service.id)}>
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
											<h3 className='text-xl font-semibold mb-4'>
												{service.section_title}
											</h3>
											<div className='space-y-3'>
												{service.items.map((item, index) => (
													<div
														key={index}
														className='flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'
													>
														<div
															className='w-4 h-4 rounded-full mt-1 flex-shrink-0'
															style={{ backgroundColor: item.color }}
														/>
														<div className='flex gap-2 flex-shrink-0'>
															{item.icon_default && (
																<div className='text-center'>
																	<Image
																		width={32}
																		height={32}
																		src={item.icon_default}
																		alt='default icon'
																		className='size-8 object-contain'
																	/>
																	<span className='text-xs text-gray-500'>
																		default
																	</span>
																</div>
															)}
															{item.icon_active && (
																<div className='text-center'>
																	<Image
																		width={32}
																		height={32}
																		src={item.icon_active}
																		alt='active icon'
																		className='size-8 object-contain'
																	/>
																	<span className='text-xs text-gray-500'>
																		active
																	</span>
																</div>
															)}
														</div>
														<div className='flex-1'>
															<p className='text-gray-600 dark:text-gray-400'>
																{item.text}
															</p>
															<p className='text-xs text-gray-500 mt-1'>
																Колір: {item.color}
															</p>
														</div>
													</div>
												))}
											</div>
										</div>
										<div className='flex gap-2 ml-4'>
											<Button
												variant='outline'
												size='sm'
												onClick={() => startEdit(service)}
												disabled={isAdding || editingId !== null}
											>
												<Edit className='h-4 w-4' />
											</Button>
											<Button
												variant='destructive'
												size='sm'
												onClick={() => handleDelete(service.id)}
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
					{services.length === 0 && (
						<div className='text-center py-8 text-gray-500'>
							Немає секцій. Додайте першу!
						</div>
					)}
				</div>
			)}
		</div>
	);
}
