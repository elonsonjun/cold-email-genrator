
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Recipient } from '@/lib/types';

interface EmailFormProps {
  onSubmit: (recipientData: Recipient, customInstructions?: string) => void;
  isLoading: boolean;
}

const EmailForm = ({ onSubmit, isLoading }: EmailFormProps) => {
  const [recipientData, setRecipientData] = useState<Recipient>({
    name: '',
    company: '',
    position: '',
    email: '',
    industry: '',
    painPoint: '',
  });
  
  const [customInstructions, setCustomInstructions] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecipientData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(recipientData, customInstructions);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recipient Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Recipient Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Smith"
                    value={recipientData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    name="position"
                    placeholder="Marketing Director"
                    value={recipientData.position}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Acme Corp"
                  value={recipientData.company}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={recipientData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  name="industry"
                  placeholder="Technology, Healthcare, etc."
                  value={recipientData.industry}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="painPoint">Main Pain Point</Label>
                <Textarea
                  id="painPoint"
                  name="painPoint"
                  placeholder="Describe their main challenge or pain point"
                  value={recipientData.painPoint}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customInstructions">Custom Instructions</Label>
                <Textarea
                  id="customInstructions"
                  placeholder="Add any specific instructions for the AI (tone, style, focus points, etc.)"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  rows={3}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Generating Email..." : "Generate Cold Email"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailForm;
