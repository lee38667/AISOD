module.exports = {

"[project]/.next-internal/server/app/api/aliexpress/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/app/api/aliexpress/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "GET": ()=>GET
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const maxResults = parseInt(searchParams.get('limit') || '20');
    if (!query) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Query parameter is required'
        }, {
            status: 400
        });
    }
    try {
        // Option 1: Using RapidAPI AliExpress Scraper
        if (process.env.RAPIDAPI_KEY) {
            const response = await fetch('https://aliexpress-scraper.p.rapidapi.com/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'aliexpress-scraper.p.rapidapi.com'
                },
                body: JSON.stringify({
                    query: query,
                    page: 1,
                    maxResults: maxResults
                })
            });
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            const data = await response.json();
            // Transform the response to match our Product interface
            const products = (data.products || []).map((item, index)=>({
                    id: item.productId || `aliexpress-${index}`,
                    name: item.title || item.productTitle,
                    price: parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0'),
                    currency: item.currency || 'USD',
                    rating: parseFloat(item.rating || '0'),
                    reviews: parseInt(item.orders || item.reviewCount || '0'),
                    shipping: item.shipping || 'Standard shipping',
                    inStock: item.available !== false,
                    imageUrl: item.imageUrl || item.thumbnail,
                    source: 'aliexpress',
                    originalUrl: item.productUrl,
                    description: item.description
                }));
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                products,
                source: 'api'
            });
        }
        // Option 2: Mock data fallback
        const mockProducts = [
            {
                id: 'ae-001',
                name: `${query} - Professional Quality`,
                price: 15.99,
                currency: 'USD',
                rating: 4.3,
                reviews: 2847,
                shipping: 'Free shipping',
                inStock: true,
                source: 'aliexpress',
                description: 'High-quality product with fast shipping from verified seller'
            },
            {
                id: 'ae-002',
                name: `${query} - Premium Edition with Accessories`,
                price: 28.50,
                currency: 'USD',
                rating: 4.6,
                reviews: 1523,
                shipping: '7-15 days',
                inStock: true,
                source: 'aliexpress',
                description: 'Complete set with all accessories included'
            },
            {
                id: 'ae-003',
                name: `${query} - Wholesale Pack (5 pieces)`,
                price: 45.00,
                currency: 'USD',
                rating: 4.1,
                reviews: 893,
                shipping: '10-20 days',
                inStock: true,
                source: 'aliexpress',
                description: 'Bulk purchase option with significant savings'
            },
            {
                id: 'ae-004',
                name: `${query} - Budget Friendly Option`,
                price: 8.99,
                currency: 'USD',
                rating: 3.9,
                reviews: 1247,
                shipping: 'Standard shipping',
                inStock: true,
                source: 'aliexpress',
                description: 'Affordable option without compromising quality'
            },
            {
                id: 'ae-005',
                name: `${query} - Limited Edition`,
                price: 42.99,
                currency: 'USD',
                rating: 4.8,
                reviews: 567,
                shipping: 'Express 5-7 days',
                inStock: false,
                source: 'aliexpress',
                description: 'Special limited edition with unique features'
            }
        ].slice(0, maxResults);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            products: mockProducts,
            source: 'mock'
        });
    } catch (error) {
        console.error('AliExpress API error:', error);
        // Return error response
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch AliExpress products',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__52378b6e._.js.map