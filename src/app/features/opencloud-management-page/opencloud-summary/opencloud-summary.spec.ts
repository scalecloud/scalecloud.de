import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { OpenCloudOverviewReply } from '../opencloud-management-model';
import { OpenCloudSummary } from './opencloud-summary';

const overview: OpenCloudOverviewReply = {
  subscriptionID: 'sub-1',
  totalQuantity: 8,
  storageAmount: 1,
  storageUnit: 'TB',
  owner: {
    uid: 'owner', email: 'owner@example.com', openCloudLinked: true, storageQuantity: 2,
    dailyUsage: [{ date: '2026-10-01', usedQuantity: 1 }, { date: '2026-10-02', usedQuantity: 1.2 }],
  },
  users: [{
    uid: 'user-1', email: 'user@example.com', roles: ['User'], openCloudLinked: true, storageQuantity: 3,
    dailyUsage: [{ date: '2026-10-01', usedQuantity: 0.5 }, { date: '2026-10-02', usedQuantity: 0.6 }],
  }],
  spaces: [{
    id: 'space-1', name: 'Team', storageQuantity: 1, memberCount: 4, members: [],
    dailyUsage: [{ date: '2026-10-01', usedQuantity: 0.2 }, { date: '2026-10-02', usedQuantity: 0.3 }],
  }],
};

describe('OpenCloudSummary', () => {
  let fixture: ComponentFixture<OpenCloudSummary>;
  let component: OpenCloudSummary;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OpenCloudSummary] }).compileComponents();
    fixture = TestBed.createComponent(OpenCloudSummary);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('overview', overview);
    fixture.detectChanges();
  });

  it('calculates total allocation and remaining quantity', () => {
    expect(component.allocatedQuantity()).toBe(6);
    expect(component.availableQuantity()).toBe(2);
    expect(component.allocationPercent()).toBe(75);
  });

  it('groups owner and user capacity into the People total', () => {
    expect(component.peopleQuantity()).toBe(5);
    expect(component.spacesQuantity()).toBe(1);
    expect(component.availableStorage()).toBe(2);
  });

  it('aggregates owner, people, and space usage by day', () => {
    expect(component.currentUsage()).toBeCloseTo(2.1);
    expect(component.usageDelta()).toBeCloseTo(0.4);
    expect(component.usageChart().line).toContain('M0.0,');
    expect(component.usageChart().line).toContain('L400.0,');
  });
});