import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Network, Box, Database, Activity, AlertCircle } from "lucide-react";
import type { Message as MessageType } from "@shared/schema";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MessageProps {
  message: MessageType;
}

const PlatformIcon = ({ platform }: { platform?: string }) => {
  switch (platform?.toLowerCase()) {
    case 'segment':
      return <Network className="h-4 w-4" />;
    case 'mparticle':
      return <Box className="h-4 w-4" />;
    case 'lytics':
      return <Database className="h-4 w-4" />;
    case 'zeotap':
      return <Activity className="h-4 w-4" />;
    default:
      return <Brain className="h-4 w-4" />;
  }
};

const ComparisonContent = ({ content }: { content: string }) => {
  const sections = content.split('\n#');
  return (
    <div className="prose prose-sm max-w-none">
      {sections.map((section, index) => {
        if (!section.trim()) return null;

        const lines = section.split('\n');
        const title = lines[0];
        const content = lines.slice(1).join('\n');

        return (
          <div key={index} className="mb-4">
            {index === 0 ? (
              <div className="font-medium text-lg mb-2">{section}</div>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-2">{title}</h3>
                <div className="pl-4 border-l-2 border-muted">{content}</div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function Message({ message }: MessageProps) {
  const isError = message.answer.toLowerCase().includes('error') || 
                 message.answer.toLowerCase().includes('failed');
  const isComparison = message.metadata?.category === 'comparison';

  const confidence = message.metadata?.confidence || 0;

  return (
    <Card className={`border-l-4 ${isError ? 'border-destructive' : ''}`} style={{
      borderLeftColor: isError ? 'hsl(var(--destructive))' :
                      confidence >= 0.8 ? 'hsl(var(--primary))' : 
                      confidence >= 0.6 ? 'hsl(var(--warning))' : 
                      'hsl(var(--muted))'
    }}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0">
              <PlatformIcon platform={message.metadata?.platform} />
            </div>
            <div className="font-medium text-primary flex-grow">
              {message.question}
            </div>
          </div>

          <div className="pl-6">
            {isError ? (
              <Alert variant="destructive" className="my-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{message.answer}</AlertDescription>
              </Alert>
            ) : isComparison ? (
              <ComparisonContent content={message.answer} />
            ) : (
              <div className="text-muted-foreground whitespace-pre-wrap">
                {message.answer}
              </div>
            )}
          </div>

          <div className="flex gap-2 pl-6">
            {message.metadata?.platform && (
              <Badge variant="outline" className="flex items-center gap-1">
                <PlatformIcon platform={message.metadata.platform} />
                {message.metadata.platform}
              </Badge>
            )}
            {message.metadata?.category && (
              <Badge variant="secondary">
                {message.metadata.category}
              </Badge>
            )}
            <Badge variant={confidence >= 0.8 ? "default" : 
                         confidence >= 0.6 ? "outline" : 
                         "secondary"}>
              {Math.round(confidence * 100)}% confidence
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}