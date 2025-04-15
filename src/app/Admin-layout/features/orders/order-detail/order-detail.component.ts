import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IorderHostory } from '../../../../core/Interfaces/iorder-history';
import { OrdersService } from '../../../../core/services/OrdersServices/orders.service';
import { jsPDF } from 'jspdf';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-order-detail',
    imports: [SidebarComponent, CommonModule, RouterModule],
    templateUrl: './order-detail.component.html',
    styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit {
  order: IorderHostory | undefined;
  currentDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private orderService: OrdersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrdersDetails(id).subscribe((data) => {
      this.order = data;
      console.log(data);
    });
  }

  generatePDF(): void {
    if (!this.order) return;

    try {
      const doc = new jsPDF();
      
      // Add company logo/header
      doc.setFontSize(20);
      doc.text('Order Details', 105, 20, { align: 'center' });
      
      // Order information
      doc.setFontSize(12);
      doc.text(`Order #${this.order.Id}`, 20, 40);
      doc.text(`Date: ${new Date(this.order.OrderDate).toLocaleDateString()}`, 20, 50);
      doc.text(`Customer: ${this.order.CustomerName}`, 20, 60);
      doc.text(`Total Amount: $${this.order.TotalAmount}`, 20, 70);
      doc.text(`Status: ${this.order.statusMess}`, 20, 80);
      doc.text(`Payment Method: ${this.order.paymentMethodType}`, 20, 90);
      
      // Shipping address
      doc.text('Shipping Address:', 20, 110);
      doc.text(`Name: ${this.order.AddressName}`, 30, 120);
      doc.text(`Address: ${this.order.Address}`, 30, 130);
      doc.text(`City: ${this.order.City}`, 30, 140);
      doc.text(`Phone: ${this.order.PhoneNumber}`, 30, 150);
      
      // Tracking information
      doc.text('Tracking Information:', 20, 170);
      doc.text(`Tracking Number: ${this.order.trackingNumber || 'Not assigned'}`, 30, 180);
      doc.text(`Carrier: ${this.order.carrier || 'Not assigned'}`, 30, 190);
      doc.text(`Estimated Delivery: ${this.order.estimatedDelivery ? new Date(this.order.estimatedDelivery).toLocaleDateString() : 'Not available'}`, 30, 200);
      doc.text(`Assigned To: ${this.order.assignedTo || 'Not assigned'}`, 30, 210);
      
      // Order items
      doc.text('Order Items:', 20, 230);
      
      // Table header
      doc.setFillColor(240, 240, 240);
      doc.rect(20, 235, 170, 10, 'F');
      doc.text('Product', 25, 242);
      doc.text('Quantity', 80, 242);
      doc.text('Price', 120, 242);
      
      // Table rows
      let yPos = 250;
      this.order.Items.$values.forEach((item, index) => {
        if (yPos > 250) {
          doc.line(20, yPos - 5, 190, yPos - 5);
        }
        
        doc.text(item.ProductName.substring(0, 30) + (item.ProductName.length > 30 ? '...' : ''), 25, yPos);
        doc.text(item.Count.toString(), 85, yPos);
        doc.text(`$${item.Price}`, 125, yPos);
        
        yPos += 15;
        
        // Add a new page if we're running out of space
        if (yPos > 270 && index < (this.order?.Items?.$values?.length || 0) - 1) {
          doc.addPage();
          yPos = 20;
        }
      });
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, 20, 290);
        doc.text(`Document ID: ${this.order.Id}-${new Date(this.order.OrderDate).toISOString().split('T')[0].replace(/-/g, '')}`, 105, 290, { align: 'center' });
        doc.text(`Generated: ${new Date().toLocaleString()}`, 190, 290, { align: 'right' });
      }
      
      // Save the PDF
      doc.save(`Order-${this.order.Id}.pdf`);
      this.toastr.success('PDF generated successfully', 'Success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.toastr.error('Failed to generate PDF', 'Error');
    }
  }

  printOrder(): void {
    if (!this.order) return;
    
    try {
      // Create a print-friendly version of the page
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        this.toastr.error('Pop-up blocked. Please allow pop-ups for this site.', 'Error');
        return;
      }
      
      // Generate HTML content for printing
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Order #${this.order.Id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .order-info, .address-info, .tracking-info, .items-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Order Details</h1>
            <h2>Order #${this.order.Id}</h2>
          </div>
          
          <div class="order-info">
            <p><strong>Date:</strong> ${new Date(this.order.OrderDate).toLocaleString()}</p>
            <p><strong>Customer:</strong> ${this.order.CustomerName}</p>
            <p><strong>Total Amount:</strong> $${this.order.TotalAmount}</p>
            <p><strong>Status:</strong> ${this.order.statusMess}</p>
            <p><strong>Payment Method:</strong> ${this.order.paymentMethodType}</p>
          </div>
          
          <div class="address-info">
            <h3>Shipping Address</h3>
            <p><strong>Name:</strong> ${this.order.AddressName}</p>
            <p><strong>Address:</strong> ${this.order.Address}</p>
            <p><strong>City:</strong> ${this.order.City}</p>
            <p><strong>Phone:</strong> ${this.order.PhoneNumber}</p>
          </div>
          
          <div class="tracking-info">
            <h3>Tracking Information</h3>
            <p><strong>Tracking Number:</strong> ${this.order.trackingNumber || 'Not assigned'}</p>
            <p><strong>Carrier:</strong> ${this.order.carrier || 'Not assigned'}</p>
            <p><strong>Estimated Delivery:</strong> ${this.order.estimatedDelivery ? new Date(this.order.estimatedDelivery).toLocaleDateString() : 'Not available'}</p>
            <p><strong>Assigned To:</strong> ${this.order.assignedTo || 'Not assigned'}</p>
            <p><strong>Current Location:</strong> ${this.order.currentLocation || 'Unknown'}</p>
            <p><strong>Tracking Notes:</strong> ${this.order.trackingNotes || 'No tracking notes available.'}</p>
          </div>
          
          <div class="items-info">
            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Brand</th>
                </tr>
              </thead>
              <tbody>
                ${this.order.Items.$values.map(item => `
                  <tr>
                    <td>${item.ProductName}</td>
                    <td>${item.Count}</td>
                    <td>$${item.Price}</td>
                    <td>${item.Category}</td>
                    <td>${item.Brand}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="footer">
            <p>Document ID: ${this.order.Id}-${new Date(this.order.OrderDate).toISOString().split('T')[0].replace(/-/g, '')}</p>
            <p>Generated: ${new Date().toLocaleString()}</p>
          </div>
        </body>
        </html>
      `;
      
      // Write the content to the new window and print
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Wait for images to load before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
      
      this.toastr.success('Print dialog opened', 'Success');
    } catch (error) {
      console.error('Error printing order:', error);
      this.toastr.error('Failed to print order', 'Error');
    }
  }
}
