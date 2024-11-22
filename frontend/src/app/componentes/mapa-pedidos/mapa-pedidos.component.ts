import { Component, Input, OnInit } from '@angular/core';
import Map from 'ol/Map'; // Clase principal de mapas en OpenLayers
import View from 'ol/View'; // Para definir la vista del mapa
import TileLayer from 'ol/layer/Tile'; // Para usar capas de mapas base
import OSM from 'ol/source/OSM'; // Fuente de mapas OpenStreetMap
import { Feature } from 'ol'; // Para crear características en el mapa
import { Point } from 'ol/geom'; // Geometría de puntos
import VectorSource from 'ol/source/Vector'; // Fuente de capas vectoriales
import VectorLayer from 'ol/layer/Vector'; // Capa para las ubicaciones
import { fromLonLat } from 'ol/proj'; // Para convertir coordenadas

@Component({
  selector: 'app-mapa-pedidos',
  standalone: true,
  templateUrl: './mapa-pedidos.component.html',
  styleUrls: ['./mapa-pedidos.component.scss'],
})
export class MapaPedidosComponent implements OnInit {
  @Input() ubicaciones: { lat: number; lon: number }[] = []; // Entrada de ubicaciones

  mapa!: Map; // Variable para almacenar el mapa

  constructor() {}

  ngOnInit(): void {
    // Inicializar el mapa al cargar el componente
    this.inicializarMapa();
  }

  inicializarMapa() {
    // Crear características para cada ubicación
    const features = this.ubicaciones.map(
      (ubicacion) =>
        new Feature({
          geometry: new Point(fromLonLat([ubicacion.lon, ubicacion.lat])), // Convertir coordenadas
        }),
    );

    // Fuente vectorial para las ubicaciones
    const vectorSource = new VectorSource({
      features,
    });

    // Capa vectorial
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Configuración del mapa
    this.mapa = new Map({
      target: 'mapaPedidos', // ID del contenedor en el HTML
      layers: [
        new TileLayer({
          source: new OSM(), // Mapa base de OpenStreetMap
        }),
        vectorLayer, // Capa de ubicaciones
      ],
      view: new View({
        center: fromLonLat([-57.95325964113459, -31.390312485072155]), // Coordenadas iniciales (Ciudad de México)
        zoom: 12, // Nivel de zoom inicial
      }),
    });
  }
}
