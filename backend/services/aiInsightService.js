/**
 * AI Insight Service
 * Uses Google Gemini API for AI-Driven Customer Insights
 * Features: Predictive Lead Scoring, Behavioral Intelligence
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import Lead from '../models/Lead.js';
import Product from '../models/Product.js';

// Lazy client initialization to ensure dotenv has loaded
let genAI = null;
const getAIClient = () => {
    if (!genAI) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not defined in environment variables');
        }
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return genAI;
};

/**
 * Analyze a single lead and generate AI insights
 * @param {Object} lead - Lead document from MongoDB
 * @returns {Object} AI-generated insights
 */
export const analyzeLeadBehavior = async (lead) => {
    try {
        const model = getAIClient().getGenerativeModel({ model: 'gemini-flash-latest' });

        // Prepare lead data summary for AI
        const leadSummary = {
            hasContact: !!(lead.info?.phone || lead.info?.email),
            hasPhone: !!lead.info?.phone,
            hasEmail: !!lead.info?.email,
            viewedCount: lead.viewedProducts?.length || 0,
            topInterest: lead.topInterest || 'Unknown',
            tags: lead.tags || [],
            categories: Object.keys(lead.interestScore || {}),
            avgPrice: lead.viewedProducts?.length > 0
                ? Math.round(lead.viewedProducts.reduce((sum, p) => sum + (p.price || 0), 0) / lead.viewedProducts.length)
                : 0,
            lastActiveHoursAgo: lead.lastActive
                ? Math.round((Date.now() - new Date(lead.lastActive).getTime()) / 3600000)
                : 999
        };

        const prompt = `Bạn là chuyên gia phân tích hành vi khách hàng cho cửa hàng Apple Store Việt Nam.

Dữ liệu khách hàng:
- Có số điện thoại: ${leadSummary.hasPhone ? 'Có' : 'Không'}
- Có email: ${leadSummary.hasEmail ? 'Có' : 'Không'}
- Số sản phẩm đã xem: ${leadSummary.viewedCount}
- Danh mục quan tâm chính: ${leadSummary.topInterest}
- Các danh mục đã xem: ${leadSummary.categories.join(', ') || 'Chưa có'}
- Tags hiện tại: ${leadSummary.tags.join(', ') || 'Không có'}
- Giá trung bình sản phẩm xem: ${leadSummary.avgPrice.toLocaleString('vi-VN')} VND
- Hoạt động lần cuối: ${leadSummary.lastActiveHoursAgo} giờ trước

Hãy phân tích và trả về JSON với format sau (chỉ trả về JSON, không có text khác):
{
  "leadScore": <số từ 0-100, điểm tiềm năng mua hàng>,
  "purchaseIntent": "<Cao/Trung bình/Thấp>",
  "suggestedAction": "<hành động khuyến nghị cho nhân viên sales>",
  "insights": ["<insight 1>", "<insight 2>"],
  "recommendedProducts": ["<loại sản phẩm nên giới thiệu 1>", "<loại sản phẩm 2>"]
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        throw new Error('Invalid AI response format');
    } catch (error) {
        console.error('AI Analysis error:', error);
        // Return fallback insights
        return {
            leadScore: 50,
            purchaseIntent: 'Trung bình',
            suggestedAction: 'Theo dõi thêm hành vi',
            insights: ['Cần thêm dữ liệu để phân tích chính xác'],
            recommendedProducts: [],
            error: error.message
        };
    }
};

/**
 * Generate batch insights for multiple leads
 * @param {Array} leadIds - Array of lead IDs to analyze
 * @returns {Object} Map of leadId -> insights
 */
export const batchAnalyzeLeads = async (leadIds) => {
    const results = {};

    for (const leadId of leadIds) {
        try {
            const lead = await Lead.findById(leadId).lean();
            if (lead) {
                results[leadId] = await analyzeLeadBehavior(lead);
            }
        } catch (error) {
            results[leadId] = { error: error.message };
        }
    }

    return results;
};

/**
 * Generate overall market insights from all leads
 * @returns {Object} Market-level AI insights
 */
export const generateMarketInsights = async () => {
    try {
        const model = getAIClient().getGenerativeModel({ model: 'gemini-flash-latest' });

        // Aggregate lead statistics
        const stats = await Lead.aggregate([
            {
                $group: {
                    _id: null,
                    totalLeads: { $sum: 1 },
                    withPhone: { $sum: { $cond: [{ $ne: ['$info.phone', null] }, 1, 0] } },
                    withEmail: { $sum: { $cond: [{ $ne: ['$info.email', null] }, 1, 0] } },
                    avgViewedProducts: { $avg: { $size: { $ifNull: ['$viewedProducts', []] } } },
                    topCategories: { $push: '$topInterest' }
                }
            }
        ]);

        const aggregatedStats = stats[0] || {
            totalLeads: 0,
            withPhone: 0,
            withEmail: 0,
            avgViewedProducts: 0,
            topCategories: []
        };

        // Count category frequency
        const categoryCount = {};
        aggregatedStats.topCategories.forEach(cat => {
            if (cat) categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });

        const topCategories = Object.entries(categoryCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([cat, count]) => `${cat}: ${count}`);

        const prompt = `Bạn là chuyên gia phân tích thị trường cho Apple Store Việt Nam.

Thống kê tổng quan:
- Tổng số leads: ${aggregatedStats.totalLeads}
- Leads có số điện thoại: ${aggregatedStats.withPhone}
- Leads có email: ${aggregatedStats.withEmail}
- Trung bình sản phẩm đã xem/lead: ${Math.round(aggregatedStats.avgViewedProducts || 0)}
- Top danh mục quan tâm: ${topCategories.join(', ') || 'Chưa có dữ liệu'}

Hãy phân tích và trả về JSON (chỉ trả về JSON):
{
  "marketTrend": "<xu hướng thị trường>",
  "hotProducts": ["<sản phẩm hot 1>", "<sản phẩm hot 2>"],
  "recommendations": ["<khuyến nghị kinh doanh 1>", "<khuyến nghị 2>"],
  "conversionTips": ["<mẹo tăng chuyển đổi 1>", "<mẹo 2>"]
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return {
                success: true,
                stats: {
                    totalLeads: aggregatedStats.totalLeads,
                    withPhone: aggregatedStats.withPhone,
                    withEmail: aggregatedStats.withEmail,
                    avgViewedProducts: Math.round(aggregatedStats.avgViewedProducts || 0)
                },
                insights: JSON.parse(jsonMatch[0])
            };
        }

        throw new Error('Invalid AI response');
    } catch (error) {
        console.error('Market insights error:', error);
        return {
            success: false,
            error: error.message,
            insights: null
        };
    }
};

/**
 * Generate AI chat response for customer questions
 * @param {string} message - Customer's message
 * @param {Object} context - Additional context (customerInfo, metadata, history)
 * @returns {string} AI-generated response
 */
export const generateChatResponse = async (message, context = {}) => {
    try {
        const model = getAIClient().getGenerativeModel({ model: 'gemini-flash-latest' });

        // Fetch some products for context (featured or random active)
        const products = await Product.find({ status: 'active' })
            .select('name price featured category')
            .limit(10)
            .lean();

        const productList = products.map(p =>
            `- ${p.name}: ${p.price.toLocaleString('vi-VN')} VND ${p.featured ? '(🔥 Hot Sale)' : ''}`
        ).join('\n');

        const customerName = context.customerInfo?.name || 'khách hữu duyên';

        const prompt = `Bạn là "Nhà Bán Táo" - trợ lý AI cực kỳ thông minh, hài hước nhưng cực kỳ chuyên nghiệp của cửa hàng "Nhà Bán Táo".

Nhiệm vụ: Tư vấn Apple, chốt đơn khéo léo và mang lời chào vui vẻ.

Thông tin cửa hàng:
- Địa chỉ: 123 Nguyễn Huệ, Q.1, TP.HCM (Trụ sở sầm uất nhất)
- Hotline: 0935 771 670 (Gọi là có mặt)
- Bảo hành: iPhone bóc seal 24 tháng, Openbox 12 tháng. Đổi trả 7 ngày "không cần lý do" (nếu hàng lỗi).
- Ưu đãi: Trả góp 0%, Freeship đơn trên 2 triệu.

Sản phẩm đang có tại shop:
${productList}

Bối cảnh:
- Tên khách: ${customerName}
- Câu hỏi khách: "${message}"

Quy tắc ứng xử:
1. Hài hước & Gần gũi: Dùng ngôn ngữ "Gen Z" một cách tinh tế hoặc ví von vui vẻ.
2. Ngắn gọn, chuyên nghiệp: Không giải thích dài dòng, đi thẳng vào vấn đề. 
3. Hội thoại: Trả lời như đang chat 1-1, không viết sớ.
4. Thu thập thông tin: Nếu khách quan tâm sản phẩm cụ thể, hãy mời khách để lại SĐT để "team Nhà Bán Táo" tư vấn kỹ hơn hoặc gửi link khuyến mãi.
5. Luôn dùng emoji.

Trả lời ngay (không quá 3-4 câu):`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error('Chat response error:', error);
        return `U là trời, "Táo Quân" đang bận đi ship hàng tí xíu! 🍎
        
📞 Cần gấp thì alo: **0935 771 670** nha ${context.customerInfo?.name || ''}!`;
    }
};

