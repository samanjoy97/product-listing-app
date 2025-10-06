import { ProductResponse } from "@/models/product-response.model";
import fetchAPI from "./fetch-api";
import { productsListUrl } from "./query-urls";

export const productService = {
  getAllProducts: async () =>
    await fetchAPI.get<ProductResponse[]>({
      endpoint: productsListUrl,
    }),
};
