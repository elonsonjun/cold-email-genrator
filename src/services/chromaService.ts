
// This is a real ChromaDB service connecting to a backend API
import { EmailTemplate } from "@/lib/types";

class ChromaDBService {
  private baseUrl: string;
  private apiKey: string | null;
  private collectionName: string;
  
  constructor() {
    // In a production app, these would come from env variables
    this.baseUrl = "/api/chroma"; // Endpoint for your backend service
    this.apiKey = null; // Will be set by user
    this.collectionName = "email_templates";
  }
  
  setApiKey(key: string) {
    this.apiKey = key;
    return this;
  }
  
  // Add a template to ChromaDB
  async addTemplate(template: EmailTemplate): Promise<void> {
    if (!this.apiKey) {
      throw new Error("API key must be set before using ChromaDB");
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          id: template.id,
          document: template.content,
          metadata: {
            name: template.name,
            tags: template.tags,
            createdAt: template.createdAt.toISOString()
          },
          collection: this.collectionName
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add template: ${response.statusText}`);
      }
      
      console.log(`[ChromaDB] Template added: ${template.name}`);
      return;
    } catch (error) {
      console.error('[ChromaDB] Error adding template:', error);
      throw error;
    }
  }
  
  // Get template by ID
  async getTemplateById(id: string): Promise<EmailTemplate | null> {
    if (!this.apiKey) {
      throw new Error("API key must be set before using ChromaDB");
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/get?id=${id}&collection=${this.collectionName}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get template: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.document) {
        return null;
      }
      
      return {
        id: id,
        name: data.metadata.name,
        content: data.document,
        tags: data.metadata.tags || [],
        createdAt: new Date(data.metadata.createdAt)
      };
    } catch (error) {
      console.error('[ChromaDB] Error getting template:', error);
      return null;
    }
  }
  
  // Find similar templates based on query text
  async findSimilarTemplates(query: string, limit = 5): Promise<EmailTemplate[]> {
    if (!this.apiKey) {
      throw new Error("API key must be set before using ChromaDB");
    }
    
    try {
      console.log(`[ChromaDB] Searching for templates similar to: "${query}"`);
      
      const response = await fetch(`${this.baseUrl}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          queryText: query,
          collection: this.collectionName,
          limit: limit
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to query templates: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data.results)) {
        return [];
      }
      
      return data.results.map((item: any) => ({
        id: item.id,
        name: item.metadata.name,
        content: item.document,
        tags: item.metadata.tags || [],
        createdAt: new Date(item.metadata.createdAt)
      }));
    } catch (error) {
      console.error('[ChromaDB] Error finding similar templates:', error);
      return [];
    }
  }
  
  // Initialize with templates (batch upload)
  async initWithTemplates(templates: EmailTemplate[]): Promise<void> {
    for (const template of templates) {
      await this.addTemplate(template);
    }
    console.log(`[ChromaDB] Initialized with ${templates.length} templates`);
    return;
  }
  
  // Check if the service is configured and connected
  async testConnection(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Singleton instance
const chromaDB = new ChromaDBService();

export default chromaDB;
