
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { AISettings as AISettingsType } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

interface AISettingsProps {
  initialSettings: AISettingsType;
  onSaveSettings: (settings: AISettingsType) => void;
}

const AISettings = ({ initialSettings, onSaveSettings }: AISettingsProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AISettingsType>(initialSettings);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleSaveSettings = () => {
    onSaveSettings(settings);
    toast({
      title: "Settings saved",
      description: "AI settings have been updated",
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle>AI Settings</CardTitle>
        <Button variant="ghost" size="sm">
          {isExpanded ? "Hide" : "Show"}
        </Button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="temperature">Temperature: {settings.temperature.toFixed(1)}</Label>
              <span className="text-xs text-muted-foreground">
                {settings.temperature < 0.3 ? "More focused" : 
                 settings.temperature > 0.7 ? "More creative" : "Balanced"}
              </span>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[settings.temperature]}
              onValueChange={(value) => setSettings({...settings, temperature: value[0]})}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="maxTokens">Max Tokens: {settings.maxTokens}</Label>
              <span className="text-xs text-muted-foreground">
                {settings.maxTokens < 300 ? "Shorter response" : 
                 settings.maxTokens > 700 ? "Longer response" : "Standard length"}
              </span>
            </div>
            <Slider
              id="maxTokens"
              min={100}
              max={1000}
              step={50}
              value={[settings.maxTokens]}
              onValueChange={(value) => setSettings({...settings, maxTokens: value[0]})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key (Optional)</Label>
            <Input
              id="apiKey"
              type="password"
              value={settings.apiKey || ''}
              onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
              placeholder="Enter your API key for higher limits"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use the default API key (with usage limits).
            </p>
          </div>
          
          <Button onClick={handleSaveSettings} className="w-full">
            Save Settings
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default AISettings;
