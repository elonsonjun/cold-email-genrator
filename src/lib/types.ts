
export interface Recipient {
  name: string;
  company: string;
  position: string;
  email: string;
  industry?: string;
  painPoint?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  content: string;
  tags: string[];
  createdAt: Date;
}

export interface AISettings {
  temperature: number;
  maxTokens: number;
  apiKey?: string;
}

export interface EmailGenRequest {
  template: EmailTemplate;
  recipient: Recipient;
  settings: AISettings;
  customInstructions?: string;
}

export interface EmailGenResponse {
  content: string;
  subject: string;
  metadata: {
    tokensUsed: number;
    generatedAt: Date;
  };
}
