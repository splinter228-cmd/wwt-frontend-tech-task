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

	const clearAll = () => setDraft([])

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
		<section className="flex min-h-dvh w-full items-center justify-center p-8">
			<button
				onClick={openModal}
				className="rounded-lg bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600"
			>
				{t('openFilters')}
			</button>

			{isOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
					<div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
						<div className="relative flex items-center justify-center border-b px-6 py-4">
							<h2 className="text-lg font-semibold">{t('title')}</h2>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								aria-label={t('close')}
								className="absolute right-6 text-gray-400 hover:text-gray-600"
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
								>
									<path
										d="M5 5l10 10M15 5L5 15"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
									/>
								</svg>
							</button>
						</div>

						<form className="flex-1 overflow-y-auto px-6 py-4">
							{data?.map(item => (
								<fieldset
									key={item.id}
									className="mb-6 border-b pb-4 last:mb-0 last:border-b-0 last:pb-0"
								>
									<legend className="mb-2 font-semibold">{item.name}</legend>
									<div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
										{item.options.map(option => (
											<label
												key={option.id}
												className="flex items-center gap-2 text-sm"
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
									</div>
								</fieldset>
							))}
						</form>

						<div className="relative flex items-center justify-center border-t px-6 py-4">
							<button
								type="button"
								onClick={() => setIsConfirmOpen(true)}
								className="rounded-lg bg-orange-500 px-10 py-2 font-medium text-white hover:bg-orange-600"
							>
								{t('apply')}
							</button>
							<button
								type="button"
								onClick={clearAll}
								className="absolute right-6 text-sm text-blue-600 underline hover:text-blue-800"
							>
								{t('clearAll')}
							</button>
						</div>
					</div>
				</div>
			)}

			{isConfirmOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
					<div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
						<div className="mb-6 flex items-start justify-between">
							<p className="font-medium">{t('confirmQuestion')}</p>
							<button
								type="button"
								onClick={cancelApply}
								aria-label={t('close')}
								className="text-gray-400 hover:text-gray-600"
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
								>
									<path
										d="M5 5l10 10M15 5L5 15"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
									/>
								</svg>
							</button>
						</div>
						<div className="flex justify-center gap-3">
							<button
								type="button"
								onClick={cancelApply}
								className="rounded-lg border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50"
							>
								{t('useOldFilter')}
							</button>
							<button
								type="button"
								onClick={confirmApply}
								className="rounded-lg bg-orange-500 px-6 py-2 font-medium text-white hover:bg-orange-600"
							>
								{t('applyNewFilter')}
							</button>
						</div>
					</div>
				</div>
			)}

			<pre className="fixed bottom-4 left-4 max-h-40 overflow-auto rounded bg-gray-900 p-3 text-xs text-green-400">
				{JSON.stringify(selectedFilters, null, 2)}
			</pre>
		</section>
	)
}
