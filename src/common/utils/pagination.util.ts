import { PaginationArgs } from '../dto';

interface PaginationResponse {
  skip: number;
  take: number;
}

/**
 * Pagina los resultados de una consulta
 * @param page Número de página
 * @param limit Número de resultados por página
 * @returns Objeto con los valores de skip, take y enablePagination
 */
export const paginate = (pagination: PaginationArgs): PaginationResponse => {
  const { page, limit } = pagination;
  if (!page || !limit) {
    return { skip: 0, take: 0 };
  }
  return { skip: (page - 1) * limit, take: limit };
};
