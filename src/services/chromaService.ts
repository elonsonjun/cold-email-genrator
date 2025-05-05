
// This is a simulated ChromaDB service for the frontend
// In a real application, this would connect to a backend service with ChromaDB

import { EmailTemplate } from "@/lib/types";

// Simulate a vector database with in-memory storage
class ChromaDBSimulation {
  private templates: Map<string, EmailTemplate> = new Map();
  private vectors: Map<string, number[]> = new Map();
  
  // Add a template to the "database"
  async addTemplate(template: EmailTemplate): Promise<void> {
    this.templates.set(template.id, template);
    
    // Simulate vector embedding
    const fakeVector = Array.from({ length: 384 }, () => Math.random());
    this.vectors.set(template.id, fakeVector);
    
    console.log(`[ChromaDB] Template added: ${template.name}`);
    return Promise.resolve();
  }
  
  // Get template by ID
  async getTemplateById(id: string): Promise<EmailTemplate | null> {
    const template = this.templates.get(id);
    return Promise.resolve(template || null);
  }
  
  // Find similar templates based on query text
  async findSimilarTemplates(query: string, limit = 5): Promise<EmailTemplate[]> {
    // Simulate semantic search
    console.log(`[ChromaDB] Searching for templates similar to: "${query}"`);
    
    // Just return random templates since this is a simulation
    const templatesArray = Array.from(this.templates.values());
    templatesArray.sort(() => Math.random() - 0.5);
    
    return Promise.resolve(templatesArray.slice(0, limit));
  }
  
  // Initialize with some templates
  async initWithTemplates(templates: EmailTemplate[]): Promise<void> {
    for (const template of templates) {
      await this.addTemplate(template);
    }
    console.log(`[ChromaDB] Initialized with ${templates.length} templates`);
    return Promise.resolve();
  }
}

// Singleton instance
const chromaDB = new ChromaDBSimulation();

export default chromaDB;
