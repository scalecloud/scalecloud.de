import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import createGlobe, { type Globe } from 'cobe';

@Component({
    selector: 'app-globe',
    templateUrl: './globe.component.html',
    styleUrls: ['./globe.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class GlobeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cobeCanvas', { static: false })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  public globeSize = 0;
  private globe?: Globe;
  private animationFrameId?: number;

  ngOnInit(): void {
    let innerHeight = window.innerHeight;
    let innerWidth = window.innerWidth;
    if (innerWidth > innerHeight) {
      this.globeSize = innerHeight;
    }
    else if( innerWidth < 425) {
      this.globeSize = innerWidth * 55 / 100;
    }
    else {
      this.globeSize = innerWidth * 60 / 100;
    }
  }

  ngAfterViewInit() {
    this.showGlobe();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.globe?.destroy();
  }

  setGlobeSize() {
    return {
      width: `${this.globeSize}px`,
      height: `${this.globeSize}px`,
    };
  }

  showGlobe() {
    let phi = 4;
    const canvas = this.canvasRef.nativeElement;

    this.globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: this.globeSize * 2,
      height: this.globeSize * 2,
      phi: 1,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [236, 0, 0],
      markerElevation: 0.01,
      glowColor: [1, 1, 1],
      markers: [
        { location: [54.7945644, 9.397062], size: 0.02 },
      ],
    });

    const animate = () => {
      if (!this.globe) {
        return;
      }

      this.globe.update({ phi });
      phi += 0.001;
      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }
}
