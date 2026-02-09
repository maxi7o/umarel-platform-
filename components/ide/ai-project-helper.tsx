'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Check, ArrowRight, Wand2 } from 'lucide-react';
import { PROJECT_TEMPLATES, ProjectTemplate } from '@/lib/templates/project-templates';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AIProjectHelperProps {
    onApplySuggestions: (suggestions: any) => void;
    onCancel: () => void;
}

export function AIProjectHelper({ onApplySuggestions, onCancel }: AIProjectHelperProps) {
    const [step, setStep] = useState<'input' | 'preview'>('input');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<any>(null);

    const handleGenerate = async () => {
        if (!description) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/projects/ai-suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, category }),
            });

            const data = await response.json();
            if (data.success) {
                setSuggestions(data.suggestions);
                setStep('preview');
            }
        } catch (error) {
            console.error('Failed to generate suggestions', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUseTemplate = (template: ProjectTemplate) => {
        setTitle(template.title);
        setDescription(template.descriptionTemplate);
        setCategory(template.category);
    };

    return (
        <Card className="w-full max-w-4xl mx-auto border-2 border-primary/20 shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Asistente de Creación con IA</CardTitle>
                <CardDescription>
                    Describí tu idea y dejá que nuestra IA estructure el proyecto, sugiera hitos y estime costos.
                </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
                {step === 'input' ? (
                    <Tabs defaultValue="custom" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="custom">Idea Personalizada</TabsTrigger>
                            <TabsTrigger value="templates">Usar Plantilla</TabsTrigger>
                        </TabsList>

                        <TabsContent value="custom" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título del Proyecto (Opcional)</Label>
                                <Input
                                    id="title"
                                    placeholder="Ej: Renovación de Baño, Desarrollo Web, etc."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción Detallada</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describí qué necesitás hacer, los objetivos principales y cualquier requisito específico..."
                                    className="min-h-[150px]"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground text-right">Mínimo 50 caracteres para mejores resultados.</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="templates">
                            <ScrollArea className="h-[300px] pr-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {PROJECT_TEMPLATES.map((template) => (
                                        <div
                                            key={template.id}
                                            className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-all hover:bg-muted/50 flex flex-col gap-2"
                                            onClick={() => handleUseTemplate(template)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className="text-2xl">{template.icon}</span>
                                                <Badge variant="secondary" className="text-[10px]">{template.category}</Badge>
                                            </div>
                                            <h4 className="font-semibold">{template.name}</h4>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            {description && (
                                <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
                                    <Label className="mb-2 block">Vista Previa de la Plantilla:</Label>
                                    <div className="space-y-2">
                                        <Input value={title} onChange={(e) => setTitle(e.target.value)} className="font-medium" />
                                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[100px]" />
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Left Column: Summary */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Título Optimizado</h3>
                                    <div className="p-3 bg-muted rounded-md font-semibold text-lg border border-border">
                                        {suggestions.optimizedTitle || title}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Costo Estimado</h3>
                                        <div className="p-3 bg-green-50 text-green-700 rounded-md font-mono font-medium border border-green-100">
                                            ${suggestions.priceRange?.min?.toLocaleString()} - ${suggestions.priceRange?.max?.toLocaleString()} {suggestions.priceRange?.currency}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Categoría</h3>
                                        <div className="p-3 bg-blue-50 text-blue-700 rounded-md font-medium border border-blue-100 capitalize">
                                            {suggestions.categoryRecommendation || category || 'General'}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Skills Recomendadas</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {suggestions.suggestedSkills?.map((skill: string) => (
                                            <Badge key={skill} variant="outline" className="bg-background">{skill}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Milestones */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Check className="w-4 h-4 text-primary" /> Estructura Sugerida
                                </h3>
                                <ScrollArea className="h-[300px] pr-4">
                                    <div className="space-y-3">
                                        {suggestions.suggestedMilestones?.map((milestone: any, idx: number) => (
                                            <div key={idx} className="p-3 border rounded-lg bg-card hover:border-primary/50 transition-colors">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-semibold text-sm">{milestone.title}</h4>
                                                    <span className="text-xs font-mono text-muted-foreground">{milestone.estimatedHours}h</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground mb-2">{milestone.description}</p>
                                                {milestone.estimatedPrice && (
                                                    <div className="text-xs bg-muted/50 px-2 py-1 rounded inline-block text-muted-foreground">
                                                        Est. ${milestone.estimatedPrice.toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between p-6 bg-muted/20">
                {step === 'input' ? (
                    <>
                        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
                        <Button
                            onClick={handleGenerate}
                            disabled={!description || description.length < 10 || isLoading}
                            className="bg-stone-900 hover:bg-stone-800"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Analizando...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-4 h-4 mr-2" />
                                    Generar Estructura
                                </>
                            )}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="outline" onClick={() => setStep('input')}>Volver a Editar</Button>
                        <Button onClick={() => onApplySuggestions(suggestions)} className="bg-primary hover:bg-primary/90">
                            Aplicar al Proyecto <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
