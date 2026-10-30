import { useQuery } from '@tanstack/react-query'

import type { FilterItem } from '../../../shared/api/types/Filter'
import filterData from '../../../shared/temp/filterData.json'

export const App = () => {
	const { data } = useQuery({
		queryKey: ['filters'],
		queryFn: async () => filterData.filterItems as unknown as FilterItem[]
	})

	return (
		<section className="w-full min-h-dvh p-8">
			{data?.map(item => (
				<div
					key={item.id}
					className="mb-4"
				>
					<p className="font-semibold">{item.name}</p>
					<ul className="ml-4 text-gray-600">
						{item.options.map(option => (
							<li key={option.id}>{option.name}</li>
						))}
					</ul>
				</div>
			))}
		</section>
	)
}
