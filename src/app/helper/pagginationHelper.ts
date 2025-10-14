type IOptions = {
  page?: string | number;
  limit?: string | number;
  skip: number;
  shortBy: string;
  shortOrder: string;
};
type IOptionsResult = {
  page?: number;
  limit?: number;
  skip: number;
  shortBy: string;
  shortOrder: string;
};

const calculatePagination = (options: IOptions): IOptionsResult => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;

  const skip: number = (Number(page) - 1) * Number(limit);

  const shortBy: string = options.shortBy || "createdAt";
  const shortOrder: string = options.shortOrder || "desc";
  return {
    page,
    limit,
    skip,
    shortBy,
    shortOrder,
  };
};

export default calculatePagination;
