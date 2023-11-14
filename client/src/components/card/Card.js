import { forwardRef } from 'react'
import { formatTimestamp } from '@/utils'

export const Card = forwardRef(({ card, onClickCardDetails, rootProps }, ref) => {
  const handleClickCardDetails = () => {
    onClickCardDetails(card)
  }

  return (
    <div
      ref={ref}
      className="mb-4 p-2 bg-white rounded shadow cursor-pointer hover:bg-gray-300"
      {...rootProps}
      onClick={handleClickCardDetails}
    >
      <div className="max-w-md mx-auto rounded-md overflow-hidden">
        <div className="bg-gray-800 text-white p-4">
          <h2 className="text-xl font-semibold">{card.title}</h2>
        </div>
        <div className="bg-white p-4">
          <p className="text-sm font-bold text-gray-700">Description:</p>
          <p className="text-gray-700 line-clamp-3">{card.description}</p>
        </div>
        <div className="bg-gray-100 text-gray-700 p-2">
          <p className="text-sm font-bold">{formatTimestamp(card.createdAt)}</p>
        </div>
      </div>
    </div>
  )
})
