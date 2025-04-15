import { Component } from '@angular/core';
import { PaymentService } from '../../../core/services/PaymentServices/payment.service';
import { loadStripe , Stripe} from '@stripe/stripe-js';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-payment',
    imports: [FormsModule],
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  stripe: Stripe | null = null;
  amount: number = 0;
  publishableKey: string | null = null;

  constructor(private paymentService: PaymentService) {}

  async ngOnInit() {
    await this.fetchPublishableKey();
    console.log('Stripe:', this.stripe);
  }

  async fetchPublishableKey() {
    try {
      const response = await this.paymentService.getPublishableKey().toPromise();
      this.publishableKey = response.publishableKey;
      if (this.publishableKey) {
        this.stripe = await loadStripe(this.publishableKey);
        if (this.stripe) {
          console.log('Stripe initialized with key:', this.publishableKey);
        } else {
          console.error('Failed to initialize Stripe');
        }
      } else {
        console.error('Publishable key not found');
      }
    } catch (error) {
      console.error('Error fetching publishable key:', error);
    }
  }

  async createCheckoutSession() {
    if (!this.stripe) {
      console.error('Stripe not initialized');
      return;
    }
    if (!this.amount || this.amount < 50) {
      console.error('Amount must be at least 50 cents');
      return;
    }

    try {
      const response = await this.paymentService.createPaymentIntent(this.amount).toPromise();
      const sessionId = response.sessionId;
      if (sessionId) {
        this.redirectToCheckout(sessionId);
      } else {
        console.error('Session ID not found');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  }

  redirectToCheckout(sessionId: string) {
    if (this.stripe) {
      this.stripe.redirectToCheckout({
        sessionId: sessionId,
      }).then((result: any) => {
        if (result.error) {
          console.error('Error redirecting to Checkout:', result.error.message);
        }
      });
    }
  }
}


