import { dirname } from 'node:path';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AddressService } from '../../../core/services/AddressServices/address.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAddress } from '../../../core/Interfaces/iaddress';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../../core/services/OrdersServices/orders.service';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule ,FontAwesomeModule],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.scss'
})
export class AddressesComponent implements OnInit {
  // Font Awesome
  faTrash = faTrash

  // varibles
  getCartId!: string | null;
  addingAddress = false;

  private readonly _toastrService = inject(ToastrService);

  // constructor
  constructor(private _addressService:AddressService,private _ordersService:OrdersService, private _activatedRoute: ActivatedRoute) { }

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
        this.getCartId = params.get('id');
      }
    });

    this.GetAllAddresses()
  }

  ngOnDestroy(): void {
    this.getAllAdressSub!.unsubscribe()
  }


  // Form Group
  registerForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),

    details: new FormControl(null, [Validators.required]),

    phone: new FormControl(null, [Validators.required]),

    city: new FormControl(null, [Validators.required]),
  });


  // Add Address Function
  AddressSubmit(){
    this.getAddAdressSub = this._addressService.AddAddress(this.registerForm.value).subscribe({
      next: (res) => {
        this.addingAddress = false;
        this.AllAddress = res.data
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
        this.AllAddress = res.data

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
  DeleteAddress(id:string){
    this._addressService.DeleteSpciificAddress(id).subscribe({
      next: (res) => {
        this.AllAddress = res.data
        this._toastrService.success('Address Deleted Successfully', 'Success', {
          timeOut: 3000,});
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  // Add Order Function

  Onlinecheckout(Cartid:string, address:IAddress){
    this._ordersService.checkoutSession(Cartid, address).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          window.location.href = res.session.url
        }
        console.log(res);
      },
      error: (err) => {
        console.log(err);
    }});
  }

  // Add new Address
  AddNewAddress(){
    this.addingAddress = true;
  }


}
