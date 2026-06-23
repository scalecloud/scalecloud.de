import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { GlobeComponent } from './globe.component';
import * as cobeModule from 'cobe';

// ── Helpers ──────────────────────────────────────────────────────────────────

function setWindowSize(width: number, height: number): void {
  Object.defineProperty(window, 'innerWidth',  { writable: true, configurable: true, value: width  });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
}

function stubCanvasContext(canvas: HTMLCanvasElement): void {
  spyOn(canvas, 'getContext').and.returnValue({} as WebGLRenderingContext);
}

// ── Suite ────────────────────────────────────────────────────────────────────

describe('GlobeComponent', () => {
  let component: GlobeComponent;
  let fixture: ComponentFixture<GlobeComponent>;

  let mockGlobe: { update: jasmine.Spy; destroy: jasmine.Spy };
  let createGlobeSpy: jasmine.Spy;

  beforeEach(async () => {
    // Mock the cobe globe instance
    mockGlobe = {
      update:  jasmine.createSpy('update'),
      destroy: jasmine.createSpy('destroy'),
    };

    // Replace createGlobe with a spy that returns the mock globe
    createGlobeSpy = spyOn(cobeModule, 'default').and.returnValue(mockGlobe);

    // Prevent the rAF loop from actually running
    spyOn(window, 'requestAnimationFrame').and.returnValue(42 as unknown as ReturnType<typeof requestAnimationFrame>);
    spyOn(window, 'cancelAnimationFrame').and.stub();

    setWindowSize(1024, 768);

    await TestBed.configureTestingModule({
      declarations: [GlobeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobeComponent);
    component = fixture.componentInstance;

    // Stub canvas WebGL context before AfterViewInit fires
    const canvas = fixture.debugElement.query(By.css('canvas'))?.nativeElement as HTMLCanvasElement;
    if (canvas) stubCanvasContext(canvas);

    fixture.detectChanges();
  });

  afterEach(() => {
    setWindowSize(1024, 768);
  });

  // ── Creation ───────────────────────────────────────────────────────────────

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ── Globe size calculation ─────────────────────────────────────────────────

  describe('globeSize (ngOnInit)', () => {
    it('uses innerHeight when landscape (width > height)', () => {
      setWindowSize(1200, 800);
      component.ngOnInit();
      expect(component.globeSize).toBe(800);
    });

    it('uses 55% of width on narrow viewports (< 425px)', () => {
      setWindowSize(400, 700);
      component.ngOnInit();
      expect(component.globeSize).toBe(400 * 55 / 100);
    });

    it('uses 60% of width for medium portrait viewports', () => {
      setWindowSize(600, 900);
      component.ngOnInit();
      expect(component.globeSize).toBe(600 * 60 / 100);
    });
  });

  // ── Canvas binding ─────────────────────────────────────────────────────────

  it('renders a <canvas> element', () => {
    const canvas = fixture.debugElement.query(By.css('canvas'));
    expect(canvas).not.toBeNull();
  });

  it('sets canvas width/height to 2× globeSize', () => {
    setWindowSize(1024, 768);
    component.ngOnInit();
    fixture.detectChanges();

    const canvas: HTMLCanvasElement = fixture.debugElement.query(By.css('canvas')).nativeElement;
    expect(canvas.width).toBe(component.globeSize * 2);
    expect(canvas.height).toBe(component.globeSize * 2);
  });

  // ── Inline style ───────────────────────────────────────────────────────────

  it('setGlobeSize() returns pixel dimensions matching globeSize', () => {
    component.globeSize = 500;
    const style = component.setGlobeSize();
    expect(style).toEqual({ width: '500px', height: '500px' });
  });

  // ── COBE integration ───────────────────────────────────────────────────────

  describe('showGlobe()', () => {
    it('calls createGlobe with the canvas element', () => {
      const canvas = fixture.debugElement.query(By.css('canvas')).nativeElement;
      expect(createGlobeSpy).toHaveBeenCalledOnceWith(canvas, jasmine.any(Object));
    });

    it('passes correct initial options to createGlobe', () => {
      const options = createGlobeSpy.calls.mostRecent().args[1];
      expect(options.dark).toBe(1);
      expect(options.diffuse).toBe(1.2);
      expect(options.mapSamples).toBe(16000);
      expect(options.mapBrightness).toBe(6);
      expect(options.markerElevation).toBe(0.01);
    });

    it('starts the animation loop via requestAnimationFrame', () => {
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('calls globe.update() inside the animation loop', () => {
      // Grab and manually fire the rAF callback for one tick
      const rafCallback = (window.requestAnimationFrame as jasmine.Spy).calls.mostRecent().args[0] as FrameRequestCallback;
      rafCallback(0);

      expect(mockGlobe.update).toHaveBeenCalled();
    });
  });

  // ── Cleanup ────────────────────────────────────────────────────────────────

  describe('ngOnDestroy()', () => {
    it('cancels the animation frame on destroy', () => {
      component.ngOnDestroy();
      expect(window.cancelAnimationFrame).toHaveBeenCalledWith(42);
    });

    it('calls globe.destroy() on destroy', () => {
      component.ngOnDestroy();
      expect(mockGlobe.destroy).toHaveBeenCalledTimes(1);
    });

    it('does not throw if destroyed before globe is initialised', () => {
      (component as any).globe = undefined;
      (component as any).animationFrameId = undefined;
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });
});