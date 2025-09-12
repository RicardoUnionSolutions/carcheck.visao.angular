import { TestBed } from "@angular/core/testing";
import { PaginatorService } from "./paginator.service";

describe("PaginatorService", () => {
  let service: PaginatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginatorService);
  });

  it("should calculate pager when total pages are less than or equal to 10", () => {
    const pager = service.getPager(60, 1, 10);
    expect(pager.totalPages).toBe(6);
    expect(pager.startPage).toBe(1);
    expect(pager.endPage).toBe(6);
    expect(pager.pages).toEqual([1, 2, 3, 4, 5, 6]);
    expect(pager.startIndex).toBe(0);
    expect(pager.endIndex).toBe(9);
  });

  it("should show first block of pages when current page is near start", () => {
    const pager = service.getPager(240, 4, 10);
    expect(pager.startPage).toBe(1);
    expect(pager.endPage).toBe(10);
    expect(pager.currentPage).toBe(4);
    expect(pager.startIndex).toBe(30);
    expect(pager.endIndex).toBe(39);
  });

  it("should calculate middle block of pages for large datasets", () => {
    const pager = service.getPager(240, 12, 10);
    expect(pager.startPage).toBe(7);
    expect(pager.endPage).toBe(16);
    expect(pager.currentPage).toBe(12);
    expect(pager.startIndex).toBe(110);
    expect(pager.endIndex).toBe(119);
  });

  it("should show last block of pages when nearing the end", () => {
    const pager = service.getPager(240, 23, 10);
    expect(pager.startPage).toBe(15);
    expect(pager.endPage).toBe(24);
    expect(pager.startIndex).toBe(220);
    expect(pager.endIndex).toBe(229);
  });

  it("should clamp current page below range to first page", () => {
    const pager = service.getPager(100, 0, 10);
    expect(pager.currentPage).toBe(1);
    expect(pager.startIndex).toBe(0);
    expect(pager.endIndex).toBe(9);
  });

  it("should clamp current page above range to last page", () => {
    const pager = service.getPager(100, 20, 10);
    expect(pager.currentPage).toBe(10);
    expect(pager.startPage).toBe(1);
    expect(pager.endPage).toBe(10);
    expect(pager.startIndex).toBe(90);
    expect(pager.endIndex).toBe(99);
  });

  it("should use default current page and page size when not provided", () => {
    const pager = service.getPager(24);
    expect(pager.pageSize).toBe(12);
    expect(pager.currentPage).toBe(1);
    expect(pager.totalPages).toBe(2);
    expect(pager.startIndex).toBe(0);
    expect(pager.endIndex).toBe(11);
  });
});
