import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AddressService } from '../../../core/services/AddressServices/address.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAddress } from '../../../core/Interfaces/iaddress';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faPhone, faCity, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../../core/services/OrdersServices/orders.service';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from '../../../core/services/PaymentServices/payment.service';

@Component({
    selector: 'app-addresses',
    imports: [ReactiveFormsModule, TranslateModule, FontAwesomeModule],
    templateUrl: './addresses.component.html',
    styleUrl: './addresses.component.scss'
})
export class AddressesComponent implements OnInit {
  // Font Awesome
  faTrash = faTrash;
  faPhone = faPhone;
  faCity = faCity;
  faMapMarkerAlt = faMapMarkerAlt;

  // varibles
  getCartId!: number | null;
  addingAddress = false;
  loading = false;
  error: string | null = null;

  private readonly _toastrService = inject(ToastrService);

  // constructor
  constructor(private _addressService:AddressService, private _activatedRoute: ActivatedRoute, private _paymentService:PaymentService) { }

  // get subscribtions
  getAddAdressSub! : any 
  getAllAdressSub! : any
  getDeleteAddressSub! : any
  getAtivatedSub! : any

  //Data
  AllAddress:IAddress[] = []

  // component lifecycle
  ngOnInit(): void {
    
    this.getAtivatedSub = this._activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.getCartId = params.get('id') ? Number(params.get('id')) : null;
      }
    });

    this.GetAllAddresses()
  }

  ngOnDestroy(): void {
    this.getAllAdressSub!.unsubscribe()
  }


  // Form Group
  registerForm: FormGroup = new FormGroup({
    AddressName: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),

    Address: new FormControl(null, [Validators.required]),

    phoneNumber: new FormControl(null, [Validators.required]),

    City: new FormControl(null, [Validators.required]),
  });


  // Add Address Function
  AddressSubmit(){
    this.getAddAdressSub = this._addressService.AddAddress(this.registerForm.value).subscribe({
      next: (res) => {
        this.addingAddress = false;
        this.GetAllAddresses();
        this._toastrService.success('Address Added Successfully', 'Success', {
          timeOut: 3000,
        });
      },
      error: () => {
        this.addingAddress = false;
      }
    })
  }

  // Get All Addresses Function
  GetAllAddresses(){
    this.getAllAdressSub = this._addressService.GetAllAddresses().subscribe({
      next: (res) => {
        this.AllAddress = res.$values

        if (this.AllAddress.length === 0) {
          this._toastrService.info('Please Add Address First', 'Info', {
            timeOut: 3000,
          });
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  // Delete Spciific Address Function
  DeleteAddress(id:number){
    this._addressService.DeleteSpciificAddress(id).subscribe({
      next: (res) => {
        this.AllAddress = res.$values
        this._toastrService.success('Address Deleted Successfully', 'Success', {
          timeOut: 3000,});
      },
      error: (err) => {
        console.log(err);
      }
    })
  }



   async Onlinecheckout(Cartid:number, address:IAddress){
    this.loading = true;
    this.error = null;
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");

    try {

      const response = await this._paymentService.createPayment(Cartid,address.Id,"http://localhost:4200/").toPromise();
      // console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
      // console.log(response);

      // Step 3: Redirect to Stripe Checkout
      const stripe = await this._paymentService.initializeStripe();
      const { error } = await stripe.redirectToCheckout({ sessionId: response.sessionId });

      if (error) {
        this.error = error.message;
      }
    } catch (err) {
      // this.error = err.error || 'Failed to process payment';
    } finally {
      this.loading = false;
    }
  }

  // Add new Address
  AddNewAddress(){
    this.addingAddress = true;
  }


}
