import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Purchases } from '../../../services/purchases';

// Interfaces locales
interface Purchase {
  _id: string;
  merchant_id: string;
  medium: string;
  purchase_date: string;
  amount: number;
  status: string;
  description: string;
  type: string;
  payer_id: string;
}

interface Merchant {
  _id?: string;
  name: string;
  category?: string[];
}

interface Insight {
  icon: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'primary';
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class InicioComponent implements OnInit {
  filteredPurchases: any[] = [];
  paginatedPurchases: any[] = [];

  // 🔹 Paginación
  currentPage = 1;
  itemsPerPage = 10; // puedes ajustar el número de filas por página
  totalPages = 1;

    selectedMonth: string = '';
  months = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];

  private accountId = '68fa7c769683f20dd51a3eec';
  
  purchases: Purchase[] = [];
  merchants: { [key: string]: string } = {};
  loading = true;
  error: string | null = null;

  // Estadísticas
  totalAmount = 0;
  totalTransactions = 0;
  averageAmount = 0;
  medianAmount = 0;
  maxAmount = 0;
  minAmount = 0;
  stdDeviation = 0;

  // Insights
  insights: Insight[] = [];

  // Configuración de gráficas
  public barChartType: ChartType = 'bar';
  public pieChartType: ChartType = 'pie';
  public lineChartType: ChartType = 'line';

  // Datos de las gráficas
  public barChartData!: ChartData<'bar'>;
  public pieChartData!: ChartData<'pie'>;
  public lineChartData!: ChartData<'line'>;

  // Opciones de las gráficas
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Gastos por Comercio'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Distribución de Gastos'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            const value = context.parsed as number;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            
            if (label) {
              label += ': ';
            }
            label += '$' + value.toLocaleString() + ' (' + percentage + '%)';
            return label;
          }
        }
      }
    }
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: 'Timeline de Compras'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  constructor(@Inject(Purchases) private purchasesService: Purchases) {}

  ngOnInit() {
    this.loadData();
    this.filteredPurchases = this.purchases;
    this.updatePagination();
  }

  async loadData() {
    try {
      this.loading = true;
      
      // Obtener compras
      const purchasesData: any = await this.purchasesService
        .getPurchases(this.accountId)
        .toPromise();
      
      // Mostrar TODAS las compras
      this.purchases = purchasesData;
      
      // Obtener merchants únicos
      const merchantIds = [...new Set(this.purchases.map(p => p.merchant_id))];
      
      // Obtener información de cada merchant
      for (const merchantId of merchantIds) {
        try {
          const merchantData: any = await this.purchasesService
            .getMerchant(merchantId)
            .toPromise();
          this.merchants[merchantId] = merchantData.name || `Merchant ${merchantId.slice(-4)}`;
        } catch (err) {
          this.merchants[merchantId] = `Merchant ${merchantId.slice(-4)}`;
        }
      }

      // Calcular estadísticas
      this.calculateStats();
      
      // Generar insights
      this.generateInsights();
      
      // Preparar datos para gráficas
      this.prepareChartData();
      
      this.loading = false;
    } catch (err) {
      this.error = 'Error al cargar los datos';
      this.loading = false;
      console.error('Error general:', err);
    }
  }

  calculateStats() {
    this.totalTransactions = this.purchases.length;
    this.totalAmount = this.purchases.reduce((sum, p) => sum + p.amount, 0);
    this.averageAmount = this.totalTransactions > 0 
      ? this.totalAmount / this.totalTransactions 
      : 0;

    // Calcular mediana
    const sortedAmounts = this.purchases.map(p => p.amount).sort((a, b) => a - b);
    const mid = Math.floor(sortedAmounts.length / 2);
    this.medianAmount = sortedAmounts.length % 2 === 0
      ? (sortedAmounts[mid - 1] + sortedAmounts[mid]) / 2
      : sortedAmounts[mid];

    // Max y Min
    this.maxAmount = Math.max(...sortedAmounts);
    this.minAmount = Math.min(...sortedAmounts);

    // Desviación estándar
    const squaredDiffs = this.purchases.map(p => Math.pow(p.amount - this.averageAmount, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / this.totalTransactions;
    this.stdDeviation = Math.sqrt(avgSquaredDiff);
  }

  generateInsights() {
    this.insights = [];

    // Merchant más frecuente
    const merchantCounts: { [key: string]: number } = {};
    this.purchases.forEach(p => {
      const merchantName = this.merchants[p.merchant_id];
      merchantCounts[merchantName] = (merchantCounts[merchantName] || 0) + 1;
    });
    const mostFrequent = Object.entries(merchantCounts).sort(([,a], [,b]) => b - a)[0];
    
    this.insights.push({
      icon: '🏆',
      title: 'Merchant Más Frecuente',
      description: `Realizaste ${mostFrequent[1]} compras en ${mostFrequent[0]}`,
      type: 'primary'
    });

    // Merchant con mayor gasto
    const merchantTotals: { [key: string]: number } = {};
    this.purchases.forEach(p => {
      const merchantName = this.merchants[p.merchant_id];
      merchantTotals[merchantName] = (merchantTotals[merchantName] || 0) + p.amount;
    });
    const biggestSpender = Object.entries(merchantTotals).sort(([,a], [,b]) => b - a)[0];
    const percentage = ((biggestSpender[1] / this.totalAmount) * 100).toFixed(1);
    
    this.insights.push({
      icon: '💰',
      title: 'Mayor Gasto',
      description: `${biggestSpender[0]} representa el ${percentage}% de tus gastos totales ($${biggestSpender[1].toLocaleString()})`,
      type: 'info'
    });

    // Ticket promedio más alto
    const merchantAvgs: { [key: string]: number } = {};
    Object.keys(merchantTotals).forEach(merchant => {
      const count = merchantCounts[merchant];
      merchantAvgs[merchant] = merchantTotals[merchant] / count;
    });
    const highestAvg = Object.entries(merchantAvgs).sort(([,a], [,b]) => b - a)[0];
    
    this.insights.push({
      icon: '📊',
      title: 'Ticket Promedio Más Alto',
      description: `${highestAvg[0]} tiene un ticket promedio de $${highestAvg[1].toLocaleString()}`,
      type: 'success'
    });

    // Alerta de compra máxima
    const maxPurchase = this.purchases.reduce((max, p) => p.amount > max.amount ? p : max);
    const maxMerchant = this.merchants[maxPurchase.merchant_id];
    
    this.insights.push({
      icon: '⚠️',
      title: 'Compra Más Grande',
      description: `Tu mayor compra fue de $${maxPurchase.amount.toLocaleString()} en ${maxMerchant}`,
      type: 'warning'
    });

    // Diversificación
    const uniqueMerchants = Object.keys(merchantTotals).length;
    this.insights.push({
      icon: '🎯',
      title: 'Diversificación',
      description: `Realizaste compras en ${uniqueMerchants} comercios diferentes`,
      type: 'info'
    });

    // Análisis de fechas
    const dates = this.purchases.map(p => p.purchase_date);
    const uniqueDates = [...new Set(dates)];
    const avgPerDay = this.totalAmount / uniqueDates.length;
    
    this.insights.push({
      icon: '📅',
      title: 'Promedio Diario',
      description: `Gastas en promedio $${avgPerDay.toLocaleString()} por día activo`,
      type: 'primary'
    });
  }

  prepareChartData() {
    // Bar Chart Data
    const merchantTotals: { [key: string]: number } = {};
    this.purchases.forEach(p => {
      const merchantName = this.merchants[p.merchant_id] || 'Desconocido';
      merchantTotals[merchantName] = (merchantTotals[merchantName] || 0) + p.amount;
    });

    const sortedMerchants = Object.entries(merchantTotals)
      .sort(([, a], [, b]) => b - a);

    this.barChartData = {
      labels: sortedMerchants.map(([name]) => name),
      datasets: [{
        data: sortedMerchants.map(([, total]) => total),
        label: 'Monto Gastado',
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 1
      }]
    };

    // Pie Chart Data
    this.pieChartData = {
      labels: sortedMerchants.map(([name]) => name),
      datasets: [{
        data: sortedMerchants.map(([, total]) => total),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ]
      }]
    };

    // Line Chart Data
    const dateGroups: { [key: string]: number } = {};
    this.purchases.forEach(p => {
      dateGroups[p.purchase_date] = (dateGroups[p.purchase_date] || 0) + p.amount;
    });

    const sortedDates = Object.keys(dateGroups).sort();
    
    this.lineChartData = {
      labels: sortedDates,
      datasets: [{
        data: sortedDates.map(date => dateGroups[date]),
        label: 'Monto',
        fill: false,
        borderColor: 'rgba(245, 158, 11, 1)',
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    };
  }

  getMerchantName(merchantId: string): string {
    return this.merchants[merchantId] || 'Desconocido';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  applyMonthFilter() {
    if (this.selectedMonth) {
      this.filteredPurchases = this.purchases.filter(p => {
        const month = new Date(p.purchase_date).getMonth() + 1;
        return month === parseInt(this.selectedMonth);
      });
    } else {
      this.filteredPurchases = this.purchases;
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredPurchases.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPurchases = this.filteredPurchases.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
}