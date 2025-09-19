// src/components/AddTodoDialog.tsx
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Priority } from '@prisma/client';

interface AddTodoDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedDate: Date | null;
    onTodoAdded: () => void;
}

export function AddTodoDialog({ isOpen, onOpenChange, selectedDate, onTodoAdded }: AddTodoDialogProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>('MEDIUM');
    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPriority('MEDIUM');
    }

    const handleSubmit = async () => {
        if (!title || !selectedDate) {
            toast.error("Validation Error", { description: "Title and time are required." });
            return;
        }
        setIsLoading(true)

        try {
            const res = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    priority,
                    dueDate: selectedDate,
                }),
            });
            if (res.ok) {
                toast.success("Task Added", { description: "Your new task has been saved successfully." });
                resetForm();
                onTodoAdded();
            } else {
                throw new Error('Failed to add To-Do.')
            }
        } catch (error) {
            toast.error("Request Failed", { description: "Something went wrong. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add To-Do</DialogTitle>
                    <DialogDescription>
                        Create a new task for {selectedDate ? format(selectedDate, 'PPP, h:mm a') : ''}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input id="title" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <Textarea id="description" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <Select onValueChange={(value: Priority) => setPriority(value)} defaultValue={priority}>
                        <SelectTrigger><SelectValue placeholder="Set priority" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Task"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}