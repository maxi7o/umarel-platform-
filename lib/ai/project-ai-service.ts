import { OpenAI } from 'openai';

const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

interface ProjectSuggestions {
    optimizedTitle?: string;
    suggestedMilestones?: Array<{
        title: string;
        description: string;
        estimatedHours: number;
        estimatedPrice: number;
    }>;
    priceRange?: {
        min: number;
        max: number;
        currency: string;
    };
    suggestedSkills?: string[];
    categoryRecommendation?: string;
}

export class ProjectAIService {
    /**
     * Generate project suggestions based on user input
     */
    static async generateSuggestions(
        title: string,
        description: string,
        category?: string
    ): Promise<ProjectSuggestions> {
        if (!openai) {
            console.warn('[ProjectAIService] OpenAI not configured, returning empty suggestions');
            return {};
        }

        try {
            const prompt = `Sos un asistente experto en gestión de proyectos en Argentina. Un usuario quiere publicar este proyecto:

Título: "${title}"
Descripción: "${description}"
${category ? `Categoría: ${category}` : ''}

Por favor, proporcioná sugerencias para mejorar el proyecto:

1. **Título Optimizado**: Un título más claro y atractivo (máximo 60 caracteres)
2. **Hitos Sugeridos**: Dividí el proyecto en 3-5 hitos lógicos con:
   - Título del hito
   - Descripción breve
   - Horas estimadas (realista para Argentina)
   - Precio estimado en ARS
3. **Rango de Precio Total**: Estimación realista del costo total en ARS
4. **Skills Recomendadas**: Lista de habilidades necesarias
5. **Categoría**: Si no se especificó, sugerí la más apropiada

Respondé SOLO con un JSON válido en este formato:
{
  "optimizedTitle": "string",
  "suggestedMilestones": [
    {
      "title": "string",
      "description": "string",
      "estimatedHours": number,
      "estimatedPrice": number
    }
  ],
  "priceRange": {
    "min": number,
    "max": number,
    "currency": "ARS"
  },
  "suggestedSkills": ["string"],
  "categoryRecommendation": "string"
}`;

            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'Sos un experto en gestión de proyectos en Argentina. Respondés SOLO con JSON válido, sin texto adicional.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1500,
                response_format: { type: 'json_object' }
            });

            const content = completion.choices[0]?.message?.content;
            if (!content) {
                throw new Error('No content in OpenAI response');
            }

            const suggestions: ProjectSuggestions = JSON.parse(content);

            console.log('[ProjectAIService] Generated suggestions:', suggestions);
            return suggestions;

        } catch (error) {
            console.error('[ProjectAIService] Error generating suggestions:', error);
            return {};
        }
    }

    /**
     * Optimize project title for SEO and clarity
     */
    static async optimizeTitle(title: string, category?: string): Promise<string | null> {
        if (!openai || !title || title.length < 5) {
            return null;
        }

        try {
            const prompt = `Optimizá este título de proyecto para que sea más claro y atractivo:

Título actual: "${title}"
${category ? `Categoría: ${category}` : ''}

Reglas:
- Máximo 60 caracteres
- Claro y específico
- Atractivo para proveedores
- En español argentino
- Sin emojis

Respondé SOLO con el título optimizado, sin comillas ni texto adicional.`;

            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'Sos un experto en copywriting para proyectos. Respondés SOLO con el título optimizado.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.5,
                max_tokens: 100
            });

            const optimizedTitle = completion.choices[0]?.message?.content?.trim();
            return optimizedTitle || null;

        } catch (error) {
            console.error('[ProjectAIService] Error optimizing title:', error);
            return null;
        }
    }

    /**
     * Estimate price range based on project details
     */
    static async estimatePriceRange(
        title: string,
        description: string,
        category?: string
    ): Promise<{ min: number; max: number; currency: string } | null> {
        if (!openai) {
            return null;
        }

        try {
            const prompt = `Estimá el rango de precio para este proyecto en Argentina (en pesos argentinos ARS):

Título: "${title}"
Descripción: "${description}"
${category ? `Categoría: ${category}` : ''}

Considerá:
- Precios de mercado en Argentina 2026
- Complejidad del proyecto
- Tiempo estimado
- Skills requeridas

Respondé SOLO con un JSON en este formato:
{
  "min": number,
  "max": number,
  "currency": "ARS"
}`;

            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'Sos un experto en pricing de proyectos en Argentina. Respondés SOLO con JSON válido.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 200,
                response_format: { type: 'json_object' }
            });

            const content = completion.choices[0]?.message?.content;
            if (!content) {
                return null;
            }

            const priceRange = JSON.parse(content);
            return priceRange;

        } catch (error) {
            console.error('[ProjectAIService] Error estimating price:', error);
            return null;
        }
    }
}
