import { useState, useEffect } from 'react';
import { BannerSlider, Features, ProductsByPrice, CategorySection } from '../components/home';
import { ProductCategorySection, CategoryTabsSection, SocialGallery } from '../components/common';
import { useCart } from '../hooks';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

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
  const [featuredSections, setFeaturedSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch featured categories (iPad, MacBook, etc.)
        const categoryRes = await categoryService.getFeaturedCategories();

        if (categoryRes.success && categoryRes.categories.length > 0) {
          const categories = categoryRes.categories;

          // 2. Fetch products for each featured category
          const sectionsData = await Promise.all(
            categories.map(async (cat) => {
              const productRes = await productService.getProductsByCategory(cat.slug, { limit: 8 });

              return {
                id: cat._id,
                title: cat.name, // Or cat.description if you prefer "iPad tối ưu..."
                subTitle: cat.description,
                slug: cat.slug,
                bgColor: getCategoryColor(cat.slug), // Helper to pick color
                tabs: cat.children?.map(child => ({
                  label: child.name,
                  link: `/danh-muc/${child.slug}`
                })) || [],
                products: productRes.success ? productRes.products.map(transformProduct) : [],
                viewAllLink: `/danh-muc/${cat.slug}`
              };
            })
          );

          setFeaturedSections(sectionsData);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper to assign colors based on category
  const getCategoryColor = (slug) => {
    if (slug.includes('ipad')) return 'bg-blue-800';
    if (slug.includes('macbook')) return 'bg-gray-900';
    if (slug.includes('watch')) return 'bg-orange-700';
    if (slug.includes('iphone')) return 'bg-black';
    return 'bg-blue-600'; // Default
  };

  // Transform API product to component format
  const transformProduct = (product) => ({
    id: product._id,
    name: product.name,
    slug: product.slug,
    price: product.variants?.[0]?.price || product.price,
    originalPrice: product.variants?.[0]?.originalPrice || product.originalPrice,
    image: product.image || product.images?.[0] || '/placeholder-product.jpg',
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

      <div className="container-custom py-8 space-y-12">
        {loading ? (
          <div className="py-20 text-center">
            <p>Đang tải sản phẩm nổi bật...</p>
          </div>
        ) : featuredSections.length > 0 ? (
          featuredSections.map((section) => (
            <div key={section.id}>
              <CategoryTabsSection
                title={section.subTitle || section.title}
                bgColor={section.bgColor}
                tabs={section.tabs}
                viewAllLink={section.viewAllLink}
                className="rounded-b-none"
              />
              <ProductCategorySection
                bgColor="bg-gray-50"
                products={section.products}
                filters={[
                  { label: 'Nguyên Seal', value: 'seal' },
                  { label: 'Open Box', value: 'openbox' },
                  { label: 'No Box', value: 'nobox' },
                ]}
                viewAllLink={section.viewAllLink}
                showViewAll={false}
                headerClassName="rounded-t-none border-t border-gray-200"
                onAddToCart={handleAddToCart}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            {/* Fallback content or empty state */}
          </div>
        )}
      </div>

      <SocialGallery />
    </div>
  );
};

export default HomePage;
