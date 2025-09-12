import { NotificationService } from "./notification.service";
import { formatDate } from "@angular/common";

describe("NotificationService", () => {
  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService("en-US");
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("#addNotification", () => {
    beforeEach(() => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2020, 1, 2));
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it("should add a notification with formatted date and mark it unread", () => {
      service.addNotification("msg", "sub");
      expect(service.notification.length).toBe(1);
      const note = service.notification[0];
      expect(note.message).toBe("msg");
      expect(note.subtitle).toBe("sub");
      expect(note.date).toBe(
        formatDate(new Date(2020, 1, 2), "dd/MM/yyyy", "en-US")
      );
      expect(note.read).toBeFalsy();
      expect(service.unreadNotifications.length).toBe(1);
      expect(service.addAnimationClass).toBeTruthy();
    });

    it("should add new notifications to the beginning of the list", () => {
      service.addNotification("first", "1");
      service.addNotification("second", "2");
      expect(service.notification.length).toBe(2);
      expect(service.notification[0].message).toBe("second");
      expect(service.notification[1].message).toBe("first");
    });
  });

  describe("#showNotifications", () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = document.createElement("div");
      element.id = "notification-list";
      document.body.appendChild(element);
    });

    afterEach(() => {
      document.body.removeChild(element);
    });

    it("should display list when hidden", () => {
      element.style.display = "none";
      service.showNotifications();
      expect(element.style.display).toBe("block");
    });

    it("should hide list and mark notifications as read", () => {
      service.addNotification("msg", "sub");
      element.style.display = "block";
      service.showNotifications();
      expect(element.style.display).toBe("none");
      expect(service.unreadNotifications.length).toBe(0);
      expect(service.notification.every((n) => n.read)).toBeTruthy();
    });
  });

  it("should clear all notifications", () => {
    service.addNotification("a", "b");
    service.clearNotifications();
    expect(service.notification.length).toBe(0);
    expect(service.unreadNotifications.length).toBe(0);
  });
});
