import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgChartsConfiguration } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { OrdersService } from '../../../../core/services/OrdersServices/orders.service';
import { IorderHostory } from '../../../../core/Interfaces/iorder-history';

Chart.register(...registerables);

@Component({
    selector: 'app-order-trend',
    imports: [CommonModule, TranslateModule],
    template: `
    <div class="card">
      <div class="card-header">
        <h3>{{ 'ORDER_TREND' | translate }}</h3>
      </div>
      <div class="card-body">
        <div class="chart-container">
          <canvas id="orderTrendChart"></canvas>
        </div>
        <div class="stats-container mt-4">
          <div class="row">
            <div class="col-md-4">
              <div class="stat-card">
                <h4>Total Orders (15 Days)</h4>
                <p>{{ totalOrders }}</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="stat-card">
                <h4>Average Orders/Day</h4>
                <p>{{ averageOrdersPerDay.toFixed(1) }}</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="stat-card">
                <h4>Most Active Day</h4>
                <p>{{ mostActiveDay }}</p>
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
export class OrderTrendComponent implements OnInit {
  orders: IorderHostory[] = [];
  dailyOrderCounts: { date: string; count: number }[] = [];
  totalOrders: number = 0;
  averageOrdersPerDay: number = 0;
  mostActiveDay: string = '';
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
          this.processOrderData();
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

  private processOrderData(): void {
    // Get current date
    const today = new Date();
    
    // Create an array of the last 15 days
    const last15Days = Array.from({ length: 15 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      return date;
    }).reverse(); // Reverse to get chronological order
    
    // Initialize daily counts with zeros
    this.dailyOrderCounts = last15Days.map(date => ({
      date: this.formatDate(date),
      count: 0
    }));
    
    // Count orders for each day
    this.orders.forEach(order => {
      const orderDate = new Date(order.OrderDate);
      const formattedOrderDate = this.formatDate(orderDate);
      
      // Check if the order is within the last 15 days
      const dayIndex = this.dailyOrderCounts.findIndex(day => day.date === formattedOrderDate);
      if (dayIndex !== -1) {
        this.dailyOrderCounts[dayIndex].count++;
      }
    });
    
    // Calculate statistics
    this.totalOrders = this.dailyOrderCounts.reduce((sum, day) => sum + day.count, 0);
    this.averageOrdersPerDay = this.totalOrders / 15;
    
    // Find the most active day
    const maxDay = this.dailyOrderCounts.reduce((max, day) => 
      day.count > max.count ? day : max, 
      { date: '', count: 0 }
    );
    this.mostActiveDay = maxDay.date;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }

  private createChart(): void {
    const ctx = document.getElementById('orderTrendChart') as HTMLCanvasElement;
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.dailyOrderCounts.map(day => this.formatDisplayDate(day.date)),
        datasets: [{
          label: 'Number of Orders',
          data: this.dailyOrderCounts.map(day => day.count),
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          tension: 0.4, // This creates the spline effect
          fill: true,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Order Trend (Last 15 Days)',
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                return tooltipItems[0].label;
              },
              label: (context) => {
                return `Orders: ${context.raw}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Orders',
              font: {
                size: 14
              }
            },
            ticks: {
              stepSize: 1
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date',
              font: {
                size: 14
              }
            }
          }
        }
      }
    });
  }

  private formatDisplayDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
} 