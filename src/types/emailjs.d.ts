declare module "@emailjs/browser" {
  export function init(userId: string): void;
  export function send(serviceID: string, templateID: string, templateParams?: Record<string, unknown>, userId?: string): Promise<{ status: number; text: string }>;
  export function sendForm(serviceID: string, templateID: string, form: HTMLFormElement, userId?: string): Promise<{ status: number; text: string }>;
  const defaultExport: {
    init: typeof init;
    send: typeof send;
    sendForm: typeof sendForm;
  };
  export default defaultExport;
}
