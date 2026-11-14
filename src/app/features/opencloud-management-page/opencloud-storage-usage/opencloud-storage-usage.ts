import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { OpenCloudUsagePoint } from '../opencloud-management-model';

interface UsageChart {
  line: string;
  area: string;
  lastX: number;
  lastY: number;
}

@Component({
  selector: 'app-opencloud-storage-usage',
  templateUrl: './opencloud-storage-usage.html',
  styleUrl: './opencloud-storage-usage.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, MatButton, MatProgressBar],
})
export class OpenCloudStorageUsage {
  readonly label = input.required<string>();
  readonly storageQuantity = input.required<number>();
  readonly minimumQuantity = input(1);
  readonly usedQuantity = input(0);
  readonly storageAmount = input.required<number>();
  readonly storageUnit = input.required<string>();
  readonly availableQuantity = input.required<number>();
  readonly busy = input(false);
  readonly dailyUsage = input<OpenCloudUsagePoint[]>([]);
  readonly quantityChange = output<number>();
  readonly assignFirstUnit = output<void>();

  readonly hasUsage = computed(() => this.usedQuantity() > 0 || this.dailyUsage().length > 0);
  readonly usagePercent = computed(() => this.storageQuantity() > 0
    ? Math.min(100, Math.max(0, this.usedQuantity() / this.storageQuantity() * 100))
    : this.usedQuantity() > 0 ? 100 : 0);
  readonly usageChart = computed<UsageChart>(() => {
    const series = [...this.dailyUsage()].sort((left, right) => left.date.localeCompare(right.date)).slice(-30);
    if (series.length === 0) return { line: '', area: '', lastX: 0, lastY: 0 };

    const max = Math.max(...series.map((point) => point.usedQuantity), 0.01) * 1.12;
    const coordinates = series.map((point, index) => {
      const x = series.length === 1 ? 300 : index / (series.length - 1) * 300;
      const y = 40 - point.usedQuantity / max * 34;
      return [x, y] as const;
    });
    const line = coordinates
      .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
      .join(' ');
    const [lastX, lastY] = coordinates.at(-1) ?? [0, 0];
    return { line, area: `${line} L300,48 L0,48 Z`, lastX, lastY };
  });
}
