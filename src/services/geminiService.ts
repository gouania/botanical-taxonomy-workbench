import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import {
  AuthorProfile,
  ComparisonProfile,
  IdentifyResult,
  TaxonProfile,
  GroundingSource
} from '../types';
import { GEMINI_MODEL, SYSTEM_PROMPT } from '../constants';

function getApiKey(): string {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.API_KEY ||
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    (import.meta as any).env?.VITE_API_KEY ||
    ''
  );
}

function getGenAI(): GoogleGenAI {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API key not found. Please connect your API key.');
  }
  return new GoogleGenAI({ apiKey });
}

function extractSources(response: any): GroundingSource[] {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return chunks
    .map((chunk: any) => ({
      uri: chunk.web?.uri || '',
      title: chunk.web?.title || '',
    }))
    .filter((s: GroundingSource) => s.uri && s.title);
}

export const generateTaxonGuide = async (inputText: string): Promise<string> => {
  const ai = getGenAI();
  
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2,
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: inputText }],
        },
      ],
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response text received from Gemini.");
    }
    return text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const geminiService = {
  async analyzeSingleTaxon(name: string): Promise<{ result: TaxonProfile; sources: any[] }> {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Taxonomist mode. Analyze: "${name}". Search for precise diagnostic morphology and verified classification.
      
STRICT STRUCTURAL RULES:
'quickRecap': Exactly 2-3 sentences. Focus on the most unique identifier.
'diagnosticDescription': Valid Markdown bulleted list. Every character on its own line: "- **Feature**: Description." Sentence case for feature names. Use boldface for keywords and headings.`,
      config: {
        temperature: 0.1,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scientificName: { type: Type.STRING },
            author: { type: Type.STRING },
            commonName: { type: Type.STRING },
            family: { type: Type.STRING },
            quickRecap: { type: Type.STRING },
            diagnosticDescription: { type: Type.STRING },
            confusedTaxa: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  difference: { type: Type.STRING },
                  keyFeature: { type: Type.STRING },
                },
              },
            },
            ecology: { type: Type.STRING },
            etymology: { type: Type.STRING },
            history: { type: Type.STRING },
            distribution: { type: Type.STRING },
          },
          required: [
            'scientificName',
            'author',
            'commonName',
            'family',
            'quickRecap',
            'diagnosticDescription',
            'confusedTaxa',
            'ecology',
            'etymology',
            'history',
            'distribution',
          ],
        },
      },
    });

    const result = JSON.parse(response.text || '{}') as TaxonProfile;
    const sources = extractSources(response);
    return { result, sources };
  },

  async compareTaxa(names: string[]): Promise<{ result: ComparisonProfile; sources: any[] }> {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Taxonomist mode. Compare: ${names.join(', ')}. Search for precise diagnostic morphology and verified classification. Use boldface for keywords and headings in the descriptions.`,
      config: {
        temperature: 0.1,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            taxon1: {
              type: Type.OBJECT,
              properties: {
                scientificName: { type: Type.STRING },
                author: { type: Type.STRING },
                commonName: { type: Type.STRING },
                family: { type: Type.STRING },
                quickRecap: { type: Type.STRING },
                diagnosticDescription: { type: Type.STRING },
                confusedTaxa: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      difference: { type: Type.STRING },
                      keyFeature: { type: Type.STRING },
                    },
                  },
                },
                ecology: { type: Type.STRING },
                etymology: { type: Type.STRING },
                history: { type: Type.STRING },
                distribution: { type: Type.STRING },
              },
            },
            taxon2: {
              type: Type.OBJECT,
              properties: {
                scientificName: { type: Type.STRING },
                author: { type: Type.STRING },
                commonName: { type: Type.STRING },
                family: { type: Type.STRING },
                quickRecap: { type: Type.STRING },
                diagnosticDescription: { type: Type.STRING },
                confusedTaxa: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      difference: { type: Type.STRING },
                      keyFeature: { type: Type.STRING },
                    },
                  },
                },
                ecology: { type: Type.STRING },
                etymology: { type: Type.STRING },
                history: { type: Type.STRING },
                distribution: { type: Type.STRING },
              },
            },
            taxon3: {
              type: Type.OBJECT,
              properties: {
                scientificName: { type: Type.STRING },
                author: { type: Type.STRING },
                commonName: { type: Type.STRING },
                family: { type: Type.STRING },
                quickRecap: { type: Type.STRING },
                diagnosticDescription: { type: Type.STRING },
                confusedTaxa: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      difference: { type: Type.STRING },
                      keyFeature: { type: Type.STRING },
                    },
                  },
                },
                ecology: { type: Type.STRING },
                etymology: { type: Type.STRING },
                history: { type: Type.STRING },
                distribution: { type: Type.STRING },
              },
            },
            keyDifferences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING },
                  taxon1State: { type: Type.STRING },
                  taxon2State: { type: Type.STRING },
                  taxon3State: { type: Type.STRING },
                },
              },
            },
          },
          required: ['taxon1', 'taxon2', 'keyDifferences'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}') as ComparisonProfile;
    const sources = extractSources(response);
    return { result, sources };
  },

  async identifySpecimen(
    characters: string[],
    notes: string,
    location: string,
    suspectedFamilies: string
  ): Promise<{ result: IdentifyResult; sources: any[] }> {
    const ai = getGenAI();
    let retries = 2;
    while (retries >= 0) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Identify the most likely plant family based on the following:
Characters: ${characters.join(', ')}
Notes: ${notes}
Location: ${location}
Suspected Families: ${suspectedFamilies}`,
          config: {
            temperature: 0.1,
            tools: [{ googleSearch: {} }],
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                analysisNotes: { type: Type.STRING },
                suggestedFamilies: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      authority: { type: Type.STRING },
                      order: { type: Type.STRING },
                      commonName: { type: Type.STRING },
                      matchQuality: { type: Type.STRING },
                      matchingCharacters: { type: Type.NUMBER },
                      totalCharacters: { type: Type.NUMBER },
                      contradictingCharacters: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      synapomorphies: { type: Type.STRING },
                      diagnosticCharacters: { type: Type.STRING },
                      fieldRecognitionTips: { type: Type.STRING },
                      spotCharacters: { type: Type.STRING },
                      charactersToVerifyNext: { type: Type.STRING },
                      possibleGenera: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            notes: { type: Type.STRING },
                          },
                        },
                      },
                      differentialDiagnosis: { type: Type.STRING },
                      regionalNotes: { type: Type.STRING },
                    },
                  },
                },
                additionalRecommendations: { type: Type.STRING },
                taxonomicNotes: { type: Type.STRING },
              },
              required: [
                'analysisNotes',
                'suggestedFamilies',
                'additionalRecommendations',
                'taxonomicNotes',
              ],
            },
          },
        });

        const result = JSON.parse(response.text || '{}') as IdentifyResult;
        const sources = extractSources(response);
        return { result, sources };
      } catch (e) {
        if (retries === 0) throw e;
        retries--;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    throw new Error('Failed to identify specimen after retries');
  },

  async suggestNextCharacters(
    selectedCharacters: string[],
    availableCharacters: string[]
  ): Promise<{ id: string; reasoning: string }[]> {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Given these selected characters: ${selectedCharacters.join(', ')}.
Suggest the top 3 most discriminating characters to try next from this list: ${availableCharacters.join(', ')}.`,
      config: {
        temperature: 0.1,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              reasoning: { type: Type.STRING },
            },
          },
        },
      },
    });

    return JSON.parse(response.text || '[]');
  },

  async explainCharacter(characterLabel: string): Promise<string> {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a concise botanical definition for the morphological character: "${characterLabel}".`,
      config: { temperature: 0.1 },
    });
    return response.text || '';
  },

  async lookupAuthority(query: string): Promise<{ result: AuthorProfile; sources: any[] }> {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Look up botanical taxonomic author: "${query}". Provide rich biographical and bibliographic profile.`,
      config: {
        temperature: 0.1,
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            standardAbbreviation: { type: Type.STRING },
            lifespan: { type: Type.STRING },
            nationality: { type: Type.STRING },
            birthPlace: { type: Type.STRING },
            deathPlace: { type: Type.STRING },
            mainContribution: { type: Type.STRING },
            biography: { type: Type.STRING },
            historicalContext: { type: Type.STRING },
            almaMater: { type: Type.ARRAY, items: { type: Type.STRING } },
            institutions: { type: Type.ARRAY, items: { type: Type.STRING } },
            focusAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
            awards: { type: Type.ARRAY, items: { type: Type.STRING } },
            fieldWorkRegions: { type: Type.ARRAY, items: { type: Type.STRING } },
            majorWorks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.STRING },
                  title: { type: Type.STRING },
                },
              },
            },
            taxaDescribed: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  rank: { type: Type.STRING },
                },
              },
            },
            eponymousTaxa: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  rank: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
              },
            },
            herbariaCollections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  abbreviation: { type: Type.STRING },
                  institution: { type: Type.STRING },
                },
              },
            },
            taxonomicNotes: { type: Type.STRING },
            notableMentors: { type: Type.ARRAY, items: { type: Type.STRING } },
            notableStudents: { type: Type.ARRAY, items: { type: Type.STRING } },
            relatedBotanists: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  connection: { type: Type.STRING },
                },
              },
            },
          },
          required: [
            'fullName',
            'standardAbbreviation',
            'lifespan',
            'nationality',
            'mainContribution',
            'biography',
          ],
        },
      },
    });

    const result = JSON.parse(response.text || '{}') as AuthorProfile;
    const sources = extractSources(response);
    return { result, sources };
  },
};
