import { CardForm } from '@/components'

export const CreateCardForm = ({ onClose, onSubmit }) => {
  const handleClose = () => onClose()

  return (
    <div className="max-w-md mx-auto">
      <div className="grid grid-cols-2 mb-4">
        <h1 className="text-2xl font-bold">Create New Card</h1>
        <button
          type="button"
          className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-1 px-2 rounded justify-self-end"
          onClick={handleClose}
        >Close
        </button>
      </div>

      <CardForm cleanOnSubmit onSubmit={onSubmit}>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
        >
          Create Card
        </button>
      </CardForm>
    </div>
  )
}
