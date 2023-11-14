import { Droppable } from 'react-beautiful-dnd'
import { BoardColumn } from '@/components'

export const DroppableBoardColumn = ({ droppableId, status, onChangeSortBy, children }) => {
  return (
    <BoardColumn status={status} onChangeSortBy={onChangeSortBy}>
      <Droppable droppableId={droppableId}>
        {
          (provided) => (
            <div ref={provided.innerRef} style={{ height: '100%' }} {...provided.droppableProps}>
              {children}
            </div>
          )
        }
      </Droppable>
    </BoardColumn>
  )
}