import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MessageList from "@/components/chat/message-list";
import MessageInput from "@/components/chat/message-input";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Brain, Network, Box, Database, Activity } from "lucide-react";

const platforms = [
  { id: 'all', name: 'All Platforms', icon: Brain },
  { id: 'segment', name: 'Segment', icon: Network },
  { id: 'mparticle', name: 'mParticle', icon: Box },
  { id: 'lytics', name: 'Lytics', icon: Database },
  { id: 'zeotap', name: 'Zeotap', icon: Activity }
];

export default function Chat() {
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/messages"]
  });

  const filteredMessages = selectedPlatform === 'all' 
    ? messages 
    : messages.filter((m: any) => m.metadata?.platform === selectedPlatform);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-200 to-background p-4 md:p-8">
      <Card className="mx-auto max-w-4xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              CDP Support Assistant
            </CardTitle>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id} className="flex items-center gap-2">
                    <platform.icon className="h-4 w-4" />
                    {platform.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            Ask questions about CDP platforms and get detailed answers with cross-platform comparisons.
          </p>
        </CardHeader>
        <CardContent>
          <MessageList messages={filteredMessages} />
          <MessageInput selectedPlatform={selectedPlatform} />
        </CardContent>
      </Card>
    </div>
  );
}