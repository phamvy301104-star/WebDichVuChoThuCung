import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@stores/store';
import { setLoading, setProducts, setSelectedProduct, setError, clearError } from '@stores/slices/productSlice';
import { productService } from '@services/productService';

export const useProduct = () => {
  const dispatch = useDispatch();
  const { products, selectedProduct, loading, error, page, total } = useSelector(
    (state: RootState) => state.product
  );

  const fetchProducts = async (pageNum: number = 1, limit: number = 10, filters?: any) => {
    dispatch(setLoading(true));
    try {
      const response = await productService.getProducts(pageNum, limit, filters);
      dispatch(setProducts({ products: response.data, total: response.pagination.total }));
    } catch (err: any) {
      dispatch(setError(err.message || 'Lỗi khi tải sản phẩm'));
    }
  };

  const fetchProductById = async (id: string) => {
    dispatch(setLoading(true));
    try {
      const product = await productService.getProductById(id);
      dispatch(setSelectedProduct(product));
      return product;
    } catch (err: any) {
      dispatch(setError(err.message || 'Lỗi khi tải chi tiết sản phẩm'));
    }
  };

  const searchProducts = async (keyword: string) => {
    dispatch(setLoading(true));
    try {
      const response = await productService.searchProducts(keyword);
      dispatch(setProducts({ products: response.data, total: response.pagination.total }));
    } catch (err: any) {
      dispatch(setError(err.message || 'Lỗi khi tìm kiếm'));
    }
  };

  return {
    products,
    selectedProduct,
    loading,
    error,
    page,
    total,
    fetchProducts,
    fetchProductById,
    searchProducts,
    clearError: () => dispatch(clearError()),
  };
};
