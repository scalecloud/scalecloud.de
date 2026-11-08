import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, startWith } from 'rxjs';

interface Breadcrumb {
  label: string;
  url: string;
  current: boolean;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class Breadcrumbs {
  private readonly router = inject(Router);
  private readonly navigationEnd = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      startWith(null),
    ),
    { initialValue: null },
  );

  readonly items = computed(() => {
    this.navigationEnd();
    const items: Breadcrumb[] = [];
    let urlSegments: string[] = [];
    let route = this.router.routerState.snapshot.root;

    while (route) {
      urlSegments = [...urlSegments, ...route.url.map(segment => segment.path)];
      const label = route.routeConfig?.data?.['breadcrumb'];

      if (typeof label === 'string') {
        items.push({ label, url: `/${urlSegments.join('/')}`, current: false });
      }

      if (!route.firstChild) {
        break;
      }
      route = route.firstChild;
    }

    return items.map((item, index) => ({
      ...item,
      current: index === items.length - 1,
    }));
  });
}