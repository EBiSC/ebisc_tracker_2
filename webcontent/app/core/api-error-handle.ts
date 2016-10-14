import { Observer } from 'rxjs/Observer';

export class ApiErrorHandle {
  private dismissed: boolean = false;
  private retried: boolean = false;

  constructor(
    public error: string,
    private observer: Observer<any>,
    private onDismissFn?: () => any,
    private onRetryFn?: () => any,
  ) { };

  dismiss = function(): void {
    if (this.dismissed) {
      return;
    }
    if (this.observer) {
      this.observer.complete();
    };
    this.dismissed = true;
    if (this.onDismissFn) {
      this.onDismissFn();
    }
    return;
  };

  retry = function(): void {
    if (this.retried) {
      return;
    }
    this.retried = true;
    if (this.onRetryFn) {
      this.onRetryFn();
    }
    return;
  };
}
