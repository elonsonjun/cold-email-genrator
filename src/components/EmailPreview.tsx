
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { EmailGenResponse } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface EmailPreviewProps {
  emailResponse: EmailGenResponse | null;
  onRegenerateClick: () => void;
}

const EmailPreview = ({ emailResponse, onRegenerateClick }: EmailPreviewProps) => {
  const { toast } = useToast();
  const [subject, setSubject] = useState(emailResponse?.subject || '');
  const [content, setContent] = useState(emailResponse?.content || '');

  if (!emailResponse) {
    return (
      <Card className="w-full min-h-[400px] flex items-center justify-center">
        <CardContent>
          <p className="text-center text-muted-foreground">
            Your generated email will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleCopyEmail = () => {
    const fullEmail = `Subject: ${subject}\n\n${content}`;
    navigator.clipboard.writeText(fullEmail);
    toast({
      title: "Copied to clipboard",
      description: "Email content has been copied to your clipboard",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generated Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject Line</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="font-medium"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Email Body</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>Generated on: {new Date(emailResponse.metadata.generatedAt).toLocaleString()}</p>
          <p>Tokens used: {emailResponse.metadata.tokensUsed}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onRegenerateClick}>
          Regenerate
        </Button>
        <Button onClick={handleCopyEmail}>
          Copy Email
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailPreview;
