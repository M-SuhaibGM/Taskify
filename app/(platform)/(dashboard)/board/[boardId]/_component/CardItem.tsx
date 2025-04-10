"use client"

import { Card } from '@prisma/client';
import { Draggable } from '@hello-pangea/dnd';
import { Dialog, DialogTrigger, DialogHeader, DialogClose, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlignLeft, Layout, Loader2, Copy, Trash } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useState, useRef } from 'react'; // Import useRef
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface CardItempROPS {
    index: number;
    data: Card;
    listName: string;
}

const CardItem = ({ index, data, listName }: CardItempROPS) => {
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [description, setDescription] = useState(data.description);
    const router = useRouter();
    const dialogCloseRef = useRef<HTMLButtonElement>(null); // Ref to close the dialog

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.put(`/api/list/${data.id}/card`, { description });
            if (response.status === 200) {
                setEditing(false);
                router.refresh();
                toast.success("Card description updated successfully");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(description || "");
        toast.success("Description copied to clipboard");
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(`/api/list/${data.id}/card`);
            if (response.status === 200) {
                router.refresh();
                toast.success("Card deleted successfully");
                // Close the dialog after successful deletion
                if (dialogCloseRef.current) {
                    dialogCloseRef.current.click();
                }
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Draggable key={data.id} draggableId={data.id} index={index}>
            {(provided) => (
                <Dialog>
                    <DialogTrigger>
                        <div
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            role='button'
                            className='truncate border-2 border-transparent flex justify-start items-start hover:border-black py-2 px-3 text-sm bg-white rounded-sm shadow-sm'
                        >
                            {data.title}
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className='flex gap-2'>
                                <Layout className='h-5 w-5 text-neutral-700' />
                                <div className='flex flex-col gap-1'>
                                    {data.title}
                                    <p className='text-sm text-muted-foreground'>
                                         in list <span className='underline'>{listName}</span>
                                    </p>
                                </div>
                            </DialogTitle>
                            <DialogDescription>
                                <div className='flex items-center gap-4 mt-5 mb-2'>
                                    <AlignLeft className='h-5 w-5 text-neutral-700' />
                                    <p className='font-semibold text-neutral-700'>Description</p>
                                </div>
                                {editing ? (
                                    <form onSubmit={handleSubmit}>
                                        <div className='flex flex-col gap-4'>
                                            <Textarea
                                                value={description || ""}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder='Enter the card description...'
                                                className='bg-white rounded-md px-3.5 min-h-[78px] text-sm font-medium py-3 border-2'
                                            />
                                            <div className='flex gap-3'>
                                                <Button variant='outline' onClick={() => setEditing(false)}>Cancel</Button>
                                                <Button disabled={loading} type="submit">
                                                    Submit{loading && <Loader2 className='animate-spin h-4 w-4' />}
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <div onClick={() => setEditing(true)} className='bg-neutral-200 rounded-md px-3.5 min-h-[78px] text-sm font-medium py-3'>
                                        {data.description || "Enter the card description..."}
                                    </div>
                                )}
                                <div className='flex gap-2 mt-4'>
                                    <Button variant="outline" onClick={handleCopy}>
                                        <Copy className='h-4 w-4 mr-2' />
                                        Copy Description
                                    </Button>
                                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                                        <Trash className='h-4 w-4 mr-2' />
                                        Delete Card
                                    </Button>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogClose ref={dialogCloseRef} className="hidden" />
                    </DialogContent>
                </Dialog>
            )}
        </Draggable>
    );
};

export default CardItem;