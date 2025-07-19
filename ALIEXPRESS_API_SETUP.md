# AliExpress API Setup Guide for Spenda

## Overview
Spenda is now configured to use **AliExpress exclusively** as the marketplace source, with all prices displayed in **Namibian Dollars (NAD)** using the **N$** symbol.

## 🚀 What's Been Implemented

### 1. AliExpress-Only Integration
- **Exclusive AliExpress search** - removed other marketplace mockups
- **Real-time currency conversion** from USD to NAD (approximate rate: 1 USD = 18.8 NAD)
- **Consistent NAD pricing** across all components
- **N$ symbol** used throughout the application

### 2. API Service Layer (`lib/api/marketplace.ts`)
- **AliExpress-focused Product interface** with NAD currency support
- **Enhanced mock data** with realistic NAD pricing
- **Automatic fallback** to NAD-priced mock data when API unavailable
- **Server-side currency conversion** for real API responses

### 3. Updated Components
- **SearchPage**: AliExpress-only search with NAD pricing
- **Dashboard**: All metrics and amounts in NAD (N$)
- **ItemListView**: Purchase items with NAD pricing
- **SettingsPage**: NAD as default currency, AliExpress as preferred source

## 💰 **Currency Implementation**

### **Namibian Dollar (NAD) Features**
- **Default currency**: NAD (N$) 
- **Conversion rate**: ~18.8 NAD per 1 USD (automatically applied)
- **Display format**: N$299.99
- **Realistic pricing**: All mock data uses appropriate NAD amounts

### **Examples of NAD Pricing**
- Gaming Headset: N$1,687.99 (was $89.99)
- Mechanical Keyboard: N$3,007.99 (was $159.99)
- Monitor Stand: N$846.00 (was $45.00)
- Webcam 4K: N$2,256.00 (was $120.00)

## 🔧 Setup Options

### Option 1: RapidAPI AliExpress Scraper (Recommended for Development)

1. **Sign up for RapidAPI**: https://rapidapi.com/
2. **Subscribe to AliExpress Scraper**: https://rapidapi.com/logicbuilder/api/aliexpress-scraper
3. **Get your API key** from RapidAPI dashboard
4. **Create `.env.local`** in your project root:

```bash
# Copy from .env.example
RAPIDAPI_KEY=your_rapidapi_key_here
```

### Option 2: AliExpress Affiliate API (For Production)

1. **Apply for AliExpress Affiliate Program**: https://portals.aliexpress.com/
2. **Get approved and obtain API credentials**
3. **Add to `.env.local`**:

```bash
ALIEXPRESS_AFFILIATE_KEY=your_affiliate_key_here
```

### Option 3: Mock Data (No Setup Required)

The system automatically falls back to realistic mock data if no API keys are provided.

## 📝 How to Use

### Basic Search
```typescript
import { searchAliExpress } from '../lib/api/marketplace';

// Search for products
const products = await searchAliExpress('wireless mouse', 10);
console.log(products);
```

### Check API Availability
```typescript
import { isAliExpressApiAvailable } from '../lib/api/marketplace';

if (isAliExpressApiAvailable()) {
  console.log('AliExpress API is ready!');
}
```

## 🧪 Testing the Integration

1. **Start your development server**:
```bash
npm run dev
```

2. **Navigate to the Search page** in your app

3. **Search for any product** (e.g., "wireless mouse", "phone case", "laptop")

4. **Check the browser console** for API logs:
   - "Fetching from AliExpress API..." = Real API call
   - Fallback messages = Using mock data

## 📊 API Response Format

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  shipping: string;
  inStock: boolean;
  imageUrl?: string;
  source: 'aliexpress' | 'amazon' | 'alibaba' | 'bestbuy' | 'local';
  originalUrl?: string;
  description?: string;
}
```

## 🔒 Security Best Practices

- ✅ API keys are stored in environment variables
- ✅ Server-side API calls keep keys secure
- ✅ Client-side code never exposes sensitive data
- ✅ Proper error handling prevents key leakage

## 🚨 Important Notes

1. **AliExpress doesn't have a public API** - We're using third-party scraping services
2. **Rate limiting**: RapidAPI has request limits based on your subscription
3. **Terms of Service**: Always comply with AliExpress ToS when scraping
4. **Mock data**: The app works perfectly without any API keys for development

## 🔄 Future Enhancements

You can easily extend this system to add:
- Amazon Product Advertising API
- eBay API
- Best Buy API
- Local marketplace APIs
- Price tracking and alerts
- Product comparison features

## 🛠️ Troubleshooting

### API Not Working?
1. Check your `.env.local` file exists and has the correct key
2. Restart your development server after adding environment variables
3. Check browser console for detailed error messages
4. Verify your RapidAPI subscription is active

### Getting Mock Data Instead of Real Results?
- This is normal when no API key is configured
- The mock data is realistic and perfect for development
- Add a real API key to get live data

## 📞 Support

The system includes comprehensive error handling and logging. Check the browser console and terminal for detailed error messages if something isn't working as expected.

---

Your AliExpress API integration is now ready! The app will work seamlessly whether you use real API keys or rely on the mock data fallback. 🎉
