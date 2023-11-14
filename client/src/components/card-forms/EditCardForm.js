import { CardForm } from '@/components'

export const EditCardForm = ({ card, onSubmit, onCancel }) => {
  const handleSubmit = (newValues) => {
    onSubmit({
      id: card.id,
      ...newValues,
    })
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Edit Card</h1>

      <CardForm defaultValues={card} onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-2 justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
          >Save
          </button>
          <button
            type="button"
            className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-1 px-2 rounded"
            onClick={onCancel}
          >Cancel
          </button>
        </div>
      </CardForm>
    </div>
  )
}
