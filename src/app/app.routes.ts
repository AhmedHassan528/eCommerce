import { Routes } from '@angular/router';
import { HomeComponent } from './layout/page/home/home.component';
import { CartComponent } from './layout/additions/cart/cart.component';
import { ProductsComponent } from './layout/page/products/products.component';
import { CategoriesComponent } from './layout/page/categories/categories.component';
import { BrandsComponent } from './layout/page/brands/brands.component';
import { LoginComponent } from './layout/page/Auth/login/login.component';
import { RegisterComponent } from './layout/page/Auth/register/register.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: "home", component: HomeComponent},
    {path: "cart", component: CartComponent},
    {path: "products", component: ProductsComponent},
    {path: "categories", component: CategoriesComponent},
    {path: "brands", component: BrandsComponent},
    {path: "login", component: LoginComponent},
    {path: "register", component: RegisterComponent},


    {path: "**", redirectTo: '/home'}
    
    

];
