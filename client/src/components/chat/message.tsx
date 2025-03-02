import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Message as MessageType } from "@shared/schema";

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="font-medium text-primary">
            Question: {message.question}
          </div>
          <div className="text-muted-foreground">
            {message.answer}
          </div>
          <div className="flex gap-2">
            {message.metadata?.platform && (
              <Badge variant="outline">
                {message.metadata.platform}
              </Badge>
            )}
            {message.metadata?.category && (
              <Badge variant="secondary">
                {message.metadata.category}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
