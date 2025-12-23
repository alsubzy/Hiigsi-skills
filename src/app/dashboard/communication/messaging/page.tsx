'use client';

import * as React from 'react';
import { Search, Send, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { conversations as initialConversations, users } from '@/lib/placeholder-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function MessagingPage() {
  const [conversations, setConversations] = React.useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = React.useState(conversations[0]);
  const [newMessage, setNewMessage] = React.useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const updatedConversation = {
        ...selectedConversation,
        messages: [
          ...selectedConversation.messages,
          { sender: 'You', text: newMessage, time: 'Now' },
        ],
      };
      setSelectedConversation(updatedConversation);
      setConversations(
        conversations.map(c => (c.id === updatedConversation.id ? updatedConversation : c))
      );
      setNewMessage('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-10rem)]">
      <Card className="md:col-span-1 lg:col-span-1 flex flex-col">
        <CardHeader className="p-4">
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-lg">Conversations</CardTitle>
            <Button variant="ghost" size="icon"><UserPlus className="h-5 w-5" /></Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search contacts..." className="pl-8" />
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <CardContent className="p-0">
            {conversations.map((convo) => (
              <div key={convo.id} className={`p-4 cursor-pointer hover:bg-muted ${selectedConversation.id === convo.id ? 'bg-muted' : ''}`} onClick={() => setSelectedConversation(convo)}>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={convo.avatar} alt={convo.contact} />
                    <AvatarFallback>{convo.contact.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-semibold truncate">{convo.contact}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {convo.messages[convo.messages.length - 1].text}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{convo.messages[convo.messages.length - 1].time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </ScrollArea>
      </Card>

      <Card className="md:col-span-2 lg:col-span-3 flex flex-col">
        <CardHeader className="p-4 border-b">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.contact} />
              <AvatarFallback>{selectedConversation.contact.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{selectedConversation.contact}</p>
              <p className="text-sm text-muted-foreground">Online</p>
            </div>
          </div>
        </CardHeader>
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {selectedConversation.messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.sender === 'You' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'You' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="relative">
            <Input 
              placeholder="Type a message..." 
              className="pr-12"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
