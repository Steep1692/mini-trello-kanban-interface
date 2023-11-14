import { forwardRef } from 'react'

import { CARDS_SORT_BY, CARDS_SORTS_BY, DEFAULT_CARDS_SORT_BY } from '@/utils'

const SORT_BY_TO_NAME = {
  [CARDS_SORT_BY.CREATED_AT]: 'Created at',
  [CARDS_SORT_BY.TITLE]: 'Title',
}

export const BoardColumn = forwardRef(({ status, onChangeSortBy, children }, ref) => {
  const handleSortByChange = (e) => onChangeSortBy(status, e.target.value)

  return (
    <div ref={ref} className="col-span-1 bg-gray-100 p-4 flex flex-col">
      <div className="grid grid-cols-2 justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{status}</h2>
        <select
          id="sort-by"
          className="border border-gray-400 rounded-md px-2 py-1"
          defaultValue={DEFAULT_CARDS_SORT_BY}
          onChange={handleSortByChange}
        >
          {
            CARDS_SORTS_BY.map((sortBy) => (
              <option key={sortBy} value={sortBy}>{SORT_BY_TO_NAME[sortBy]}</option>
            ))
          }
        </select>
      </div>
      {children}
    </div>
  )
})
