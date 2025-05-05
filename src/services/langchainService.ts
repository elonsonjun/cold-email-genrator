
// This is a real LangChain service connecting to a backend API
import { EmailGenRequest, EmailGenResponse } from "@/lib/types";

// API key for the LLM service (Llama 3.1)
let llmApiKey: string | null = null;

export function setLLMApiKey(key: string) {
  llmApiKey = key;
  return { llmApiKey };
}

// Check if the API is configured
export function isConfigured() {
  return !!llmApiKey;
}

// Generate email using LangChain and Llama 3.1
export async function generateEmail(request: EmailGenRequest): Promise<EmailGenResponse> {
  if (!llmApiKey) {
    throw new Error("LLM API key must be set before generating emails");
  }
  
  console.log("[LangChain] Generating email with request:", request);
  
  try {
    const response = await fetch('/api/langchain/generate-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${llmApiKey}`
      },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to generate email: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      content: data.content,
      subject: data.subject,
      metadata: {
        tokensUsed: data.metadata.tokensUsed,
        generatedAt: new Date(data.metadata.generatedAt),
      }
    };
  } catch (error) {
    console.error('[LangChain] Error generating email:', error);
    throw error;
  }
}

// Search for templates based on description
export async function findTemplatesByDescription(description: string) {
  if (!llmApiKey) {
    throw new Error("LLM API key must be set before searching templates");
  }
  
  console.log(`[LangChain] Finding templates matching: "${description}"`);
  
  try {
    const response = await fetch('/api/langchain/find-templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${llmApiKey}`
      },
      body: JSON.stringify({ description })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to find templates: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('[LangChain] Error finding templates:', error);
    return [];
  }
}
