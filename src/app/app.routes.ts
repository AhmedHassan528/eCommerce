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

export const routes: Routes = [

    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: "home", component: HomeComponent},
    {path: "cart", component: CartComponent , canActivate: [authGuard]},
    {path: "products", component: ProductsComponent , canActivate: [authGuard]},
    {path: "categories", component: CategoriesComponent , canActivate: [authGuard]},
    {path: "brands", component: BrandsComponent , canActivate: [authGuard]},

    {path: "login", component: LoginComponent, canActivate: [logedGuard]},
    {path: "ForgetPassword", component: ForgetPasswordComponent, canActivate: [logedGuard]},

    {path: "register", component: RegisterComponent , canActivate: [logedGuard] },


    {path: "**", redirectTo: '/home'}
    
    

];
