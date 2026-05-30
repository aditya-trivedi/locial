import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { callMistral } from "../models_for_posts/mistrel.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const personalitiesPath = path.join(__dirname, "../AiReWrite/personalities.json");

async function getRandomPersonality() {

    const personalitiesFileContent = await fs.readFile(personalitiesPath, "utf-8")
    const personalities = JSON.parse(personalitiesFileContent).personalities;
    const randomNumber = Math.floor(Math.random() * 10);
    return personalities[randomNumber]

}

function buildPrompt(personality, chunk) {
    return `
  You are rewriting text while preserving factual accuracy.
  
  Your task is to rewrite the provided text so it feels like it was written by someone with the following personality:
  
  PERSONALITY NAME:
  ${personality.name}
  
  TONE:
  ${personality.tone.join(", ")}
  
  CHARACTERISTICS:
  ${personality.characteristics.join(", ")}
  
  STYLE INSTRUCTION:
  ${personality.stylePrompt}
  
  STRICT RULES:
  - Do not add ANY new information
  - Do not infer anything
  - Do not expand ideas
  - Do not summarize
  - Do not remove important details
  - Do not change factual meaning
  - Do not introduce opinions
  - Do not introduce examples
  - Do not introduce analogies
  - Do not introduce context not present in the original text
  - Preserve all facts exactly
  - Preserve names, places, numbers, and claims exactly
  - Only change writing style, sentence rhythm, wording, and tone
  - Output ONLY the rewritten text
  - Do not explain your rewrite
  
  TEXT TO REWRITE:
  """
  ${chunk.text}
  """
  `.trim();
}

async function convertTextToPostUsingAI(prompt) {
    return await callMistral(prompt)
}

function createPostData(personality, chunk, postDataFromAI){
    return {
        id: crypto.randomUUID(),
    
        created_at: new Date().toISOString(),
    
        personality: {
          id: personality.id,
          name: personality.name
        },
    
        source: {
          document_id: chunk.document_id,
          document_name: chunk.document_name,
          chunk_number: chunk.chunk_number,
          number_of_chunks: chunk.number_of_chunks
        },
    
        chunk: {
          original_text: chunk.text,
          token_length: chunk.token_length,
          embedding_model: chunk.model_name
        },
    
        rewritten: {
          text: postDataFromAI
        }
      };
}

export async function generatePostsForChunk(chunk) {

    const personality = await getRandomPersonality()

    console.log("Personality Selected", personality.id)

    const prompt = buildPrompt(personality, chunk)

    console.log("Prompt generated")

    const postDataFromAI = await convertTextToPostUsingAI(prompt)

    const postData = createPostData(personality, chunk, postDataFromAI)

    return postData

}

export async function createPosts(chunkedContent) {

    const allPosts: any[] = []
    for (let index = 0; index < chunkedContent.length; index++) {
        const chunk = chunkedContent[index];
        const postDataForChunk = await generatePostsForChunk(chunk);
        allPosts.push(postDataForChunk)
    }

    return allPosts
}