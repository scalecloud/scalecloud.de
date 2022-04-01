import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import createGlobe from 'cobe';

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.scss']
})
export class GlobeComponent implements OnInit {
// https://github.com/shuding/cobe
  public phi = 1;

  ngOnInit(): void {
    
    let phi = 0;
    let canvas = <HTMLCanvasElement>document.getElementById("cobe");

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: 1000,
      height: 1000,
      phi: 1,
      theta: 0,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [1, 0.5, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [54.7945644, 9.397062], size: 0.03 }
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi
        phi += 0.01
      },
    })
  }
}