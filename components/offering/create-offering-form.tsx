'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const formSchema = z.object({
    title: z.string().min(10, 'Title must be at least 10 characters'),
    description: z.string().min(30, 'Description must be at least 30 characters'),
    category: z.string().min(1, 'Please select a category'),
    location: z.string().optional(),
    isVirtual: z.boolean(),
    hourlyRate: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
        message: 'If provided, hourly rate must be a positive number',
    }),
    availability: z.string().min(5, 'Please describe your availability'),
    skills: z.string().min(3, 'Please list at least one skill'),
});

type FormValues = z.infer<typeof formSchema>;

const CATEGORIES = [
    { id: 'plumbing', label: 'Plumbing' },
    { id: 'electrical', label: 'Electrical' },
    { id: 'carpentry', label: 'Carpentry' },
    { id: 'painting', label: 'Painting' },
    { id: 'cleaning', label: 'Cleaning' },
    { id: 'gardening', label: 'Gardening' },
    { id: 'moving', label: 'Moving' },
    { id: 'other', label: 'Other' },
];

interface CreateOfferingFormProps {
    userId: string;
}

export function CreateOfferingForm({ userId }: CreateOfferingFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [portfolioImages, setPortfolioImages] = useState<string[]>([]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            category: '',
            location: '',
            isVirtual: false,
            hourlyRate: '',
            availability: '',
            skills: '',
        },
    });

    const isVirtual = form.watch('isVirtual');

    async function onSubmit(values: FormValues) {
        if (!isVirtual && !values.location) {
            form.setError('location', {
                type: 'manual',
                message: 'Location is required for non-virtual services',
            });
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/offerings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    providerId: userId,
                    title: values.title,
                    description: values.description,
                    category: values.category,
                    location: values.location,
                    isVirtual: values.isVirtual,
                    hourlyRate: values.hourlyRate ? Math.round(Number(values.hourlyRate) * 100) : null, // Convert to cents or null
                    availability: values.availability,
                    skills: values.skills.split(',').map((s) => s.trim()).filter(Boolean),
                    portfolioImages,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to create offering');
            }

            toast.success('Service offering created successfully!');
            router.push('/browse?type=offerings');
        } catch (error) {
            console.error('Error creating offering:', error);
            toast.error('Failed to create service offering. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    // Mock image upload for demo
    const handleImageUpload = () => {
        const mockUrl = `https://picsum.photos/seed/${Date.now()}/400/300`;
        setPortfolioImages([...portfolioImages, mockUrl]);
    };

    const removeImage = (index: number) => {
        setPortfolioImages(portfolioImages.filter((_, i) => i !== index));
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>Service Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Experienced Plumber for Residential Repairs" {...field} />
                                </FormControl>
                                <FormDescription>
                                    A clear, professional title for your service.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe your experience, services offered, and what makes you unique..."
                                        className="min-h-[150px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="isVirtual"
                            render={({ field }: { field: any }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Virtual Service</FormLabel>
                                        <FormDescription>
                                            Check this if your service can be performed remotely (e.g., consulting, design).
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {!isVirtual && (
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Milano, Italy" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            The primary area where you offer your services.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="hourlyRate"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Hourly Rate ($) (Optional)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="50" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="availability"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Availability</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Weekends, Evenings, Mon-Fri 9-5" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Skills</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Pipe fitting, Leak repair, Water heater installation" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Comma-separated list of specific skills.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4">
                        <FormLabel>Portfolio Images</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {portfolioImages.map((url, index) => (
                                <div key={index} className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                    <img src={url} alt={`Portfolio ${index + 1}`} className="object-cover w-full h-full" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleImageUpload}
                                className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed hover:border-primary hover:bg-accent/50 transition-colors"
                            >
                                <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Add Image</span>
                            </button>
                        </div>
                        <FormDescription>
                            Add photos of your past work to build trust.
                        </FormDescription>
                    </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Offering...
                        </>
                    ) : (
                        'Publish Service Offering'
                    )}
                </Button>
            </form>
        </Form>
    );
}
