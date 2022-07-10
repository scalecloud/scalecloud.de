import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProductModel } from '../ProductModel';
import { CheckoutSubscriptionService } from './checkout-subscription.service';
import { CheckoutSubscriptionModel } from './CheckoutSubscriptionModel';

declare var Stripe: any;

@Component({
  selector: 'app-payment-element',
  templateUrl: './payment-element.component.html',
  styleUrls: ['./payment-element.component.scss']
})
export class PaymentElementComponent implements OnInit {

  @Input() productID: string | undefined;
  @Input() quantity: number | undefined;

  constructor(
    public authService: AuthService,
    private checkoutSubscriptionService: CheckoutSubscriptionService
  ) { }

  checkoutSubscriptionModel: CheckoutSubscriptionModel | undefined;

  ngOnInit(): void {
    this.waitForAuth();
  }

  waitForAuth(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        this.createCheckoutSubscription();
      }
    }
    );
  }

  createCheckoutSubscription(): void {
    /* if (this.productID && this.quantity) { */
    const productModel: ProductModel = {
      productID: "prod_Lpo9R0OYdo9s4b",
      quantity: 3,
    }
    /*   const productModel: ProductModel = {
        productID: this.productID,
        quantity: this.quantity,
      } */

      let secret = this.checkoutSubscriptionService.createCheckoutSubscription(productModel).subscribe(checkoutSubscriptionModel => {
        this.checkoutSubscriptionModel = checkoutSubscriptionModel;
        this.initPaymentElements();
      });
   /*  } */
  }

  initPaymentElements(): void {
    // Your Stripe public key
    const stripe = Stripe('pk_test_51Gv4psA86yrbtIQrTHaoHoe5ssyYqEYd6N9Uc8xxodxLFDb19cV5ORUqAeH3Y09sghwvN52lzNt111GIxw7W8sLo00TyE22PC3');
    if (this.checkoutSubscriptionModel) {
      const options = {
        clientSecret: this.checkoutSubscriptionModel.clientSecret,
        // Fully customizable with appearance API.
        appearance: {/*...*/ },
      };

      const elements = stripe.elements(options);
      const paymentElement = elements.create('payment');
      paymentElement.mount('#payment-element');

      paymentElement.addEventListener('change', (event: { error: { message: string | null; }; }) => {
        const displayError = document.getElementById('card-errors');
        if (displayError) {
          if (event.error) {
            displayError.textContent = event.error.message;
          } else {
            displayError.textContent = '';
          }
        }
      });

      // Listen for form submission, process the form with Stripe,
      // and get the 
      /*  const paymentForm = document.getElementById('payment-form'); */
      /*     if (paymentForm) {
            paymentForm.addEventListener('submit', event => {
              event.preventDefault();
              stripe.createToken(card).then((result: { error: { message: string | null; }; token: { id: any; }; }) => {
                if (result.error) {
                  console.log('Error creating payment method.');
                  const errorElement = document.getElementById('card-errors');
                  if (errorElement) {
                    errorElement.textContent = result.error.message;
                  }
                } else {
                  // At this point, you should send the token ID
                  // to your server so it can attach
                  // the payment source to a customer
                  console.log('Token acquired!');
                  console.log(result.token);
                  console.log(result.token.id);
                }
              });
            });
          } */
    }
  }

}
