'use client'

import { useState } from 'react'
import { createSlice } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { PlusCircle } from 'lucide-react'
import { toast } from 'sonner'

export function AddSliceDialog({ requestId }: { requestId: string }) {
    const [open, setOpen] = useState(false)

    async function handleSubmit(formData: FormData) {
        try {
            await createSlice(requestId, formData)
            setOpen(false)
            toast.success('Slice added successfully! Ottimo lavoro!')
        } catch {
            toast.error('Failed to add slice')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-orange-600 hover:bg-orange-700">
                    <PlusCircle className="h-4 w-4" />
                    Add Service Slice
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a Service Slice</DialogTitle>
                    <DialogDescription>
                        Break down this request into a smaller, actionable task.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Slice Title</Label>
                        <Input id="title" name="title" placeholder="e.g. Remove old faucet" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="Details about this specific task..." required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="estimatedEffort">Estimated Effort</Label>
                        <Input id="estimatedEffort" name="estimatedEffort" placeholder="e.g. 2 hours, 1 person" required />
                    </div>
                    <Button type="submit" className="w-full">Create Slice</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
