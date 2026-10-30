import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import { type FilterItem, FilterType } from '../../../shared/api/types/Filter'
import type { SearchRequestFilter } from '../../../shared/api/types/SearchRequest/SearchRequestFilter'
import { useFilterStore } from '../../../shared/store/filterStore'
import filterData from '../../../shared/temp/filterData.json'

export const App = () => {
	const [draft, setDraft] = useState<SearchRequestFilter>([])
	const { t } = useTranslation('filter')
	const [isOpen, setIsOpen] = useState(false)
	const selectedFilters = useFilterStore(state => state.selectedFilters)
	const setSelectedFilters = useFilterStore(state => state.setSelectedFilters)
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)

	const { data } = useQuery({
		queryKey: ['filters'],
		queryFn: async () => filterData.filterItems as unknown as FilterItem[]
	})

	const openModal = () => {
		setDraft(selectedFilters)
		setIsOpen(true)
	}

	const confirmApply = () => {
		setSelectedFilters(draft)
		setIsConfirmOpen(false)
		setIsOpen(false)
	}

	const cancelApply = () => {
		setIsConfirmOpen(false)
		setIsOpen(false)
	}

	const toggleOption = (groupId: string, optionId: string) => {
		setDraft(prev => {
			const currentGroup = prev.find(group => group.id === groupId)

			if (!currentGroup) {
				return [
					...prev,
					{ id: groupId, type: FilterType.OPTION, optionsIds: [optionId] }
				]
			}

			const newOptionsIds = currentGroup.optionsIds.includes(optionId)
				? currentGroup.optionsIds.filter(id => id !== optionId)
				: [...currentGroup.optionsIds, optionId]

			if (newOptionsIds.length === 0) {
				return prev.filter(group => group.id !== groupId)
			}

			return prev.map(group =>
				group.id === groupId ? { ...group, optionsIds: newOptionsIds } : group
			)
		})
	}

	return (
		<section className="w-full min-h-dvh p-8">
			<button
				onClick={openModal}
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
											<input
												type="checkbox"
												checked={
													draft
														.find(group => group.id === item.id)
														?.optionsIds.includes(option.id) ?? false
												}
												onChange={() => toggleOption(item.id, option.id)}
											/>
											{option.name}
										</label>
									))}
								</fieldset>
							))}
						</form>
						<div className="mt-4 flex gap-2">
							<button
								type="button"
								onClick={() => setIsConfirmOpen(true)}
								className="bg-blue-600 text-white px-4 py-2 rounded"
							>
								{t('apply')}
							</button>
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

			{isConfirmOpen && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center">
					<div className="bg-white p-6 rounded-lg w-80">
						<p className="mb-4">{t('confirmQuestion')}</p>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={cancelApply}
								className="border px-4 py-2 rounded"
							>
								{t('useOldFilter')}
							</button>
							<button
								type="button"
								onClick={confirmApply}
								className="bg-orange-500 text-white px-4 py-2 rounded"
							>
								{t('applyNewFilter')}
							</button>
						</div>
					</div>
				</div>
			)}

			<pre className="mt-6 bg-gray-900 text-green-400 p-4 rounded text-sm">
				{JSON.stringify(selectedFilters, null, 2)}
			</pre>
		</section>
	)
}
