
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Key, CheckCircle, AlertCircle, Brain } from 'lucide-react';
import { EnhancedAIService } from '@/services/enhancedAIService';
import { useToast } from '@/hooks/use-toast';

export const AISettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const existingKey = EnhancedAIService.getApiKey();
    if (existingKey) {
      setApiKey(existingKey);
      setIsConnected(true);
    }
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Test the API key with a simple request
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        EnhancedAIService.setApiKey(apiKey);
        setIsConnected(true);
        toast({
          title: "Success! 🎉",
          description: "AI features are now enabled",
        });
      } else {
        throw new Error('Invalid API key');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid API key. Please check and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setApiKey('');
    setIsConnected(false);
    localStorage.removeItem('ai-api-key');
    toast({
      title: "Disconnected",
      description: "AI features have been disabled",
    });
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Configuration
          {isConnected && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">OpenAI API Key</Label>
          <div className="flex gap-2">
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isConnected}
            />
            {!isConnected ? (
              <Button 
                onClick={handleSaveApiKey} 
                disabled={isLoading}
                className="whitespace-nowrap"
              >
                <Key className="w-4 h-4 mr-1" />
                {isLoading ? 'Testing...' : 'Connect'}
              </Button>
            ) : (
              <Button 
                onClick={handleDisconnect} 
                variant="outline"
                className="whitespace-nowrap"
              >
                Disconnect
              </Button>
            )}
          </div>
        </div>

        {!isConnected && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Get your OpenAI API key:</p>
              <p>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/api-keys</a> to create one.</p>
            </div>
          </div>
        )}

        {isConnected && (
          <div className="space-y-2">
            <h4 className="font-medium text-green-800">Enabled AI Features:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Smart scheduling optimization</li>
              <li>• Advanced productivity insights</li>
              <li>• Habit optimization recommendations</li>
              <li>• Workload balancing suggestions</li>
              <li>• Intelligent task prioritization</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
