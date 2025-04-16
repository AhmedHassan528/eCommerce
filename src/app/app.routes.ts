import { Routes } from '@angular/router';
import { HomeComponent } from './layout/page/home/home.component';
import { CartComponent } from './layout/additions/cart/cart.component';
import { ProductsComponent } from './layout/page/products/products.component';
import { CategoriesComponent } from './layout/page/categories/categories.component';
import { BrandsComponent } from './layout/page/brands/brands.component';
import { LoginComponent } from './layout/page/Auth/login/login.component';
import { RegisterComponent } from './layout/page/Auth/register/register.component';
import { ForgetPasswordComponent } from './layout/page/Auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './layout/page/Auth/reset-password/reset-password.component';
import { logedGuard } from './core/guards/loged.guard';
import { authGuard } from './core/guards/auth.guard';
import { ProductDetailsComponent } from './layout/additions/product-details/product-details.component';
import { AddressesComponent } from './layout/page/addresses/addresses.component';
import { WishListComponent } from './layout/page/wish-list/wish-list.component';
import { OrderHistoryComponent } from './layout/page/order-history/order-history.component';
import { ConfirmEmailComponent } from './layout/page/Auth/confirm-email/confirm-email.component';
import { ChatComponent } from './layout/additions/chat/chat.component';
import { AdminBrandComponent } from './Admin-layout/page/admin-brand/admin-brand.component';
import { PaymentComponent } from './layout/additions/payment/payment.component';
import { DashboardComponent } from './Admin-layout/features/dashboard/dashboard.component';
import { OrderListComponent } from './Admin-layout/features/orders/order-list/order-list.component';
import { OrderDetailComponent } from './Admin-layout/features/orders/order-detail/order-detail.component';
import { AdminProductComponent } from './Admin-layout/page/admin-product/admin-product.component';
import { AdminCategoryComponent } from './Admin-layout/page/admin-category/admin-category.component';
import { NotFoundComponent } from './layout/additions/not-found/not-found.component';
import { UnauthorizedComponent } from './layout/additions/unauthorized/unauthorized.component';
import { MakeAdminComponent } from './Admin-layout/features/user-management/make-admin/make-admin.component';
import { UserListComponent } from './Admin-layout/features/user-management/user-list/user-list.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: "home", component: HomeComponent},
    {path: "chat", component: ChatComponent},
    {path: "Details/:id", component: ProductDetailsComponent},
    {path: "cart", component: CartComponent , canActivate: [authGuard]},
    {path: "withList", component: WishListComponent , canActivate: [authGuard]},
    {path: "products", component: ProductsComponent , canActivate: [authGuard]},
    {path: "categories", component: CategoriesComponent , canActivate: [authGuard]},
    {path: "brands", component: BrandsComponent , canActivate: [authGuard]},
    {path: "orderHistory", component: OrderHistoryComponent , canActivate: [authGuard]},
    {path: "orderHistory/:session_id", component: OrderHistoryComponent , canActivate: [authGuard]},
    {path: "address", component: AddressesComponent , canActivate: [authGuard]},
    {path: "address/:id", component: AddressesComponent , canActivate: [authGuard]},
    {path: "Payment", component: PaymentComponent},
    {path: "login", component: LoginComponent, canActivate: [logedGuard]},
    {path: "ConfirmEmail", component: ConfirmEmailComponent, canActivate: [logedGuard]},
    {path: "ForgetPassword", component: ForgetPasswordComponent, canActivate: [logedGuard]},
    {path: "reset-password/ConfirmEmail", component: ResetPasswordComponent, canActivate: [logedGuard]},
    {path: "register", component: RegisterComponent , canActivate: [logedGuard] },
    {path: "not-found", component: NotFoundComponent},
    {path: "unauthorized", component: UnauthorizedComponent},
    {
        path: 'admin',
        children: [
            { path: '', component: DashboardComponent },
            { path: 'orders', component: OrderListComponent },
            { path: 'orders/:id', component: OrderDetailComponent },
            { path: 'products', component: AdminProductComponent },
            { path: 'categories', component: AdminCategoryComponent },
            { path: 'brands', component: AdminBrandComponent },
            { path: 'make-admin', component: MakeAdminComponent },
            { path: 'users', component: UserListComponent }
        ]
    },
    {path: "**", component: HomeComponent}
];
