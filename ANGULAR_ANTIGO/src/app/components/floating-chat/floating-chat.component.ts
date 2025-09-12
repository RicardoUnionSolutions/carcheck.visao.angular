import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-floating-chat',
  templateUrl: './floating-chat.component.html',
  styleUrls: ['./floating-chat.component.scss']
})
export class FloatingChatComponent {

  showOptions = false;

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.floating-button')) {
      this.showOptions = false;
    }
  }

  sendEmail() {
    const email = "contato@carcheckbrasil.com.br";
    const fallbackUrl = "https://carcheckbrasil.com.br/contato";

    // Cria e aciona o mailto
    const mailtoLink = document.createElement('a');
    mailtoLink.href = `mailto:${email}`;
    document.body.appendChild(mailtoLink);
    mailtoLink.click();
    document.body.removeChild(mailtoLink);

    window.location.href = fallbackUrl;
  }

}
