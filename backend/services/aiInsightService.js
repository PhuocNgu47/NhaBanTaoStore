/**
 * AI Insight Service
 * Uses Google Gemini API for AI-Driven Customer Insights
 * Features: Predictive Lead Scoring, Behavioral Intelligence
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import Lead from '../models/Lead.js';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze a single lead and generate AI insights
 * @param {Object} lead - Lead document from MongoDB
 * @returns {Object} AI-generated insights
 */
export const analyzeLeadBehavior = async (lead) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
 * @returns {string} AI-generated response
 */
export const generateChatResponse = async (message) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Bạn là trợ lý AI của cửa hàng "Nhà Bán Táo" - chuyên sản phẩm Apple chính hãng tại Việt Nam.

Thông tin cửa hàng:
- Tên: Hộ kinh doanh Nhà Bán Táo
- Địa chỉ: 123 Nguyễn Huệ, Q.1, TP.HCM
- Hotline: 0935 771 670
- Giờ mở cửa: Thứ 2-6: 8:00-21:00, Thứ 7-CN: 9:00-20:00
- Bảo hành: iPhone Openbox/CPO 12 tháng, Nguyên Seal 24 tháng
- Hỗ trợ trả góp 0% qua thẻ tín dụng
- Freeship toàn quốc đơn từ 2 triệu
- Đổi trả miễn phí 7 ngày

Câu hỏi của khách hàng: "${message}"

Hãy trả lời ngắn gọn, thân thiện, dễ hiểu. Dùng emoji phù hợp. Nếu không biết câu trả lời, hướng khách liên hệ hotline.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Chat response error:', error);
        return `Xin lỗi, hiện tại tôi không thể xử lý câu hỏi này. 

📞 Vui lòng liên hệ hotline: **0935 771 670**
💬 Hoặc chat Zalo để được hỗ trợ nhanh nhất!`;
    }
};

