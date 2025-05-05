
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmailTemplate } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface TemplateManagerProps {
  onSelectTemplate: (template: EmailTemplate) => void;
  selectedTemplate: EmailTemplate | null;
}

const SAMPLE_TEMPLATES: EmailTemplate[] = [
  {
    id: '1',
    name: 'Value Proposition',
    content: 'Hi {{recipient.name}},\n\nI noticed that {{recipient.company}} has been making waves in the {{recipient.industry}} industry. I wanted to reach out because our solution has helped similar companies increase their efficiency by 30%.\n\nWould you be interested in a quick 15-minute call to discuss how we might be able to help {{recipient.company}} with {{recipient.painPoint}}?\n\nBest regards,\n[Your Name]',
    tags: ['value', 'proposition', 'general'],
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Follow-up After Event',
    content: 'Hi {{recipient.name}},\n\nIt was great connecting at the recent industry conference. I particularly enjoyed our conversation about the challenges in {{recipient.industry}}.\n\nI thought more about the {{recipient.painPoint}} you mentioned and wanted to share some thoughts on how our solution might help {{recipient.company}}.\n\nWould you be open to a brief follow-up discussion?\n\nBest regards,\n[Your Name]',
    tags: ['follow-up', 'event', 'networking'],
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Referral Introduction',
    content: "Hi {{recipient.name}},\n\nI hope this email finds you well. I was recently speaking with [Mutual Connection], who suggested I reach out to you regarding {{recipient.painPoint}}.\n\nAt [Your Company], we've helped several companies in the {{recipient.industry}} industry address similar challenges. I'd love to share how we might be able to help {{recipient.company}} as well.\n\nWould you be available for a quick call next week?\n\nBest regards,\n[Your Name]",
    tags: ['referral', 'introduction', 'mutual connection'],
    createdAt: new Date(),
  }
];

const TemplateManager = ({ onSelectTemplate, selectedTemplate }: TemplateManagerProps) => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>(SAMPLE_TEMPLATES);
  const [newTemplate, setNewTemplate] = useState<Partial<EmailTemplate>>({
    name: '',
    content: '',
    tags: [],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  useEffect(() => {
    if (!selectedTemplate && templates.length > 0) {
      onSelectTemplate(templates[0]);
    }
  }, [templates, selectedTemplate, onSelectTemplate]);
  
  const handleSaveTemplate = () => {
    if (!newTemplate.name || !newTemplate.content) {
      toast({
        title: "Error",
        description: "Template name and content are required",
        variant: "destructive",
      });
      return;
    }
    
    const tagArray = tagInput.split(',').map(tag => tag.trim()).filter(Boolean);
    
    const template: EmailTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      content: newTemplate.content,
      tags: tagArray,
      createdAt: new Date(),
    };
    
    setTemplates([...templates, template]);
    setNewTemplate({ name: '', content: '', tags: [] });
    setTagInput('');
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "New template has been saved",
    });
    
    if (!selectedTemplate) {
      onSelectTemplate(template);
    }
  };
  
  // Function to format the preview text nicely
  const formatPreviewText = (text: string, maxLength: number = 100): string => {
    // Replace newlines with spaces
    const flattenedText = text.replace(/\n+/g, ' ');
    // Truncate if necessary
    if (flattenedText.length <= maxLength) return flattenedText;
    return flattenedText.substring(0, maxLength) + '...';
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Email Templates</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Email Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  placeholder="Value Proposition"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="templateContent">Template Content</Label>
                <Textarea
                  id="templateContent"
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                  placeholder="Hi {{recipient.name}},\n\nI noticed that {{recipient.company}}..."
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="templateTags">Tags (comma separated)</Label>
                <Input
                  id="templateTags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="sales, follow-up, introduction"
                />
              </div>
              
              <Button onClick={handleSaveTemplate} className="w-full">
                Save Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer hover:border-primary transition-colors ${
                selectedTemplate?.id === template.id ? 'border-2 border-primary' : ''
              }`}
              onClick={() => onSelectTemplate(template)}
            >
              <CardContent className="p-4">
                <h3 className="font-medium text-base mb-2">{template.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-3 mb-3 whitespace-pre-line">
                  {formatPreviewText(template.content)}
                </p>
                <div className="flex gap-1 flex-wrap mt-2">
                  {template.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          {templates.length} templates available. Select a template to use it as a base for your cold email.
        </p>
      </CardFooter>
    </Card>
  );
};

export default TemplateManager;
