import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgChartsConfiguration } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { OrdersService } from '../../../../core/services/OrdersServices/orders.service';
import { IorderHostory } from '../../../../core/Interfaces/iorder-history';

Chart.register(...registerables);

@Component({
    selector: 'app-order-status',
    imports: [CommonModule, TranslateModule],
    template: `
    <div class="card">
      <div class="card-header">
        <h3>{{ 'ORDER_PAYMENT_STATUS' | translate }}</h3>
      </div>
      <div class="card-body">
        <div class="chart-container">
          <canvas id="orderStatusChart"></canvas>
        </div>
        <div class="stats-container mt-4">
          <div class="row">
            <div class="col-md-4">
              <div class="stat-card">
                <h4>Total Orders</h4>
                <p>{{ orders.length }}</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="stat-card success">
                <h4>Successful Payments</h4>
                <p>{{ successfulPayments }}</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="stat-card failed">
                <h4>Failed Payments</h4>
                <p>{{ failedPayments }}</p>
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
    .stat-card.success {
      background-color: #d1fae5;
    }
    .stat-card.failed {
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
    .col-md-4 {
      flex: 0 0 33.333333%;
      max-width: 33.333333%;
      padding: 0 15px;
    }
    @media (max-width: 768px) {
      .col-md-4 {
        flex: 0 0 100%;
        max-width: 100%;
        margin-bottom: 15px;
      }
    }
  `]
})
export class OrderStatusComponent implements OnInit {
  orders: IorderHostory[] = [];
  successfulPayments: number = 0;
  failedPayments: number = 0;
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
          this.calculatePaymentStats();
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

  private calculatePaymentStats(): void {
    this.successfulPayments = this.orders.filter(order => order.status).length;
    this.failedPayments = this.orders.filter(order => !order.status).length;
  }

  private createChart(): void {
    const ctx = document.getElementById('orderStatusChart') as HTMLCanvasElement;
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Successful Payments', 'Failed Payments'],
        datasets: [{
          data: [this.successfulPayments, this.failedPayments],
          backgroundColor: [
            'rgba(34, 197, 94, 0.5)',  // Green for success
            'rgba(239, 68, 68, 0.5)'   // Red for failed
          ],
          borderColor: [
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
            text: 'Order Payment Status Distribution',
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