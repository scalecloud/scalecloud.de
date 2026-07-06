import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Globe } from './globe';
import createGlobe from 'cobe';

// `cobe`'s ESM namespace object is frozen, so vi.spyOn(cobeModule, 'default')
// fails with "Module namespace is not configurable in ESM". Mocking the whole
// module via vi.mock (hoisted above all imports by Vitest) replaces the
// import at resolution time instead of mutating the live namespace object.
vi.mock('cobe', () => ({
    default: vi.fn(),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

function setWindowSize(width: number, height: number): void {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
}

function stubCanvasContext(canvas: HTMLCanvasElement): void {
    vi.spyOn(canvas, 'getContext').mockReturnValue({} as WebGLRenderingContext);
}

// ── Suite ────────────────────────────────────────────────────────────────────

describe('Globe', () => {
    let component: Globe;
    let fixture: ComponentFixture<Globe>;

    let mockGlobe: {
        update: Mock;
        destroy: Mock;
    };
    let createGlobeSpy: Mock;

    beforeEach(async () => {
        // vi.spyOn on the same global (window) across multiple tests reuses the
        // existing spy rather than creating a fresh one, so call counts would
        // otherwise accumulate across the whole suite. Restore real
        // implementations first so each test starts from a clean slate.
        vi.restoreAllMocks();

        // Mock the cobe globe instance
        mockGlobe = {
            update: vi.fn().mockName('update'),
            destroy: vi.fn().mockName('destroy'),
        };

        // createGlobe is already a vi.fn() from the vi.mock factory above;
        // just (re)configure its return value for this test.
        createGlobeSpy = vi.mocked(createGlobe);
        createGlobeSpy.mockReset();
        createGlobeSpy.mockReturnValue(mockGlobe);

        // Prevent the rAF loop from actually running
        vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(42 as unknown as ReturnType<typeof requestAnimationFrame>);
        vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
        });

        setWindowSize(1024, 768);

        await TestBed.configureTestingModule({
    imports: [Globe],
}).compileComponents();

        fixture = TestBed.createComponent(Globe);
        component = fixture.componentInstance;

        // Stub canvas WebGL context before AfterViewInit fires
        const canvas = fixture.debugElement.query(By.css('canvas'))?.nativeElement as HTMLCanvasElement;
        if (canvas)
            stubCanvasContext(canvas);

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

        it('falls back to 60% of width when width equals height (square viewport)', () => {
            // width > height is false when they're equal, so this lands in the
            // "else" 60% branch rather than the landscape branch — documenting
            // the existing boundary behaviour rather than changing it.
            setWindowSize(500, 500);
            component.ngOnInit();
            expect(component.globeSize).toBe(500 * 60 / 100);
        });

        it('uses 55% of width exactly at the 425px narrow-viewport boundary', () => {
            // innerWidth < 425 is strict, so 425 itself falls into the 60% branch.
            setWindowSize(425, 900);
            component.ngOnInit();
            expect(component.globeSize).toBe(425 * 60 / 100);
        });

        it('uses 55% of width just below the narrow-viewport boundary', () => {
            setWindowSize(424, 900);
            component.ngOnInit();
            expect(component.globeSize).toBe(424 * 55 / 100);
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

    it('setGlobeSize() returns 0px dimensions when globeSize is 0', () => {
        component.globeSize = 0;
        const style = component.setGlobeSize();
        expect(style).toEqual({ width: '0px', height: '0px' });
    });

    // ── COBE integration ───────────────────────────────────────────────────────

    describe('showGlobe()', () => {
        it('calls createGlobe with the canvas element', () => {
            const canvas = fixture.debugElement.query(By.css('canvas')).nativeElement;
            expect(createGlobeSpy).toHaveBeenCalledTimes(1);
            expect(createGlobeSpy).toHaveBeenCalledWith(canvas, expect.any(Object));
        });

        it('passes correct initial options to createGlobe', () => {
            const options = vi.mocked(createGlobeSpy).mock.lastCall[1];
            expect(options.dark).toBe(1);
            expect(options.diffuse).toBe(1.2);
            expect(options.mapSamples).toBe(16000);
            expect(options.mapBrightness).toBe(6);
            expect(options.markerElevation).toBe(0.01);
        });

        it('includes exactly one marker at the configured location', () => {
            const options = vi.mocked(createGlobeSpy).mock.lastCall[1];
            expect(options.markers).toHaveLength(1);
            expect(options.markers[0]).toEqual({ location: [54.7945644, 9.397062], size: 0.02 });
        });

        it('sizes the globe canvas as 2× globeSize in the createGlobe options', () => {
            const options = vi.mocked(createGlobeSpy).mock.lastCall[1];
            expect(options.width).toBe(component.globeSize * 2);
            expect(options.height).toBe(component.globeSize * 2);
        });

        it('starts the animation loop via requestAnimationFrame', () => {
            expect(window.requestAnimationFrame).toHaveBeenCalled();
        });

        it('calls globe.update() inside the animation loop', () => {
            // Grab and manually fire the rAF callback for one tick
            const rafCallback = vi.mocked((window.requestAnimationFrame as Mock)).mock.lastCall[0] as FrameRequestCallback;
            rafCallback(0);

            expect(mockGlobe.update).toHaveBeenCalled();
        });

        it('advances phi on each animation frame', () => {
            const rafCallback = vi.mocked((window.requestAnimationFrame as Mock)).mock.lastCall[0] as FrameRequestCallback;

            rafCallback(0);
            const firstPhi = mockGlobe.update.mock.calls[0][0].phi;

            rafCallback(0);
            const secondPhi = mockGlobe.update.mock.calls[1][0].phi;

            expect(secondPhi).toBeGreaterThan(firstPhi);
        });

        it('schedules a new animation frame on each tick', () => {
            const initialCallCount = (window.requestAnimationFrame as unknown as Mock).mock.calls.length;
            const rafCallback = vi.mocked((window.requestAnimationFrame as Mock)).mock.lastCall[0] as FrameRequestCallback;

            rafCallback(0);

            expect((window.requestAnimationFrame as unknown as Mock).mock.calls.length).toBeGreaterThan(initialCallCount);
        });

        it('stops scheduling further frames once the globe is gone', () => {
            const rafCallback = vi.mocked((window.requestAnimationFrame as Mock)).mock.lastCall[0] as FrameRequestCallback;
            (component as any).globe = undefined;

            const callCountBefore = (window.requestAnimationFrame as unknown as Mock).mock.calls.length;
            rafCallback(0);

            expect(mockGlobe.update).not.toHaveBeenCalled();
            expect((window.requestAnimationFrame as unknown as Mock).mock.calls.length).toBe(callCountBefore);
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

        it('does not call cancelAnimationFrame if no frame was ever scheduled', () => {
            (component as any).animationFrameId = undefined;

            // Clear here, right before the action under test, rather than
            // relying on call-count history since the start of the test.
            // window.cancelAnimationFrame is a single shared spy across the
            // whole suite; something outside this test's own control flow
            // (Angular's TestBed teardown of a prior fixture, a leftover
            // rAF-mocked id of 42 from another component instance, etc.) can
            // record a call against it before this assertion runs. Clearing
            // immediately beforehand means the assertion below can only ever
            // reflect what ngOnDestroy() itself does in this test.
            vi.mocked(window.cancelAnimationFrame).mockClear();

            component.ngOnDestroy();

            expect(window.cancelAnimationFrame).not.toHaveBeenCalled();
        });

        it('is safe to call destroy via fixture.destroy()', () => {
            expect(() => fixture.destroy()).not.toThrow();
            expect(mockGlobe.destroy).toHaveBeenCalled();
        });
    });
});