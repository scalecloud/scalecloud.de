import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { DecimalPipe } from '@angular/common';
import { OpenCloudOverviewReply } from '../opencloud-management-model';

@Component({
  selector: 'app-opencloud-summary',
  templateUrl: './opencloud-summary.html',
  styleUrl: './opencloud-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, MatIcon, MatButton],
})
export class OpenCloudSummary {
  readonly overview = input.required<OpenCloudOverviewReply>();
  readonly manageTotal = output<void>();
  readonly totalStorage = computed(() => this.overview().totalQuantity * this.overview().storageAmount);
  readonly allocatedStorage = computed(() => this.allocatedQuantity() * this.overview().storageAmount);
  readonly availableStorage = computed(() => this.availableQuantity() * this.overview().storageAmount);
  readonly peopleQuantity = computed(() =>
    this.overview().owner.storageQuantity + this.overview().users.reduce((total, user) => total + user.storageQuantity, 0),
  );
  readonly peopleStorage = computed(() => this.peopleQuantity() * this.overview().storageAmount);
  readonly spacesQuantity = computed(() => this.overview().spaces.reduce((total, space) => total + space.storageQuantity, 0));
  readonly spacesStorage = computed(() => this.spacesQuantity() * this.overview().storageAmount);
  readonly freeStorage = computed(() => this.availableQuantity() * this.overview().storageAmount);
  readonly usageSeries = computed(() => {
    const dailyTotals = new Map<string, number>();
    const resources = [this.overview().owner, ...this.overview().users, ...this.overview().spaces];
    for (const resource of resources) {
      for (const point of resource.dailyUsage ?? []) {
        dailyTotals.set(point.date, (dailyTotals.get(point.date) ?? 0) + point.usedQuantity);
      }
    }
    return [...dailyTotals.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([date, usedQuantity]) => ({ date, usedQuantity }));
  });
  readonly currentUsage = computed(() => this.usageSeries().at(-1)?.usedQuantity ?? 0);
  readonly usageDelta = computed(() => {
    const series = this.usageSeries();
    return series.length > 1 ? series.at(-1)!.usedQuantity - series[0].usedQuantity : 0;
  });
  readonly usageChart = computed(() => {
    const series = this.usageSeries();
    if (series.length === 0) return { line: '', area: '', lastX: 0, lastY: 0 };
    const max = Math.max(...series.map((point) => point.usedQuantity), 0.01) * 1.12;
    const coordinates = series.map((point, index) => {
      const x = series.length === 1 ? 400 : index / (series.length - 1) * 400;
      const y = 116 - point.usedQuantity / max * 104;
      return [x, y] as const;
    });
    const line = coordinates.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    const [lastX, lastY] = coordinates.at(-1) ?? [0, 0];
    return { line, area: `${line} L400,130 L0,130 Z`, lastX, lastY };
  });
  readonly allocatedQuantity = computed(() => {
    const data = this.overview();
    return data.owner.storageQuantity
      + data.users.reduce((total, user) => total + user.storageQuantity, 0)
      + data.spaces.reduce((total, space) => total + space.storageQuantity, 0);
  });
  readonly availableQuantity = computed(() =>
    Math.max(0, this.overview().totalQuantity - this.allocatedQuantity()),
  );
  readonly allocationPercent = computed(() => {
    const total = this.overview().totalQuantity;
    return total > 0 ? Math.min(100, this.allocatedQuantity() / total * 100) : 0;
  });

  segmentPercent(quantity: number): number {
    const total = this.overview().totalQuantity;
    return total > 0 ? Math.min(100, quantity / total * 100) : 0;
  }
}