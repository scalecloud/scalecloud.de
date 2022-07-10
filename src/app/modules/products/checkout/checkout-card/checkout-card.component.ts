import { Component, OnInit } from '@angular/core';

declare var Stripe: any;

@Component({
  selector: 'app-checkout-card',
  templateUrl: './checkout-card.component.html',
  styleUrls: ['./checkout-card.component.scss']
})
export class CheckoutCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Your Stripe public key
    const stripe = Stripe('pk_test_51Gv4psA86yrbtIQrTHaoHoe5ssyYqEYd6N9Uc8xxodxLFDb19cV5ORUqAeH3Y09sghwvN52lzNt111GIxw7W8sLo00TyE22PC3');

    // Create `card` element that will watch for updates
    // and display error messages
    const elements = stripe.elements();
    const card = elements.create('card');
    card.mount('#card-element');
    card.addEventListener('change', (event: { error: { message: string | null; }; }) => {
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
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
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
    }
  }

}
