import { useState, useEffect } from 'react';
import { BannerSlider, Features, ProductsByPrice, CategorySection } from '../components/home';
import { ProductCategorySection, CategoryTabsSection, SocialGallery } from '../components/common';
import { useCart } from '../hooks';
import { productService } from '../services/productService';

const ipadFilters = [
  { label: 'Nguyên Seal', value: 'seal' },
  { label: 'Open Box', value: 'openbox' },
  { label: 'No Box', value: 'nobox' },
];

const macbookFilters = [
  { label: 'Nguyên Seal', value: 'seal' },
  { label: 'Open Box', value: 'openbox' },
  { label: 'No Box', value: 'nobox' },
];

const HomePage = () => {
  const { addToCart } = useCart();

  const [ipadProducts, setIpadProducts] = useState([]);
  const [macbookProducts, setMacbookProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Fetch iPad and MacBook products in parallel
        const [ipadResponse, macbookResponse] = await Promise.all([
          productService.getProductsByCategory('ipad', { limit: 6 }),
          productService.getProductsByCategory('macbook', { limit: 6 })
        ]);

        if (ipadResponse.success) {
          setIpadProducts(ipadResponse.products.map(transformProduct));
        }

        if (macbookResponse.success) {
          setMacbookProducts(macbookResponse.products.map(transformProduct));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Transform API product to component format
  const transformProduct = (product) => ({
    id: product._id,
    name: product.name,
    slug: product.slug,
    price: product.variants?.[0]?.price || product.price,
    originalPrice: product.variants?.[0]?.originalPrice || product.originalPrice,
    image: product.images?.[0] || product.image || '/placeholder-product.jpg',
    tags: [product.category?.name || '', product.subcategory || ''].filter(Boolean),
    inStock: product.stock > 0,
    condition: product.condition || 'seal',
  });

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      variant: product.tags?.[0] || '',
    });
  };

  return (
    <div>
      <BannerSlider />
      <Features />
      {/* <CategorySection /> */}
      <ProductsByPrice />

      {/* Product Category Sections - Near Footer */}
      <div className="container-custom py-8">
        {/* iPad Section */}
        <CategoryTabsSection
          title="iPad tối ưu cho học sinh sinh viên"
          bgColor="bg-blue-800"
          tabs={[
            { label: 'iPad Pro', link: '/danh-muc/ipad-pro' },
            { label: 'iPad Air', link: '/danh-muc/ipad-air' },
            { label: 'iPad Mini', link: '/danh-muc/ipad-mini' },
          ]}
          viewAllLink="/danh-muc/ipad"
        />
        <ProductCategorySection
          bgColor="bg-gray-50"
          products={ipadProducts}
          filters={ipadFilters}
          viewAllLink="/danh-muc/ipad"
          onAddToCart={handleAddToCart}
        />

        {/* MacBook Section */}
        <CategoryTabsSection
          title="MacBook"
          bgColor="bg-blue-800"
          tabs={[
            { label: 'MacBook Air', link: '/danh-muc/macbook-air' },
            { label: 'MacBook Pro', link: '/danh-muc/macbook-pro' },
          ]}
          viewAllLink="/danh-muc/macbook"
        />
        <ProductCategorySection
          bgColor="bg-gray-50"
          products={macbookProducts}
          filters={macbookFilters}
          viewAllLink="/danh-muc/macbook"
          onAddToCart={handleAddToCart}
        />

        {/* Accessories Section
        <CategoryTabsSection
          title="Nâng cao trải nghiệm"
          bgColor="bg-blue-800"
          tabs={accessoryTabs}
          viewAllLink="/danh-muc/phu-kien"
        /> */}
      </div>

      {/* Social Gallery Section */}
      <SocialGallery />
    </div>
  );
};

export default HomePage;
