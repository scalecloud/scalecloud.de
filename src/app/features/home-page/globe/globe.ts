import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ChangeDetectionStrategy, viewChild } from '@angular/core';
import createGlobe, { type Globe as CobeGlobe } from 'cobe';
import { NgStyle } from '@angular/common';

@Component({
    selector: 'app-globe',
    templateUrl: './globe.html',
    styleUrls: ['./globe.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgStyle]
})
export class Globe implements OnInit, AfterViewInit, OnDestroy {
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('cobeCanvas');

  public globeSize = 0;
  private globe?: CobeGlobe;
  private animationFrameId?: number;
  private idleCallbackId?: number;
  private idleTimeoutId?: ReturnType<typeof setTimeout>;
  private intersectionObserver?: IntersectionObserver;
  private isInView = true;
  private phi = 4;

  ngOnInit(): void {
    const innerHeight = window.innerHeight;
    const innerWidth = window.innerWidth;
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
    if (typeof requestIdleCallback === 'function') {
      this.idleCallbackId = requestIdleCallback(() => this.showGlobe(), { timeout: 2000 });
    } else {
      this.idleTimeoutId = setTimeout(() => this.showGlobe(), 1);
    }
  }

  ngOnDestroy(): void {
    if (this.idleCallbackId !== undefined && typeof cancelIdleCallback === 'function') {
      cancelIdleCallback(this.idleCallbackId);
    }
    if (this.idleTimeoutId !== undefined) {
      clearTimeout(this.idleTimeoutId);
    }
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.intersectionObserver?.disconnect();
    this.globe?.destroy();
  }

  setGlobeSize() {
    return {
      width: `${this.globeSize}px`,
      height: `${this.globeSize}px`,
    };
  }

  showGlobe() {
    const canvas = this.canvasRef().nativeElement;

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

    this.observeVisibility(canvas);

    if (!this.prefersReducedMotion()) {
      this.startAnimation();
    }
  }

  private prefersReducedMotion(): boolean {
    return typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private observeVisibility(canvas: HTMLCanvasElement): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.isInView = entry.isIntersecting;
      if (this.isInView && !this.animationFrameId) {
        this.startAnimation();
      }
    });
    this.intersectionObserver.observe(canvas);
  }

  private startAnimation(): void {
    const animate = () => {
      if (!this.globe || !this.isInView) {
        this.animationFrameId = undefined;
        return;
      }

      this.globe.update({ phi: this.phi });
      this.phi += 0.001;
      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }
}