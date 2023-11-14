import { useMemo, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { useMutation, useQuery } from '@apollo/client'

import { CREATE_CARD, DELETE_CARD, GET_CARDS, UPDATE_CARD } from '@/services'
import { CARD_STATUSES } from '@/constants'
import { CardDetails, CreateCardForm, DraggableCard, DroppableBoardColumn, EditCardForm } from '@/components'
import { sortCards } from '@/utils'

export const BoardPage = () => {
  const { loading, error, data } = useQuery(GET_CARDS)

  const [createCard] = useMutation(CREATE_CARD)
  const [updateCard] = useMutation(UPDATE_CARD)
  const [deleteCard] = useMutation(DELETE_CARD)

  const [showCreateNewCard, setShowCreateNewCard] = useState(false)
  const [shownCard, setShownCard] = useState()
  const [editCard, setEditCard] = useState()
  const [statusToSortByMap, setStatusToSortByMap] = useState()

  const cards = data ? data.cards : null

  const statusToCardsMap = useMemo(() => {
    if (!cards) {
      return null
    }

    return cards.reduce((acc, card) => {
      const status = card.status

      if (!acc[status]) {
        acc[status] = []
      }

      acc[status].push(card)

      return acc
    }, {})
  }, [cards])

  const statusToCardsMapSorted = useMemo(() => {
    if (!statusToCardsMap) {
      return null
    }

    const out = {}

    for (const status in statusToCardsMap) {
      const sortBy = statusToSortByMap?.[status]

      out[status] = sortCards(statusToCardsMap[status], sortBy)
    }

    return out
  }, [statusToSortByMap, statusToCardsMap])

  const handleClickCloseCreateNewCard = () => {
    setShowCreateNewCard(false)
  }

  const handleCreateCard = async ({ title, description, status }) => {
    await createCard({
      variables: {
        title,
        description,
        status,
      },
      update: (cache, { data: { createCard } }) => {
        const { cards } = cache.readQuery({ query: GET_CARDS })
        cache.writeQuery({
          query: GET_CARDS,
          data: { cards: [...cards, createCard.card] },
        })
      }
    })
  }

  const updateCardById = (id, newCardValues) => {
    updateCard({
      variables: {
        id,
        ...newCardValues,
      },
      update: (cache, { data: { updateCard } }) => {
        const { cards } = cache.readQuery({ query: GET_CARDS })

        const updatedCards = cards.map((card) => {
          if (card.id === id) {
            return updateCard.card
          }

          return card
        })

        cache.writeQuery({
          query: GET_CARDS,
          data: { cards: updatedCards },
        })
      },
    })
  }

  const updateCardStatusById = async (id, status) => {
    const card = cards.find((card) => card.id === id)
    updateCardById(id, {
      title: card.title,
      description: card.description,
      status
    })
  }

  const handleEditCardSubmit = async (card) => {
    await updateCardById(card.id, card)
    setEditCard(null)

    if (shownCard) {
      setShownCard({ ...shownCard, ...card })
    }
  }

  const handleClickCloseCardDetails = () => {
    setShownCard(null)
  }

  const handleClickEditCard = (card) => {
    setEditCard(card)
  }

  const handleCancelEditCard = () => {
    setEditCard(null)
  }

  const handleClickCreateNewCard = () => {
    setShowCreateNewCard(true)
    setShownCard(null)
    setEditCard(null)
  }

  const handleClickDeleteCard = async (card) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this card?')

    if (confirmDelete) {
      await deleteCard({
        variables: {
          id: card.id,
        },
        update: (cache, { data: { deleteCard } }) => {
          const { cards } = cache.readQuery({ query: GET_CARDS })
          const cardId = deleteCard?.card?.id

          if (!cardId) {
            return
          }

          const updatedCards = cards.filter((card) => card.id !== cardId)

          cache.writeQuery({
            query: GET_CARDS,
            data: { cards: updatedCards },
          })
        },
      })

      if (shownCard?.id === card.id) {
        setShownCard(null)
      }
    }
  }

  const handleClickCardDetails = (card) => {
    setShownCard(card)
    setEditCard(null)
    setShowCreateNewCard(false)
  }

  const handleChangeSortByForColumn = (status, sortBy) => {
    setStatusToSortByMap({
      ...statusToSortByMap,
      [status]: sortBy,
    })
  }


  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    const source = result.source
    const destination = result.destination

    if (source.droppableId !== destination.droppableId) {
      updateCardStatusById(result.draggableId, destination.droppableId)
    }
  }


  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  return (
    <div className="p-6 h-full">

      <div className="container mx-auto p-8 h-full">
        <div className="grid grid-cols-2 mb-4">
          <h1 className="text-2xl font-bold mb-4">Mini Trello/Kanban</h1>
          <button
            type="button"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded justify-self-end"
            onClick={handleClickCreateNewCard}
          >Create new card
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8 h-full">
          <div
            className="col-span-8 md:col-span-8 lg:col-span-8 xl:col-span-8 bg-white p-4 rounded shadow grid grid-cols-3 gap-3">
            <DragDropContext onDragEnd={onDragEnd}>
              {
                CARD_STATUSES.map((status) => {
                  return (
                    <DroppableBoardColumn
                      key={status}
                      droppableId={status}
                      status={status}
                      onChangeSortBy={handleChangeSortByForColumn}
                    >
                      {
                        statusToCardsMapSorted?.[status]
                          ? statusToCardsMapSorted[status].map((card, index) => (
                            <DraggableCard
                              key={card.id}
                              index={index}
                              draggableId={card.id}
                              card={card}
                              onClickCardDetails={handleClickCardDetails}
                            />
                          ))
                          : null
                      }
                    </DroppableBoardColumn>
                  )
                })
              }
            </DragDropContext>
          </div>

          <div className="col-span-8 md:col-span-4 lg:col-span-4 xl:col-span-4 bg-white p-4 rounded shadow">
            {
              shownCard && !editCard && (
                <CardDetails
                  card={shownCard}
                  onClose={handleClickCloseCardDetails}
                  onEdit={handleClickEditCard}
                  onDelete={handleClickDeleteCard}
                />
              )
            }
            {
              editCard && (
                <EditCardForm
                  card={editCard}
                  onSubmit={handleEditCardSubmit}
                  onCancel={handleCancelEditCard}
                />
              )
            }
            {
              showCreateNewCard && (
                <CreateCardForm
                  onClose={handleClickCloseCreateNewCard}
                  onSubmit={handleCreateCard}
                />
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}
