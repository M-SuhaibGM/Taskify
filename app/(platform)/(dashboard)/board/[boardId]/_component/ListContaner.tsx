"use client"
import { ListWithCards } from "@/types";
import ListForm from "./ListForm";
import { useState, useEffect } from "react";
import ListItem from "./ListItem";
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import axios from "axios";
import { toast } from "sonner";
interface ListContanerProps {
    data: ListWithCards[];
    boardId: string
}

const ListContaner = ({ data, boardId }: ListContanerProps) => {
    const [orderedData, setorderedData] = useState(data);
    useEffect(() => {
        setorderedData(data)
    }, [data])

    function reorder<T>(list: T[], startIndex: number, endIndex: number) {
        const resut = Array.from(list);
        const [removed] = resut.splice(startIndex, 1);
        resut.splice(endIndex, 0, removed);
        return resut;
    };



    const onDragEnd = async (result: any) => {
        const { destination, source, type } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (type === "list") {
            const items = reorder(
                orderedData,
                source.index,
                destination.index
            ).map((item, index) => ({ ...item, order: index }));

            setorderedData(items);

            // Send request to backend to update list order
            try {
                await axios.put(`/api/boards/${boardId}/lists/reorder`, { lists: items });
                toast.success("List reoder Successfull")
            } catch (error) {
                console.error("Failed to reorder lists:", error);
            }
        }

        if (type === "card") {
            let newOrdedData = [...orderedData];
            const sourceList = newOrdedData.find(list => list.id === source.droppableId);
            const destinationList = newOrdedData.find(list => list.id === destination.droppableId);

            if (!sourceList || !destinationList) return;

            if (!sourceList.cards) sourceList.cards = [];
            if (!destinationList.cards) destinationList.cards = [];

            if (source.droppableId === destination.droppableId) {
                const reorderdCards = reorder(sourceList.cards, source.index, destination.index);
                reorderdCards.forEach((card, idx) => {
                    card.order = idx;
                });

                sourceList.cards = reorderdCards;
                setorderedData(newOrdedData);

                // Send request to backend to update card order within the same list
                try {
                    await axios.put(`/api/list/${source.droppableId}/card/reorder`, { cards: reorderdCards });
                    toast.success("Card reoder Successfull")
                } catch (error) {
                    console.error("Failed to reorder cards:", error);

                }
            } else {
                const [moveCard] = sourceList.cards.splice(source.index, 1);
                moveCard.listId = destination.droppableId;
                destinationList.cards.splice(destination.index, 0, moveCard);

                sourceList.cards.forEach((card, idx) => {
                    card.order = idx;
                });

                destinationList.cards.forEach((card, idx) => {
                    card.order = idx;
                });

                setorderedData(newOrdedData);

                // Send request to backend to move card to another list
                try {
                    await axios.post(`/api/list/${moveCard.id}/card/reorder`, {
                        newListId: destination.droppableId,
                        newOrder: destination.index
                    });
                    toast.success("Card moved successfull")
                } catch (error) {
                    console.error("Failed to move card:", error);
                }
            }
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {(provided) => (
                    <ol {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex gap-x-3  flex-wrap  ">

                        {orderedData.map((list, index) => {
                            return (
                                <ListItem key={list.id} index={index} data={list} />
                            )
                        })}
                        {provided.placeholder}
                        <ListForm id={boardId} />
                        <div className="flex-shrink-0 w-1" />
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default ListContaner