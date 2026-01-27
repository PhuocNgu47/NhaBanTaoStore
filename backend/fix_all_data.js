import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Hàm trích xuất thông tin nâng cao
const extractVariantInfo = (variantName) => {
  const info = {
    color: null,
    storage: null,
    ram: null,
    condition: null
  };
  
  // Trích xuất điều kiện
  if (variantName.includes('Nguyên Seal')) info.condition = 'Nguyên Seal';
  else if (variantName.includes('Openbox')) info.condition = 'Openbox';
  else if (variantName.includes('CPO')) info.condition = 'CPO';
  
  // Trích xuất dung lượng - TẤT CẢ các pattern có thể
  const storagePatterns = [
    /(\d+)\s*GB/i,
    /(\d+)\s*TB/i,
    /(\d+GB)/i,
    /(\d+TB)/i
  ];
  
  for (const pattern of storagePatterns) {
    const match = variantName.match(pattern);
    if (match) {
      info.storage = match[1].includes('GB') || match[1].includes('TB') 
        ? match[1] 
        : match[1] + (variantName.toLowerCase().includes('tb') ? 'TB' : 'GB');
      break;
    }
  }
  
  // Trích xuất màu sắc - nhiều pattern khác nhau
  const colorPatterns = [
    /[-–]\s*(.+)$/,           // Sau dấu gạch ngang cuối
    /Màu\s+(.+)/i,            // Sau chữ "Màu"
    /Color:\s*(.+)/i,         // Sau "Color:"
  ];
  
  for (const pattern of colorPatterns) {
    const match = variantName.match(pattern);
    if (match) {
      let color = match[1].trim();
      // Loại bỏ các từ không phải màu
      color = color.replace(/\(.*\)/g, '').trim();
      if (color && color.length > 0 && color.length < 30) {
        info.color = color;
        break;
      }
    }
  }
  
  // Trích xuất RAM
  const ramMatch = variantName.match(/(\d+)\s*GB\s*RAM/i);
  if (ramMatch) {
    info.ram = ramMatch[1] + 'GB';
  }
  
  return info;
};

const debugAndFixVariants = async () => {
  try {
    console.log("🔍 DEBUG VÀ SỬA BIẾN THỂ...\n");
    await mongoose.connect(process.env.MONGODB_URI);
    
    const db = mongoose.connection.db;
    const products = await db.collection('products').find().toArray();
    
    console.log("=" .repeat(70));
    console.log("🔬 PHÂN TÍCH CHI TIẾT CÁC SẢN PHẨM THIẾU DỮ LIỆU");
    console.log("=" .repeat(70) + "\n");
    
    let productsWithMissingColor = [];
    let productsWithMissingStorage = [];
    
    // Tìm sản phẩm có vấn đề
    for (const product of products) {
      if (!product.variants || product.variants.length === 0) continue;
      
      let hasMissingColor = false;
      let hasMissingStorage = false;
      
      for (const variant of product.variants) {
        if (!variant.color) hasMissingColor = true;
        if (!variant.storage) hasMissingStorage = true;
      }
      
      if (hasMissingColor) productsWithMissingColor.push(product);
      if (hasMissingStorage) productsWithMissingStorage.push(product);
    }
    
    console.log(`📊 Tìm thấy:`);
    console.log(`   - ${productsWithMissingColor.length} sản phẩm có biến thể thiếu màu`);
    console.log(`   - ${productsWithMissingStorage.length} sản phẩm có biến thể thiếu dung lượng\n`);
    
    // Debug chi tiết
    if (productsWithMissingColor.length > 0) {
      console.log("🎨 SẢN PHẨM THIẾU MÀU SẮC:\n");
      
      for (const product of productsWithMissingColor) {
        console.log(`📱 ${product.name}`);
        
        for (let i = 0; i < product.variants.length; i++) {
          const variant = product.variants[i];
          console.log(`\n   Biến thể ${i + 1}: "${variant.name}"`);
          console.log(`   Màu hiện tại: ${variant.color || '❌ THIẾU'}`);
          
          const extracted = extractVariantInfo(variant.name);
          console.log(`   Phân tích tự động:`);
          console.log(`     - Màu phát hiện: ${extracted.color || '❌ Không tìm thấy'}`);
          console.log(`     - Dung lượng phát hiện: ${extracted.storage || '❌ Không tìm thấy'}`);
          console.log(`     - Điều kiện: ${extracted.condition || 'Không có'}`);
        }
        console.log();
      }
    }
    
    if (productsWithMissingStorage.length > 0) {
      console.log("💾 SẢN PHẨM THIẾU DUNG LƯỢNG:\n");
      
      for (const product of productsWithMissingStorage) {
        console.log(`📱 ${product.name}`);
        
        for (let i = 0; i < product.variants.length; i++) {
          const variant = product.variants[i];
          console.log(`\n   Biến thể ${i + 1}: "${variant.name}"`);
          console.log(`   Dung lượng hiện tại: ${variant.storage || '❌ THIẾU'}`);
          
          const extracted = extractVariantInfo(variant.name);
          console.log(`   Phân tích tự động:`);
          console.log(`     - Dung lượng phát hiện: ${extracted.storage || '❌ Không tìm thấy'}`);
          console.log(`     - Màu phát hiện: ${extracted.color || '❌ Không tìm thấy'}`);
        }
        console.log();
      }
    }
    
    // Hỏi có muốn sửa không
    console.log("=" .repeat(70));
    console.log("🔧 BẮT ĐẦU TỰ ĐỘNG SỬA...\n");
    
    let fixedCount = 0;
    
    for (const product of products) {
      if (!product.variants || product.variants.length === 0) continue;
      
      let needUpdate = false;
      const updatedVariants = [...product.variants];
      
      for (let i = 0; i < updatedVariants.length; i++) {
        const variant = updatedVariants[i];
        const extracted = extractVariantInfo(variant.name);
        
        // Sửa màu
        if (!variant.color && extracted.color) {
          updatedVariants[i].color = extracted.color;
          needUpdate = true;
          console.log(`✅ ${product.name} - Biến thể "${variant.name}"`);
          console.log(`   → Thêm màu: ${extracted.color}`);
        } else if (!variant.color && !extracted.color) {
          // Nếu không phát hiện được màu, thử gán mặc định dựa vào tên sản phẩm
          if (product.name.toLowerCase().includes('airpods') || 
              product.name.toLowerCase().includes('watch')) {
            updatedVariants[i].color = 'Trắng'; // Mặc định cho AirPods/Watch
            needUpdate = true;
            console.log(`✅ ${product.name} - Biến thể "${variant.name}"`);
            console.log(`   → Thêm màu mặc định: Trắng`);
          }
        }
        
        // Sửa dung lượng
        if (!variant.storage && extracted.storage) {
          updatedVariants[i].storage = extracted.storage;
          needUpdate = true;
          console.log(`✅ ${product.name} - Biến thể "${variant.name}"`);
          console.log(`   → Thêm dung lượng: ${extracted.storage}`);
        } else if (!variant.storage && !extracted.storage) {
          // Nếu không phát hiện được dung lượng
          // Kiểm tra xem có phải sản phẩm không cần dung lượng không (VD: AirPods, Watch)
          if (product.name.toLowerCase().includes('airpods') || 
              product.name.toLowerCase().includes('watch')) {
            updatedVariants[i].storage = 'N/A'; // Không áp dụng
            needUpdate = true;
            console.log(`✅ ${product.name} - Biến thể "${variant.name}"`);
            console.log(`   → Thêm dung lượng: N/A (Không áp dụng)`);
          }
        }
        
        // Sửa condition
        if (!variant.condition && extracted.condition) {
          updatedVariants[i].condition = extracted.condition;
          needUpdate = true;
        }
      }
      
      if (needUpdate) {
        await db.collection('products').updateOne(
          { _id: product._id },
          { $set: { variants: updatedVariants, updatedAt: new Date() } }
        );
        fixedCount++;
      }
    }
    
    console.log("\n" + "=" .repeat(70));
    console.log(`✅ Đã sửa xong ${fixedCount} sản phẩm!`);
    console.log("=" .repeat(70));
    
    // Kiểm tra lại
    console.log("\n🔍 KIỂM TRA LẠI...\n");
    
    const afterProducts = await db.collection('products').find().toArray();
    let stillMissingColor = 0;
    let stillMissingStorage = 0;
    
    for (const p of afterProducts) {
      if (p.variants) {
        for (const v of p.variants) {
          if (!v.color) stillMissingColor++;
          if (!v.storage) stillMissingStorage++;
        }
      }
    }
    
    console.log(`📊 Kết quả:`);
    console.log(`   ${stillMissingColor === 0 ? '✅' : '⚠️'} Biến thể thiếu màu: ${stillMissingColor}`);
    console.log(`   ${stillMissingStorage === 0 ? '✅' : '⚠️'} Biến thể thiếu dung lượng: ${stillMissingStorage}`);
    
    if (stillMissingColor === 0 && stillMissingStorage === 0) {
      console.log("\n🎉 HOÀN HẢO! TẤT CẢ BIẾN THỂ ĐÃ ĐẦY ĐỦ THÔNG TIN!");
    } else {
      console.log("\n⚠️  Vẫn còn một số biến thể cần điền thủ công");
      console.log("   (Có thể tên biến thể không theo format chuẩn)");
    }
    
    console.log();
    
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Lỗi:", error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
};

debugAndFixVariants();