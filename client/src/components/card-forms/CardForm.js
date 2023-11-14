import { useState } from 'react'
import { CARD_STATUSES, DEFAULT_CARD_STATUS } from '@/constants'

export const CardForm = ({ cleanOnSubmit, defaultValues, onSubmit, children, }) => {
  const [title, setTitle] = useState(defaultValues?.title || '')
  const [description, setDescription] = useState(defaultValues?.description || '')
  const [status, setStatus] = useState(defaultValues?.status || DEFAULT_CARD_STATUS)

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value)
  }

  const handleStatusChange = (e) => {
    setStatus(e.target.value)
  }

  const cleanForm = () => {
    setTitle('')
    setDescription('')
    setStatus(DEFAULT_CARD_STATUS)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    onSubmit({ title, description, status })

    if (cleanOnSubmit) {
      cleanForm()
    }
  }

  return (
    <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
      <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
        Title
      </label>
      <input
        type="text"
        id="title"
        name="title"
        value={title}
        onChange={handleTitleChange}
        className="w-full border border-gray-300 p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
        placeholder="Enter title"
      />

      <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
        Description
      </label>
      <textarea
        id="description"
        name="description"
        value={description}
        onChange={handleDescriptionChange}
        rows="4"
        className="w-full border border-gray-300 p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
        placeholder="Enter description"
      />

      <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
        Status
      </label>
      <select
        id="status"
        name="status"
        value={status}
        onChange={handleStatusChange}
        className="w-full border border-gray-300 p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
      >
        {
          CARD_STATUSES.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))
        }
      </select>

      {children}
    </form>
  )
}
