export class ResponseDto<T = any> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    [key: string]: any;
  };
}

export class PaginationDto {
  page?: number = 1;
  limit?: number = 20;

  getOffset(): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? 20);
  }

  getLimit(): number {
    const limit = this.limit ?? 20;
    return Math.min(limit, 100); // Max 100 items per page
  }
}
