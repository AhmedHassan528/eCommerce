import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgChartsConfiguration } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { OrdersService } from '../../../../core/services/OrdersServices/orders.service';
import { IorderHostory } from '../../../../core/Interfaces/iorder-history';

Chart.register(...registerables);

@Component({
    selector: 'app-order-status-messages',
    imports: [CommonModule, TranslateModule],
    template: `
    <div class="card">
      <div class="card-header">
        <h3>{{ 'ORDER_STATUS_DISTRIBUTION' | translate }}</h3>
      </div>
      <div class="card-body">
        <div class="chart-container">
          <canvas id="orderStatusMessagesChart"></canvas>
        </div>
        <div class="stats-container mt-4">
          <div class="row">
            <div class="col-md-3">
              <div class="stat-card pending">
                <h4>Pending</h4>
                <p>{{ statusCounts.pending }}</p>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card received">
                <h4>Received</h4>
                <p>{{ statusCounts.received }}</p>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card delivered">
                <h4>Delivered</h4>
                <p>{{ statusCounts.delivered }}</p>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card canceled">
                <h4>Canceled</h4>
                <p>{{ statusCounts.canceled }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .card {
      margin: 20px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .card-header {
      background-color: #f8f9fa;
      padding: 15px;
    }
    .chart-container {
      height: 400px;
      position: relative;
      padding: 20px;
    }
    .stats-container {
      padding: 20px;
    }
    .stat-card {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .stat-card.pending {
      background-color: #fef3c7;
    }
    .stat-card.received {
      background-color: #dbeafe;
    }
    .stat-card.delivered {
      background-color: #d1fae5;
    }
    .stat-card.canceled {
      background-color: #fee2e2;
    }
    .stat-card h4 {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
    .stat-card p {
      margin: 10px 0 0;
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -15px;
    }
    .col-md-3 {
      flex: 0 0 25%;
      max-width: 25%;
      padding: 0 15px;
    }
    @media (max-width: 768px) {
      .col-md-3 {
        flex: 0 0 50%;
        max-width: 50%;
        margin-bottom: 15px;
      }
    }
  `]
})
export class OrderStatusMessagesComponent implements OnInit {
  orders: IorderHostory[] = [];
  statusCounts = {
    pending: 0,
    received: 0,
    delivered: 0,
    canceled: 0
  };
  private chart: Chart | null = null;

  constructor(private orderService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.orderService.getAllUserOrders().subscribe({
      next: (response) => {
        if (response && response.$values) {
          this.orders = response.$values;
          this.calculateStatusCounts();
          this.createChart();
        } else {
          console.error('Invalid response format:', response);
        }
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  private calculateStatusCounts(): void {
    this.statusCounts = {
      pending: this.orders.filter(order => order.statusMess === 'Pending').length,
      received: this.orders.filter(order => order.statusMess === 'Received').length,
      delivered: this.orders.filter(order => order.statusMess === 'Delivered').length,
      canceled: this.orders.filter(order => order.statusMess === 'Canceled').length
    };
  }

  private createChart(): void {
    const ctx = document.getElementById('orderStatusMessagesChart') as HTMLCanvasElement;
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Pending', 'Received', 'Delivered', 'Canceled'],
        datasets: [{
          data: [
            this.statusCounts.pending,
            this.statusCounts.received,
            this.statusCounts.delivered,
            this.statusCounts.canceled
          ],
          backgroundColor: [
            'rgba(245, 158, 11, 0.5)',  // Yellow for pending
            'rgba(59, 130, 246, 0.5)',  // Blue for received
            'rgba(34, 197, 94, 0.5)',   // Green for delivered
            'rgba(239, 68, 68, 0.5)'    // Red for canceled
          ],
          borderColor: [
            'rgba(245, 158, 11, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(239, 68, 68, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: {
                size: 14
              }
            }
          },
          title: {
            display: true,
            text: 'Order Status Distribution',
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const total = this.orders.length;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
} 