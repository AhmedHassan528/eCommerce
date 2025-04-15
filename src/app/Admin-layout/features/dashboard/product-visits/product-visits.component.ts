import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../../../core/services/Items-Service/item.service';
import { IProduct } from '../../../../core/Interfaces/product';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgChartsConfiguration } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-product-visits',
    imports: [CommonModule, TranslateModule],
    template: `
    <div class="card">
      <div class="card-header">
        <h3>{{ 'PRODUCT_ANALYTICS' | translate }}</h3>
      </div>
      <div class="card-body">
        <div class="chart-container">
          <canvas id="productAnalyticsChart"></canvas>
        </div>
        <div class="stats-container mt-4">
          <div class="row">
            <div class="col-md-3">
              <div class="stat-card">
                <h4>Total Products</h4>
                <p>{{ products.length }}</p>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card">
                <h4>Total Visits</h4>
                <p>{{ totalVisits }}</p>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card">
                <h4>Total Likes</h4>
                <p>{{ totalLikes }}</p>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card">
                <h4>Avg. Engagement</h4>
                <p>{{ ((totalLikes / totalVisits) * 100).toFixed(1) }}%</p>
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
      height: 500px;
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
export class ProductVisitsComponent implements OnInit {
  products: IProduct[] = [];
  totalVisits: number = 0;
  totalLikes: number = 0;
  private chart: Chart | null = null;

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.itemService.getAdminItems().subscribe({
      next: (response) => {
        console.log('Products response:', response);
        if (response && response.$values) {
          this.products = response.$values;
          console.log('Products with analytics:', this.products.map(p => ({ 
            title: p.Title, 
            viewCount: p.ViewCount,
            likeCount: p.LikeCount
          })));
          this.calculateTotals();
          this.createChart();
        } else {
          console.error('Invalid response format:', response);
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  private calculateTotals(): void {
    this.totalVisits = this.products.reduce((sum, product) => sum + product.ViewCount, 0);
    this.totalLikes = this.products.reduce((sum, product) => sum + product.LikeCount, 0);
    console.log('Total visits:', this.totalVisits);
    console.log('Total likes:', this.totalLikes);
  }

  private createChart(): void {
    // Sort products by visit count in descending order
    const sortedProducts = [...this.products].sort((a, b) => b.ViewCount - a.ViewCount);
    
    // Take top 20 products for better visualization
    const topProducts = sortedProducts.slice(0, 20);
    console.log('Top 20 products for chart:', topProducts.map(p => ({ 
      title: p.Title, 
      viewCount: p.ViewCount,
      likeCount: p.LikeCount
    })));

    const ctx = document.getElementById('productAnalyticsChart') as HTMLCanvasElement;
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topProducts.map(product => product.Title),
        datasets: [
          {
            label: 'Number of Visits',
            data: topProducts.map(product => product.ViewCount),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'Number of Likes',
            data: topProducts.map(product => product.LikeCount),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            yAxisID: 'y'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Product Visits vs Likes Analysis',
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const datasetLabel = context.dataset.label;
                if (datasetLabel === 'Number of Visits') {
                  const percentage = ((value / this.totalVisits) * 100).toFixed(1);
                  return `Visits: ${value} (${percentage}% of total visits)`;
                } else {
                  const percentage = ((value / this.totalLikes) * 100).toFixed(1);
                  return `Likes: ${value} (${percentage}% of total likes)`;
                }
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Count',
              font: {
                size: 14
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Products',
              font: {
                size: 14
              }
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    });
  }
} 