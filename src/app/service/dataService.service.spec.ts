import { TestBed } from '@angular/core/testing';
import { DataService } from './dataService.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return undefined initially', () => {
    expect(service.getData()).toBeUndefined();
  });

  it('should store and retrieve data', () => {
    const payload = { id: 1, name: 'test' };
    service.setData(payload);
    expect(service.getData()).toBe(payload);
  });

  it('should overwrite previously stored data', () => {
    const first = { id: 1 };
    const second = { id: 2 };
    service.setData(first);
    service.setData(second);
    expect(service.getData()).toBe(second);
  });

  it('should allow storing null', () => {
    service.setData(null);
    expect(service.getData()).toBeNull();
  });

  it('should clear data', () => {
    service.setData('abc');
    service.clearData();
    expect(service.getData()).toBeNull();
  });
});

