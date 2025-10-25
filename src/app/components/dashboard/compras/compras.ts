import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet'
import 'leaflet.markercluster'
import { icon, Marker } from 'leaflet';

// Interface para tus ubicaciones con datos de dinero
interface LocationWithMoney {
  lat: number;
  lng: number;
  name: string;
  amount: number; // Cantidad de dinero
}

@Component({
  selector: 'app-compras',
  imports: [],
  templateUrl: './compras.html',
  styleUrl: './compras.css',
})
export class Compras implements AfterViewInit {
  private map!: L.Map;
  private markerClusterGroup!: L.MarkerClusterGroup;

  constructor() {
    this.fixMarkerIcons();
  }

  private fixMarkerIcons(): void {
    const iconRetinaUrl = 'marker-icon-2x.png';
    const iconUrl = 'marker-icon.png';
    const shadowUrl = 'marker-shadow.png';
    const iconDefault = icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    Marker.prototype.options.icon = iconDefault;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
      this.addMarkers();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [25.6866, -100.3161],
      zoom: 10
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
      tileSize: 256,
      zoomOffset: 0
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);

    // Configurar MarkerCluster con función personalizada
    this.markerClusterGroup = L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 80,
      iconCreateFunction: (cluster) => {
        // Obtener todos los marcadores del cluster
        const markers = cluster.getAllChildMarkers();
        
        // Sumar el dinero de todos los marcadores
        let totalAmount = 0;
        markers.forEach((marker: any) => {
          if (marker.options.amount) {
            totalAmount += marker.options.amount;
          }
        });

        // Formatear el número con separadores de miles
        const formattedAmount = this.formatCurrency(totalAmount);
        
        // Determinar el tamaño del cluster basado en la cantidad de dinero
        let clusterClass = 'marker-cluster-small';
        if (totalAmount > 100000) {
          clusterClass = 'marker-cluster-large';
        } else if (totalAmount > 50000) {
          clusterClass = 'marker-cluster-medium';
        }

        // Crear el ícono del cluster
        return L.divIcon({
          html: `<div><span>$${formattedAmount}</span></div>`,
          className: `marker-cluster ${clusterClass}`,
          iconSize: L.point(50, 50)
        });
      }
    });

    this.map.addLayer(this.markerClusterGroup);
  }

  private addMarkers(): void {
    const locations: LocationWithMoney[] = [
      { lat: 25.6866, lng: -100.3161, name: 'Monterrey Centro', amount: 15000 },
      { lat: 25.6900, lng: -100.3200, name: 'San Pedro', amount: 25000 },
      { lat: 25.6800, lng: -100.3100, name: 'Santa Catarina', amount: 8500 },
      { lat: 25.7000, lng: -100.3300, name: 'Guadalupe', amount: 12000 },
      { lat: 25.6700, lng: -100.3000, name: 'San Nicolás', amount: 18500 },
      // Agrega más ubicaciones cercanas para ver los clusters
      { lat: 25.6870, lng: -100.3165, name: 'Centro 2', amount: 9500 },
      { lat: 25.6860, lng: -100.3155, name: 'Centro 3', amount: 22000 },
      { lat: 25.6905, lng: -100.3205, name: 'San Pedro 2', amount: 31000 },
    ];

    locations.forEach(location => {
      // Crear marcador con el amount guardado en las opciones
      const marker = L.marker([location.lat, location.lng], {
        amount: location.amount
      } as any);
      
      // Popup con información incluyendo el monto
      marker.bindPopup(`
        <b>${location.name}</b><br>
        <strong>Monto:</strong> $${this.formatCurrency(location.amount)}<br>
        Lat: ${location.lat}<br>
        Lng: ${location.lng}
      `);
      
      this.markerClusterGroup.addLayer(marker);
    });
  }

  // Función para formatear moneda
  private formatCurrency(amount: number): string {
    return amount.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}