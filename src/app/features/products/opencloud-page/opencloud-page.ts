import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ProductClient } from '../product-client/product-client';
import { Product } from '../product-model';
import { ServiceStatus } from 'src/app/shared/client-status';
import { LoadingFailed } from '../../../shared/loading-failed/loading-failed';
import { Log } from 'src/app/core/logging/log';

type AllocationKind = 'owner' | 'user' | 'space';

interface StorageAllocation {
  id: number;
  kind: AllocationKind;
  label: string;
  units: number;
}

@Component({
  selector: 'app-opencloud-page',
  templateUrl: './opencloud-page.html',
  styleUrl: './opencloud-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, MatButton, MatIcon, MatProgressBar, LoadingFailed],
})
export class OpenCloudPage implements OnInit {
  private readonly productClient = inject(ProductClient);
  private readonly router = inject(Router);
  private readonly log = inject(Log);

  readonly ServiceStatus = ServiceStatus;
  readonly serviceStatus = signal(ServiceStatus.Initializing);
  readonly product = signal<Product | null>(null);
  readonly allocations = signal<StorageAllocation[]>([
    { id: 0, kind: 'owner', label: 'You', units: 1 },
  ]);
  readonly quantity = computed(() => this.allocations().reduce((total, allocation) => total + allocation.units, 0));
  readonly totalStorage = computed(() => this.quantity() * (this.product()?.storageAmount ?? 1));
  readonly totalPrice = computed(() => (this.product()?.pricePerMonth ?? 0) * this.quantity() / 100);
  readonly isTrialAvailable = computed(() => this.quantity() === 1 && (this.product()?.trialDays ?? 0) > 0);
  private nextAllocationId = 1;

  ngOnInit(): void {
    this.serviceStatus.set(ServiceStatus.Loading);
    this.productClient.getOpenCloudProduct().subscribe({
      next: product => {
        this.product.set(product);
        this.serviceStatus.set(ServiceStatus.Success);
      },
      error: () => this.serviceStatus.set(ServiceStatus.Error),
    });
  }

  addAllocation(kind: 'user' | 'space'): void {
    if (this.quantity() >= 999) return;

    const prefix = kind === 'user' ? 'Person' : 'Space';
    const usedNumbers = new Set(this.allocations()
      .filter(allocation => allocation.kind === kind)
      .map(allocation => Number(allocation.label.replace(`${prefix} `, ''))));
    let allocationNumber = 1;
    while (usedNumbers.has(allocationNumber)) allocationNumber++;

    this.allocations.update(allocations => [
      ...allocations,
      { id: this.nextAllocationId++, kind, label: `${prefix} ${allocationNumber}`, units: 1 },
    ]);
  }

  removeAllocation(id: number): void {
    this.allocations.update(allocations => allocations.filter(allocation => allocation.id !== id));
  }

  updateAllocationUnits(id: number, value: string): void {
    const units = Number(value);
    if (!Number.isFinite(units)) return;

    this.allocations.update(allocations => {
      const otherUnits = allocations.reduce((total, allocation) =>
        total + (allocation.id === id ? 0 : allocation.units), 0,
      );
      const maxUnits = Math.max(1, 999 - otherUnits);
      return allocations.map(allocation => allocation.id === id
        ? { ...allocation, units: Math.min(maxUnits, Math.max(1, Math.floor(units))) }
        : allocation,
      );
    });
  }

  adjustAllocationUnits(id: number, change: number): void {
    const allocation = this.allocations().find(item => item.id === id);
    if (allocation) this.updateAllocationUnits(id, String(allocation.units + change));
  }

  allocationTitle(allocation: StorageAllocation): string {
    if (allocation.kind === 'owner') return 'You';
    return allocation.label;
  }

  continueToCheckout(): void {
    const product = this.product();
    if (!product) return;

    void this.router.navigate(['/checkout'], {
      queryParams: {
        productID: product.productID,
        quantity: this.quantity(),
      },
    }).catch((error: unknown) => this.log.error('Checkout navigation failed', error));
  }
}