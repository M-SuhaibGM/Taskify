import { ListWithCards } from "@/types"
import ListHeader from "./ListHeader";
import CardForm from "./CardForm";
import { cn } from "@/lib/utils";
import CardItem from "./CardItem";
import { Draggable, Droppable } from "@hello-pangea/dnd";
interface ListItemProps {
    data: ListWithCards;
    index: number;
}
const ListItem = ({ data, index }: ListItemProps) => {

    return (
        <Draggable key={data.id} draggableId={data.id} index={index}>
            {(provided) => (
                <li
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className="shrink-0 h-full w-[272px] my-2 select-none">
                    <div
                        {...provided.dragHandleProps}
                        className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
                        <ListHeader data={data} />
                        <Droppable droppableId={data.id} type="card">
                            {(provided) => (
                                <ol
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={cn("mx-1 px-1 py-0.5 flex flex-col gap-y-2", data.cards?.length > 0 ? "mt-2" : "mt-0")}>
                                    {data.cards?.map((card, index) => (
                                        <CardItem index={index}
                                            key={card.id}
                                            data={card}
                                            listName={data.title}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </ol>
                            )}
                        </Droppable>
                        <CardForm id={data.id} />
                    </div>
                </li>
            )}
        </Draggable>
    )
}

export default ListItem