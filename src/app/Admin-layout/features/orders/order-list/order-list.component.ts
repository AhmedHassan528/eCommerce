import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { IorderHostory } from '../../../../core/Interfaces/iorder-history';
import { OrdersService } from '../../../../core/services/OrdersServices/orders.service';
import { RouterModule } from '@angular/router';
import { KMPSearchPipe } from '../../../../core/Pipes/kmpsearch.pipe';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-order-list',
    imports: [SidebarComponent, CommonModule, RouterModule, FormsModule],
    templateUrl: './order-list.component.html',
    styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit {
  orders: IorderHostory[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  filteredOrders: IorderHostory[] = [];

  constructor(private orderService: OrdersService) {}

  ngOnInit(): void {
    this.getAllOrders();
  }
  getAllOrders(): void {
    this.orderService.getAllUserOrders().subscribe((data) => {
      this.orders = data.$values;
      this.filterOrders();
    });
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchTerm || 
        order.Id.toString().toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || 
        order.statusMess === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.OrderDate).getTime() - new Date(a.OrderDate).getTime());
  }

  updateStatus(id: number, status: 'Received' | 'Delivered'|'Canceled'): void {
    this.orderService.updateOrderStatus(id, status).subscribe(() => {
      this.orderService.getOrders().subscribe((data) => (this.getAllOrders()));
    });
  }

  exportToExcel(): void {
    // Prepare the data for export
    const exportData = this.filteredOrders.map(order => ({
      'Order ID': order.Id,
      'Customer Name': order.CustomerName,
      'Total Amount': `$${order.TotalAmount}`,
      'Status': order.statusMess,
      'Order Date': new Date(order.OrderDate).toLocaleDateString()
    }));

    // Create worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const workbook: XLSX.WorkBook = { 
      Sheets: { 'Orders': worksheet }, 
      SheetNames: ['Orders'] 
    };

    // Generate Excel file
    XLSX.writeFile(workbook, `Orders_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
}