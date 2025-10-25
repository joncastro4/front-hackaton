import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class InicioComponent implements OnInit {

  private accountId = '68fa7c769683f20dd51a3eec';
  
  purchases: Purchase[] = [];
  merchants: { [key: string]: string } = {};
  loading = true;
  error: string | null = null;

  // Estadísticas
  totalAmount = 0;
  totalTransactions = 0;
  averageAmount = 0;

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
            return '$' + value;
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
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += '$' + context.parsed.toFixed(2);
            }
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
            return '$' + value;
          }
        }
      }
    }
  };

  constructor(private purchasesService: Purchases) {}

  ngOnInit() {
    console.log('🔵 Componente Inicio iniciado');
    this.loadData();
  }

  async loadData() {
    console.log('🟢 LoadData ejecutándose...');
    try {
      this.loading = true;
      
      // Obtener compras
      const purchasesData: any = await this.purchasesService
        .getPurchases(this.accountId)
        .toPromise();
      
      // Mostrar TODAS las compras (no filtrar canceladas)
      this.purchases = purchasesData;
      
      console.log('Total de compras:', this.purchases.length);
      
      // Obtener merchants únicos
      const merchantIds = [...new Set(this.purchases.map(p => p.merchant_id))];
      console.log('Merchant IDs únicos:', merchantIds);
      
      // Obtener información de cada merchant
      for (const merchantId of merchantIds) {
        console.log('Obteniendo merchant:', merchantId);
        try {
          const merchantData: any = await this.purchasesService
            .getMerchant(merchantId)
            .toPromise();
          console.log('Merchant data recibida:', merchantData);
          this.merchants[merchantId] = merchantData.name || `Merchant ${merchantId.slice(-4)}`;
        } catch (err) {
          console.error(`Error obteniendo merchant ${merchantId}:`, err);
          this.merchants[merchantId] = `Merchant ${merchantId.slice(-4)}`;
        }
      }

      console.log('Merchants cargados:', this.merchants);

      // Calcular estadísticas
      this.calculateStats();
      
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
  }

 prepareChartData() {
  // Bar Chart Data
  const merchantTotals: { [key: string]: number } = {};
  this.purchases.forEach(p => {
    const merchantName = this.merchants[p.merchant_id] || 'Desconocido';
    merchantTotals[merchantName] = (merchantTotals[merchantName] || 0) + p.amount;
  });

  console.log('Totales por merchant:', merchantTotals);

  // Ordenar merchants por monto (de mayor a menor)
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
}