'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { Loader2, Upload, X, Calendar, Users, Zap, BrainCircuit, TrendingDown, Sparkles } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { PricingGuidance } from './pricing-guidance';
import { LocationInput } from '@/components/forms/location-input';

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
    locationDetails: z.any().optional(),

    // V2 Fields
    calendarSyncUrl: z.string().url('Must be a valid URL (iCal/WebCal)').optional().or(z.literal('')),
    minParticipants: z.string().optional(),
    maxParticipants: z.string().optional(),
    pricingStrategy: z.enum(['standard', 'distressed', 'early_bird']),
    initialQuestions: z.string().optional(), // Input as multiline string
    instantBookingEnabled: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const CATEGORIES = [
    { id: 'experiences', label: 'Experiences & Events' },
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
    const t = useTranslations('createOffering');
    const tFilter = useTranslations('filters');
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
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
            calendarSyncUrl: '',
            minParticipants: '1',
            maxParticipants: '',
            pricingStrategy: 'standard',
            initialQuestions: '',
            instantBookingEnabled: false,
        },
    });

    const isVirtual = form.watch('isVirtual');
    const category = form.watch('category');
    const hourlyRate = form.watch('hourlyRate');
    const pricingStrategy = form.watch('pricingStrategy');

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
            // Process V2 fields
            const aiInterviewerConfig = values.initialQuestions
                ? { mode: 'dynamic', initial_questions: values.initialQuestions.split('\n').filter(Boolean) }
                : null;

            const minParticipants = values.minParticipants ? parseInt(values.minParticipants) : 1;
            const maxParticipants = values.maxParticipants ? parseInt(values.maxParticipants) : null;

            const res = await fetch('/api/offerings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    providerId: userId,
                    title: values.title,
                    description: values.description,
                    category: values.category,
                    location: values.location,
                    locationDetails: values.locationDetails,
                    isVirtual: values.isVirtual,
                    hourlyRate: values.hourlyRate ? Math.round(Number(values.hourlyRate) * 100) : null,
                    availability: values.availability,
                    skills: values.skills.split(',').map((s) => s.trim()).filter(Boolean),
                    portfolioImages,

                    // V2
                    calendarSyncUrl: values.calendarSyncUrl || null,
                    minParticipants,
                    maxParticipants,
                    pricingStrategy: values.pricingStrategy,
                    pricingOptions: {}, // Defaults for now
                    aiInterviewerConfig,
                    instantBookingEnabled: values.instantBookingEnabled,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to create offering');
            }

            toast.success(t('form.successMessage'));
            router.push('/browse?type=offerings');
        } catch (error) {
            console.error('Error creating offering:', error);
            toast.error(t('form.errorMessage'));
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

    async function handleAIMagic() {
        const currentDesc = form.getValues('description');
        const currentTitle = form.getValues('title');

        const prompt = currentDesc && currentDesc.length > 10 ? currentDesc : currentTitle;

        if (!prompt || prompt.length < 5) {
            toast.error("Please enter a rough title or description first so the AI knows what to polish!");
            return;
        }

        setIsGenerating(true);
        try {
            const res = await fetch('/api/experiences/ai-suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, mode: 'service' })
            });

            if (!res.ok) throw new Error("AI failed");

            const data = await res.json();

            // Update form fields
            form.setValue('title', data.title);
            form.setValue('description', data.description);

            // Map strategy if valid
            if (['standard', 'distressed', 'early_bird'].includes(data.strategy)) {
                form.setValue('pricingStrategy', data.strategy);
            }

            // Suggest price - AI returns direct unit value for services now
            if (data.estimatedPrice) {
                form.setValue('hourlyRate', String(data.estimatedPrice));
            }

            toast.success("✨ AI has optimized your specific listing!");
            toast.info(`Optimized for value per unit. Reasoning: ${data.reasoning}`);

        } catch (e) {
            console.error(e);
            toast.error("AI could not generate suggestions. Try again.");
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <Tabs defaultValue="basics" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="basics">Basics</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        <TabsTrigger value="ops">Operations</TabsTrigger>
                        <TabsTrigger value="pricing">Pricing</TabsTrigger>
                    </TabsList>

                    {/* === BASICS TAB === */}
                    <TabsContent value="basics" className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.titleLabel')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Italian Cooking Class or Plumbing Repair" {...field} />
                                    </FormControl>
                                    <FormDescription>{t('form.titleDesc')}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('form.categoryLabel')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('form.categoryPlaceholder')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {CATEGORIES.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>
                                                        {tFilter(`categories.${cat.id}`) || cat.label}
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
                                name="skills"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('form.skillsLabel')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Pasta making, Teaching, Storytelling" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center">
                                        <FormLabel>{t('form.descriptionLabel')}</FormLabel>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleAIMagic}
                                            disabled={isLoading || isGenerating}
                                            className="h-8 text-purple-600 border-purple-200 hover:bg-purple-50"
                                        >
                                            {isGenerating ? (
                                                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                            ) : (
                                                <Sparkles className="w-3 h-3 mr-2" />
                                            )}
                                            {isGenerating ? "Developing..." : "Develop with AI"}
                                        </Button>
                                    </div>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe what you want to offer and why you are passionate about it..."
                                            className="min-h-[150px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-stone-50 rounded-lg border border-stone-200">
                            <FormField
                                control={form.control}
                                name="isVirtual"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg p-3 shadow-sm bg-white">
                                        <div className="space-y-0.5">
                                            <FormLabel>Virtual Experience</FormLabel>
                                            <FormDescription>Occurs online via video</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {!isVirtual && (
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2">
                                            <FormLabel>{t('form.locationLabel')}</FormLabel>
                                            <FormControl>
                                                <LocationInput
                                                    name="location"
                                                    placeholder="Where will this happen?"
                                                    required={!isVirtual}
                                                    value={field.value}
                                                    onChange={(val, data) => {
                                                        field.onChange(val);
                                                        if (data) form.setValue('locationDetails', data);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        {/* Portfolio */}
                        <div className="space-y-4">
                            <FormLabel>{t('form.portfolioLabel')}</FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {portfolioImages.map((url, index) => (
                                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden border bg-muted group">
                                        <img src={url} alt={`Portfolio ${index + 1}`} className="object-cover w-full h-full" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleImageUpload}
                                    className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed hover:border-orange-500 hover:bg-orange-50 transition-colors"
                                >
                                    <Upload className="h-6 w-6 mb-2 text-stone-400" />
                                    <span className="text-xs text-stone-500">{t('form.addImage')}</span>
                                </button>
                            </div>
                        </div>
                    </TabsContent>

                    {/* === EXPERIENCE TAB (New) === */}
                    <TabsContent value="experience" className="space-y-8">
                        <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 flex gap-4 items-start">
                            <div className="p-3 bg-white rounded-lg shadow-sm text-orange-600">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-orange-900">Group Dynamics</h3>
                                <p className="text-stone-600 text-sm mt-1">
                                    Define how people join this experience. Is it a 1-on-1 session or a group activity?
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="minParticipants"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Minimum Participants</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="1" {...field} />
                                        </FormControl>
                                        <FormDescription>Minimum people needed to active.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="maxParticipants"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Maximum Capacity (Optional)</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="1" placeholder="Unlimited" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-stone-100">
                            <div className="flex items-center gap-3 mb-2">
                                <BrainCircuit className="w-5 h-5 text-purple-600" />
                                <h3 className="font-bold text-stone-900">AI Interviewer Config</h3>
                            </div>

                            <FormField
                                control={form.control}
                                name="initialQuestions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>What should we ask interested people?</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={`e.g.\nDo you have your own equipment?\nAny allergies?\nWhat is your experience level?`}
                                                className="min-h-[120px] font-mono text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Our AI Agent will interview candidates using these topics as a guide. Each line is a topic.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>

                    {/* === OPERATIONS TAB (New) === */}
                    <TabsContent value="ops" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="availability"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('form.availabilityLabel')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Weekends, Mon-Fri After 6PM" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="instantBookingEnabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel className="flex items-center gap-2">
                                                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                Instant Booking
                                            </FormLabel>
                                            <FormDescription>Skip approval if slot is free</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="calendarSyncUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Calendar Sync URL (iCal)
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://calendar.google.com/calendar/ical/..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Paste your private iCal link here to automatically block busy times.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>

                    {/* === PRICING TAB === */}
                    <TabsContent value="pricing" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="hourlyRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price Base (per person/hour)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="50" {...field} />
                                        </FormControl>
                                        <FormDescription>Standard rate in USD</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="pricingStrategy"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pricing Strategy (Experimental)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select strategy" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="standard">Standard (Fixed)</SelectItem>
                                                <SelectItem value="distressed">
                                                    <div className="flex items-center gap-2">
                                                        <TrendingDown className="w-4 h-4 text-green-600" />
                                                        <span>Distressed (Last Minute Drop)</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="early_bird">Early Bird (Advance Discount)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            {field.value === 'distressed' && "Balances price vs. empty slots close to start time."}
                                            {field.value === 'early_bird' && "Rewards booking weeks in advance."}
                                            {field.value === 'standard' && "Price remains constant."}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <PricingGuidance
                            category={category}
                            currentPrice={hourlyRate ? parseFloat(hourlyRate) : null}
                        />
                    </TabsContent>
                </Tabs>

                <div className="flex flex-col items-end pt-4 border-t gap-2">
                    <Button type="submit" size="lg" className="min-w-[200px]" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('form.submittingButton')}
                            </>
                        ) : (
                            t('form.submitButton')
                        )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        By publishing, you agree to our <a href="/legal/terms" className="underline hover:text-primary" target="_blank">Terms</a>.
                    </p>
                </div>
            </form>
        </Form>
    );
}
