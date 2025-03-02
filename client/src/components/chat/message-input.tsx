import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MessageInputProps {
  selectedPlatform?: string;
}

export default function MessageInput({ selectedPlatform }: MessageInputProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      question: "",
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: { question: string }) => {
      // Append platform context to the question if specific platform is selected
      const contextualQuestion = selectedPlatform && selectedPlatform !== 'all'
        ? `[${selectedPlatform}] ${values.question}`
        : values.question;

      const res = await apiRequest("POST", "/api/messages", {
        question: contextualQuestion
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      form.reset();
      toast({
        title: "Message sent",
        description: "Your question has been sent to the CDP assistant",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error sending message",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const getPlaceholder = () => {
    if (selectedPlatform === 'all') {
      return "Ask about CDP platforms or compare them...";
    }
    return `Ask about ${selectedPlatform}...`;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} 
            className="flex gap-2 mt-4">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder={getPlaceholder()}
                  {...field}
                  disabled={mutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </Form>
  );
}