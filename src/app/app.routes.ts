import { Routes } from '@angular/router';
import { HomeComponent } from './layout/page/home/home.component';
import { CartComponent } from './layout/additions/cart/cart.component';
import { ProductsComponent } from './layout/page/products/products.component';
import { CategoriesComponent } from './layout/page/categories/categories.component';
import { BrandsComponent } from './layout/page/brands/brands.component';
import { LoginComponent } from './layout/page/Auth/login/login.component';
import { RegisterComponent } from './layout/page/Auth/register/register.component';
import { ForgetPasswordComponent } from './layout/page/Auth/forget-password/forget-password.component';
import { logedGuard } from './core/guards/loged.guard';
import { authGuard } from './core/guards/auth.guard';
import { ProductDetailsComponent } from './layout/additions/product-details/product-details.component';
import { AddressesComponent } from './layout/page/addresses/addresses.component';
import { WishListComponent } from './layout/page/wish-list/wish-list.component';
import { OrderHistoryComponent } from './layout/page/order-history/order-history.component';

export const routes: Routes = [

    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: "home", component: HomeComponent},

    {path: "Details/:id", component: ProductDetailsComponent},
    
    {path: "cart", component: CartComponent , canActivate: [authGuard]},
    {path: "withList", component: WishListComponent , canActivate: [authGuard]},

    {path: "products", component: ProductsComponent , canActivate: [authGuard]},
    {path: "categories", component: CategoriesComponent , canActivate: [authGuard]},
    {path: "brands", component: BrandsComponent , canActivate: [authGuard]},
    {path: "orderHistory", component: OrderHistoryComponent , canActivate: [authGuard]},


    {path: "address", component: AddressesComponent , canActivate: [authGuard]},
    {path: "address/:id", component: AddressesComponent , canActivate: [authGuard]},



    {path: "login", component: LoginComponent, canActivate: [logedGuard]},
    {path: "ForgetPassword", component: ForgetPasswordComponent, canActivate: [logedGuard]},

    {path: "register", component: RegisterComponent , canActivate: [logedGuard] },


    {path: "**", redirectTo: '/home'}
    
    

];
