export const CARDS_SORT_BY = {
  CREATED_AT: 'createdAt',
  TITLE: 'title',
}

export const CARDS_SORTS_BY = Object.values(CARDS_SORT_BY)

export const DEFAULT_CARDS_SORT_BY = CARDS_SORT_BY.CREATED_AT

export const sortCards = (cards, sortBy = DEFAULT_CARDS_SORT_BY) => {
  return [...cards].sort((a, b) => {
    if (sortBy === CARDS_SORT_BY.TITLE) {
      return a.title.localeCompare(b.title)
    }

    if (sortBy === CARDS_SORT_BY.CREATED_AT) {
      return b.createdAt - a.createdAt
    }

    return a.id - b.id
  })
}