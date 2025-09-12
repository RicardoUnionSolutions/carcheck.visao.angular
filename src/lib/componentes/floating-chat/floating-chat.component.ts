import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatConfig {
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  theme: "light" | "dark";
  showAvatar: boolean;
  avatarUrl?: string;
  placeholder: string;
  welcomeMessage: string;
}

@Component({
  selector: "ck-floating-chat",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./floating-chat.component.html",
  styleUrls: ["./floating-chat.component.scss"],
})
export class CkFloatingChatComponent implements OnInit {
  @Input() visible: boolean = true;
  @Input() config: ChatConfig = {
    position: "bottom-right",
    theme: "light",
    showAvatar: true,
    avatarUrl: "./assets/images/chat-avatar.png",
    placeholder: "Digite sua mensagem...",
    welcomeMessage: "Olá! Como posso ajudá-lo hoje?",
  };
  @Input() messages: ChatMessage[] = [];
  @Input() isOnline: boolean = true;

  @Output() messageSent = new EventEmitter<string>();
  @Output() chatOpened = new EventEmitter<void>();
  @Output() chatClosed = new EventEmitter<void>();

  isOpen: boolean = false;
  newMessage: string = "";
  isTyping: boolean = false;

  ngOnInit() {
    if (this.messages.length === 0) {
      this.messages = [
        {
          id: "1",
          text: this.config.welcomeMessage,
          sender: "bot",
          timestamp: new Date(),
        },
      ];
    }
  }

  @HostListener("document:keydown.escape", ["$event"])
  onEscapeKey(event: KeyboardEvent) {
    if (this.isOpen) {
      this.closeChat();
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.chatOpened.emit();
    } else {
      this.chatClosed.emit();
    }
  }

  openChat() {
    this.isOpen = true;
    this.chatOpened.emit();
  }

  closeChat() {
    this.isOpen = false;
    this.chatClosed.emit();
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        text: this.newMessage.trim(),
        sender: "user",
        timestamp: new Date(),
      };

      this.messages.push(message);
      this.messageSent.emit(this.newMessage.trim());
      this.newMessage = "";

      // Simular resposta do bot
      this.simulateBotResponse();
    }
  }

  private simulateBotResponse() {
    this.isTyping = true;

    setTimeout(() => {
      const responses = [
        "Entendi sua mensagem. Como posso ajudá-lo melhor?",
        "Obrigado pelo contato! Vou verificar isso para você.",
        "Posso ajudá-lo com mais alguma coisa?",
        "Entendi. Vou encaminhar sua solicitação para nossa equipe.",
        "Perfeito! Há mais alguma dúvida?",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        text: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      this.messages.push(botMessage);
      this.isTyping = false;
    }, 1500);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  getPositionClass(): string {
    return `position-${this.config.position}`;
  }

  getThemeClass(): string {
    return `theme-${this.config.theme}`;
  }
}
