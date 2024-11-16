import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { View, Map, Feature } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Icon } from 'ol/style';
import { Punto } from '../../interfaces/punto';

@Component({
  selector: 'app-mapa',
  standalone: true,
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  map!: Map;
  vectorSource: VectorSource;

  puntos: Punto[] = [
    { latitud: -31.390312485072155, longitud: -57.95325964113459 }, // Coordenadas de Salto, Uruguay
  ];

  constructor() {
    this.vectorSource = new VectorSource();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap(): void {
    const tileLayer = new TileLayer({
      source: new OSM({
        attributions: [
          'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ],
        maxZoom: 19, // Limitando el zoom máximo para mejorar el rendimiento
      }),
    });

    const view = new View({
      center: fromLonLat([-57.95325964113459, -31.390312485072155]), // Coordenadas de Salto, Uruguay
      zoom: 13,
      minZoom: 10, // Establecer un zoom mínimo para evitar errores al hacer zoom hacia atrás
      maxZoom: 19, // Establecer un zoom máximo para evitar errores al hacer zoom hacia adelante
    });

    const vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });

    this.map = new Map({
      target: this.mapContainer.nativeElement,
      layers: [tileLayer, vectorLayer],
      view: view,
    });

    for (let punto of this.puntos) {
      this.addPointGeometry([punto.longitud, punto.latitud]);
    }
  }

  // Agrega un punto/s al mapa
  private addPointGeometry(coordinates: [number, number]): void {
    const pointFeature = new Feature({
      geometry: new Point(fromLonLat(coordinates)),
    });

    pointFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png',
        }),
      }),
    );

    this.vectorSource.addFeature(pointFeature);
  }
}
