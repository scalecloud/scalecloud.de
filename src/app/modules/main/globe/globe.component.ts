import { Component, OnInit } from '@angular/core';
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
      devicePixelRatio: 1,
      width: 800,
      height: 800,
      phi: 1,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [236, 0, 0],
      glowColor: [1, 1, 1],
      markers: [
        { location: [54.7945644, 9.397062], size: 0.05 }
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