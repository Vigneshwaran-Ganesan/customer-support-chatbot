import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MessageList from "@/components/chat/message-list";
import MessageInput from "@/components/chat/message-input";
import { useQuery } from "@tanstack/react-query";

export default function Chat() {
  const { data: messages = [] } = useQuery({
    queryKey: ["/api/messages"]
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from
background-200 to-background p-4 md:p-8">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            CDP Support Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MessageList messages={messages} />
          <MessageInput />
        </CardContent>
      </Card>
    </div>
  );
}
