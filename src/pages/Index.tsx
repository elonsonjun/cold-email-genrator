
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import EmailForm from '@/components/EmailForm';
import EmailPreview from '@/components/EmailPreview';
import TemplateManager from '@/components/TemplateManager';
import AISettings from '@/components/AISettings';
import { EmailTemplate, Recipient, AISettings as AISettingsType, EmailGenResponse } from '@/lib/types';
import { generateEmail, setLLMApiKey, isConfigured as isLangChainConfigured } from '@/services/langchainService';
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
  const [chromaApiKey, setChromaApiKey] = useState<string>('');
  const [llmApiKey, setLlmApiKey] = useState<string>('');
  const [isApiConfigured, setIsApiConfigured] = useState<boolean>(false);
  const [showApiSettings, setShowApiSettings] = useState<boolean>(true);

  // Check if APIs are configured
  useEffect(() => {
    const checkApiConfiguration = async () => {
      try {
        if (chromaApiKey && llmApiKey) {
          chromaDB.setApiKey(chromaApiKey);
          setLLMApiKey(llmApiKey);
          
          const isChromaConnected = await chromaDB.testConnection();
          const isLangChainReady = isLangChainConfigured();
          
          const isConfigured = isChromaConnected && isLangChainReady;
          setIsApiConfigured(isConfigured);
          setShowApiSettings(!isConfigured);
          
          if (isConfigured) {
            toast({
              title: "APIs Connected",
              description: "Successfully connected to ChromaDB and LLM API",
            });
          }
        }
      } catch (error) {
        console.error("Failed to configure APIs:", error);
        setIsApiConfigured(false);
      }
    };
    
    checkApiConfiguration();
  }, [chromaApiKey, llmApiKey, toast]);

  const handleSaveApiKeys = () => {
    if (!chromaApiKey || !llmApiKey) {
      toast({
        title: "Missing API Keys",
        description: "Please provide both ChromaDB and LLM API keys",
        variant: "destructive",
      });
      return;
    }
    
    // This will trigger the useEffect above
    setChromaApiKey(chromaApiKey);
    setLlmApiKey(llmApiKey);
  };

  const handleGenerateEmail = async (recipientData: Recipient, customInstructions?: string) => {
    if (!isApiConfigured) {
      toast({
        title: "APIs Not Configured",
        description: "Please configure the API keys first",
        variant: "destructive",
      });
      setShowApiSettings(true);
      return;
    }
    
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
        description: "Failed to generate email. Please check your API configuration and try again.",
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

        {showApiSettings && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
              <p className="text-sm text-muted-foreground mb-4">
                To use this application, you need to provide API keys for ChromaDB and the LLM service.
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="chromaApiKey">ChromaDB API Key</Label>
                    <Input
                      id="chromaApiKey"
                      type="password"
                      value={chromaApiKey}
                      onChange={(e) => setChromaApiKey(e.target.value)}
                      placeholder="Enter your ChromaDB API key"
                    />
                  </div>
                  <div>
                    <Label htmlFor="llmApiKey">LLM API Key (Llama 3.1)</Label>
                    <Input
                      id="llmApiKey"
                      type="password"
                      value={llmApiKey}
                      onChange={(e) => setLlmApiKey(e.target.value)}
                      placeholder="Enter your LLM API key"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveApiKeys}>
                    Connect APIs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
            {isApiConfigured && (
              <Card className="w-full">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm font-medium">APIs Connected</p>
                  </div>
                  <Button
                    variant="link"
                    className="text-xs p-0 h-auto mt-2"
                    onClick={() => setShowApiSettings(true)}
                  >
                    Change API Keys
                  </Button>
                </CardContent>
              </Card>
            )}
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
            This application uses real ChromaDB and LangChain services with Llama 3.1.
            You must provide valid API keys to use these features.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
