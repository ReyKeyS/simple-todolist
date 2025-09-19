'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Priority } from '@prisma/client';
import { toast } from "sonner";

interface Event {
    id?: number;
    title?: string | null;
    description?: string | null;
    priority?: Priority;
    start?: Date;
    complete?: boolean;
}
interface EditTodoDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    event: Event | null;
    onTodoUpdated: () => void;
}

export function EditTodoDialog({ isOpen, onOpenChange, event, onTodoUpdated }: EditTodoDialogProps) {
    const [title, setTitle] = useState(event?.title || '');
    const [description, setDescription] = useState(event?.description || '');
    const [priority, setPriority] = useState<Priority>(event?.priority || 'MEDIUM');
    const [complete, setComplete] = useState(event?.complete || false);

    useEffect(() => {
        setTitle(event?.title || '');
        setDescription(event?.description || '');
        setPriority(event?.priority || 'MEDIUM')
        setComplete(event?.complete || false);
    }, [event]);

    const handleUpdate = async () => {
        if (!event?.id) return;
        try {
            await fetch(`/api/todos/${event.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, priority, complete }),
            });
            toast.success("Task Updated", { description: "Your changes have been saved." });
            onTodoUpdated();
        } catch (error) {
            toast.error("Update Failed", { description: "Failed to update the task." });
        }
    };

    const handleDelete = async () => {
        if (!event?.id) return;
        try {
            await fetch(`/api/todos/${event.id}`, {
                method: 'DELETE',
            });
            toast.success("Task Deleted", { description: "The task has been permanently removed." });
            onTodoUpdated();
        } catch (error) {
            toast.error("Delete Failed", { description: "Failed to delete the task." });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit To-Do</DialogTitle>
                    <DialogDescription>
                        Editing task for {event?.start ? format(event.start, 'PPP, h:mm a') : ''}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                    <Select onValueChange={(value: Priority) => setPriority(value)} defaultValue={priority}>
                        <SelectTrigger><SelectValue placeholder="Set priority" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="completed"
                            checked={complete}
                            onCheckedChange={(checked) => setComplete(Boolean(checked))}
                        />
                        <Label htmlFor="completed" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Mark as complete
                        </Label>
                    </div>
                </div>
                <DialogFooter className="flex justify-between w-full">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action is permanent and cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button onClick={handleUpdate}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}