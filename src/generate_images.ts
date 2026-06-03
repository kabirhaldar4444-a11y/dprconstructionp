import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateIndustrialImages() {
  const prompts = [
    {
      id: "bim_modeling",
      prompt: "Corporate documentary photography of a modern construction coordination room. Professional engineers in business-casual attire and safety vests are reviewing a large interactive wall-mounted screen displaying a detailed 3D BIM model of an industrial facility with visible steel framing and MEP systems. Tablets and laptops with technical drawings are on the table. Realistic office lighting, glass walls, clean minimal interior. Sharp focus, natural atmosphere, no holograms."
    },
    {
      id: "ai_project_management",
      prompt: "Professional industrial photography at ground level of an active mid-rise building construction site. A project manager in full PPE (helmet, safety vest) is using a tablet that shows a construction schedule dashboard with analytics graphs. In the background, cranes and workers are visible near a real steel structure and scaffolding. Authentic textures, daytime natural sunlight, realistic engineering environment."
    },
    {
      id: "drone_monitoring",
      prompt: "High-resolution aerial photography of a professional drone flying above a massive solar farm during golden hour. The drone is clearly visible in mid-air against a clear sky. Rows of solar panels stretch into the distance. Warm sunset lighting with subtle long shadows. Natural color grading, high clarity, realistic infrastructure monitoring."
    },
    {
      id: "smart_equipment",
      prompt: "Professional engineering case-study photography of a clean, active industrial power plant. Large turbines and processing equipment are equipped with visible sensors. A digital monitoring screen is mounted nearby, and a technician is inspecting the machinery using a tablet. Slight steam in the air, neutral color tones, practical and believable operational environment. Sharp focus, high detail."
    }
  ];

  const results = [];

  for (const p of prompts) {
    console.log(`Generating image for: ${p.id}...`);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [{ text: p.prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          results.push({
            id: p.id,
            data: part.inlineData.data,
            mimeType: part.inlineData.mimeType
          });
        }
      }
    } catch (error) {
      console.error(`Error generating ${p.id}:`, error);
    }
  }

  return results;
}

// This script is for internal use to generate the images.
// I will manually trigger the generation and then provide the results.
