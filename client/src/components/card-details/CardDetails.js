export const CardDetails = ({ card, onClose, onEdit, onDelete, }) => {
  const handleClose = () => onClose()
  const handleEdit = () => onEdit(card)
  const handleDelete = () => onDelete(card)

  return (
    <div className="max-w-md mx-auto">
      <div className="grid grid-cols-2 mb-4">
        <h1 className="text-2xl font-bold">Card Details</h1>
        <button
          type="button"
          className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-1 px-2 rounded justify-self-end"
          onClick={handleClose}
        >Close
        </button>
      </div>

      <h1 className="text-xl font-bold">{card.title}</h1>

      <p className="text-gray-700 text-sm mb-4">{card.description}</p>

      <span
        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
      >{card.status}</span>

      <div className="grid grid-cols-2 gap-2 justify-end">
        <button
          type="button"
          className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-1 px-2 rounded"
          onClick={handleEdit}
        >Edit
        </button>
        <button
          type="button"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          onClick={handleDelete}
        >Delete
        </button>
      </div>
    </div>
  )
}
