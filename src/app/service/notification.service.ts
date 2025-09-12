import { formatDate } from '@angular/common';
import { ElementRef, Inject, Injectable, LOCALE_ID, OnInit, ViewChild } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnInit {

  notification: any[] = [];
  unreadNotifications: any[] = [];
  readNotifications: any[] = [];
  addAnimationClass: boolean = false;

  constructor(@Inject(LOCALE_ID) private locale: string) { }

  ngOnInit() {
  }

  addNotification(message, subtitle) {
    let date = new Date();
    let notificationMsg = { message: message, subtitle: subtitle, date: formatDate(date, "dd/MM/yyyy", this.locale), read: false }
    this.notification.unshift(notificationMsg);

    // Filtrar notificações não lidas (read: false)
    this.unreadNotifications = this.notification.filter(notification => !notification.read);
    this.addAnimationClass = this.unreadNotifications.length > 0;
  }

  showNotifications() {
    const notificationList = document.getElementById('notification-list');

    // Verifique se a lista de notificações está visível ou não
    if (notificationList.style.display === 'none' || !notificationList.style.display) {
      notificationList.style.display = 'block'; // Mostrar o dropdown
    } else {
      notificationList.style.display = 'none'; // Ocultar o dropdown
      this.unreadNotifications = [];
      this.notification.forEach(notification => {
        notification.read = true;
      });
    }
  }

  clearNotifications() {
    this.notification = [];
    this.unreadNotifications = [];
  }
}
