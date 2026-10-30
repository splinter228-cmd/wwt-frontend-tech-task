import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import type { FilterItem } from '../../../shared/api/types/Filter'
import filterData from '../../../shared/temp/filterData.json'

export const App = () => {
	const { t } = useTranslation('filter')
	const [isOpen, setIsOpen] = useState(false)

	const { data } = useQuery({
		queryKey: ['filters'],
		queryFn: async () => filterData.filterItems as unknown as FilterItem[]
	})

	return (
		<section className="w-full min-h-dvh p-8">
			<button
				onClick={() => setIsOpen(true)}
				className="bg-blue-600 text-white px-4 py-2 rounded"
			>
				{t('openFilters')}
			</button>

			{isOpen && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
					<div className="bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
						<h2 className="text-xl font-bold mb-4">{t('title')}</h2>
						<form>
							{data?.map(item => (
								<fieldset
									key={item.id}
									className="mb-4"
								>
									<legend className="font-semibold">{item.name}</legend>
									{item.options.map(option => (
										<label
											key={option.id}
											className="flex items-center gap-2"
										>
											<input type="checkbox" />
											{option.name}
										</label>
									))}
								</fieldset>
							))}
						</form>
						<div className="mt-4">
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="bg-gray-300 px-4 py-2 rounded"
							>
								{t('close')}
							</button>
						</div>
					</div>
				</div>
			)}
		</section>
	)
}
