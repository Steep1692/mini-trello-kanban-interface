import { Draggable } from 'react-beautiful-dnd'
import { Card } from '@/components'

export const DraggableCard = ({ index, draggableId, card, onClickCardDetails }) => {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided) => {
        return (
          <Card
            data-testid={card.id}
            data-index={index}
            key={card.id}
            ref={provided.innerRef}
            card={card}
            onClickCardDetails={onClickCardDetails}
            rootProps={{...provided.draggableProps, ...provided.dragHandleProps}}
          />
        )
      }}
    </Draggable>
  )
}
