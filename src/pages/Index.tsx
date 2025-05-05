
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailForm from '@/components/EmailForm';
import EmailPreview from '@/components/EmailPreview';
import TemplateManager from '@/components/TemplateManager';
import AISettings from '@/components/AISettings';
import { EmailTemplate, Recipient, AISettings as AISettingsType, EmailGenResponse } from '@/lib/types';
import { generateEmail } from '@/services/langchainService';
import chromaDB from '@/services/chromaService';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_AI_SETTINGS: AISettingsType = {
  temperature: 0.7,
  maxTokens: 400,
};

const Index = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [emailResponse, setEmailResponse] = useState<EmailGenResponse | null>(null);
  const [lastRecipient, setLastRecipient] = useState<Recipient | null>(null);
  const [lastInstructions, setLastInstructions] = useState<string | undefined>('');
  const [aiSettings, setAISettings] = useState<AISettingsType>(DEFAULT_AI_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize ChromaDB with templates when component mounts
  useEffect(() => {
    const initializeChromaDB = async () => {
      // This would normally get templates from an API
      // For this demo, TemplateManager has hardcoded initial templates
    };
    
    initializeChromaDB();
  }, []);

  const handleGenerateEmail = async (recipientData: Recipient, customInstructions?: string) => {
    if (!selectedTemplate) {
      toast({
        title: "No Template Selected",
        description: "Please select a template first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLastRecipient(recipientData);
    setLastInstructions(customInstructions);

    try {
      const response = await generateEmail({
        template: selectedTemplate,
        recipient: recipientData,
        settings: aiSettings,
        customInstructions
      });
      
      setEmailResponse(response);
      
      toast({
        title: "Email Generated",
        description: "Your cold email has been created successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateEmail = async () => {
    if (lastRecipient && selectedTemplate) {
      handleGenerateEmail(lastRecipient, lastInstructions);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold gradient-text mb-4">Cold Email Generator</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Create personalized cold emails with AI using LLaMa 3.1, ChromaDB, and LangChain
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left column - Template selection and settings */}
          <div className="md:col-span-1 space-y-6">
            <TemplateManager 
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
            <AISettings
              initialSettings={aiSettings}
              onSaveSettings={setAISettings}
            />
          </div>

          {/* Right column - Form and preview */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="compose">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="compose">Compose</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="compose">
                <Card>
                  <CardContent className="p-6">
                    <EmailForm
                      onSubmit={handleGenerateEmail}
                      isLoading={isLoading}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preview">
                <EmailPreview
                  emailResponse={emailResponse}
                  onRegenerateClick={handleRegenerateEmail}
                />
              </TabsContent>
            </Tabs>

            {/* AI State Indicator */}
            {isLoading && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 rounded-full bg-purple-500 pulse-animation"></div>
                    <div>
                      <p className="text-sm font-medium">
                        AI is generating your email...
                      </p>
                      <p className="text-xs text-muted-foreground">
                        This might take a few seconds
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            This is a simulation using Llama 3.1, ChromaDB, and LangChain. 
            In a production environment, these would be connected to a backend service.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
