import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ChatService } from '../../../core/services/Chat-Services/chat.service'; // Adjust the path as needed
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  sender: string;
  text: string;
  timestamp: string;
  status: string;
}

@Component({
    selector: 'app-chat',
    imports: [CommonModule, FormsModule],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss',
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translateY(0)'
            })),
            state('out', style({
                transform: 'translateY(100%)'
            })),
            transition('out => in', [
                animate('300ms ease-in-out')
            ]),
            transition('in => out', [
                animate('300ms ease-in-out')
            ])
        ])
    ]
})
export class ChatComponent {
  isChatOpen = false;
  message: string = '';
  messages: ChatMessage[] = [
    {
      sender: 'FreshCart AI Assistant',
      text: "🛒🤖 𝗛𝗶! 𝗜'𝗺 𝗙𝗿𝗲𝘀𝗵𝗖𝗮𝗿𝘁 𝗔𝗜 𝗔𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁, 𝗵𝗲𝗿𝗲 𝘁𝗼 𝗵𝗲𝗹𝗽 𝘆𝗼𝘂! 🛍️💡",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Delivered'
    }
  ];

  constructor(private chatService: ChatService) {}

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage() {
    if (this.message.trim()) {
      // Add the user's message to the chat
      const userMessage: ChatMessage = {
        sender: 'You',
        text: this.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Sent'
      };
      this.messages.push(userMessage);

      // Send the message to the API via the service
      this.chatService.setMessage(this.message).subscribe({
        next: (response) => {
          const apiMessage: ChatMessage = {
            sender: 'FreshCart AI Assistant',
            text: response.Response || 'Received your message!',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'Delivered'
          };
          this.messages.push(apiMessage);

          // Auto-scroll to the bottom
          setTimeout(() => {
            const messageArea = document.querySelector('.overflow-y-auto');
            if (messageArea) messageArea.scrollTop = messageArea.scrollHeight;
          }, 0);
        },
        error: (error) => {
          console.error('API Error:', error);
          const errorMessage: ChatMessage = {
            sender: 'AI',
            text: 'Sorry, something went wrong. Please try again.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'Delivered'
          };
          this.messages.push(errorMessage);
        }
      });

      // Clear the input
      this.message = '';
    }
  }
}


