import { NextRequest, NextResponse } from 'next/server';

// Server-side AliExpress API integration
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const maxResults = parseInt(searchParams.get('limit') || '20');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
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
      const products = (data.products || []).map((item: any, index: number) => ({
        id: item.productId || `aliexpress-${index}`,
        name: item.title || item.productTitle,
        price: parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0') * 18.8, // Convert USD to NAD (approximate rate)
        currency: 'NAD',
        rating: parseFloat(item.rating || '0'),
        reviews: parseInt(item.orders || item.reviewCount || '0'),
        shipping: item.shipping || 'Standard shipping',
        inStock: item.available !== false,
        imageUrl: item.imageUrl || item.thumbnail,
        source: 'aliexpress',
        originalUrl: item.productUrl,
        description: item.description
      }));

      return NextResponse.json({ products, source: 'api' });
    }

    // Option 2: Mock data fallback
    const mockProducts = [
      {
        id: 'ae-001',
        name: `${query} - Professional Quality`,
        price: 299.99,
        currency: 'NAD',
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
        price: 535.50,
        currency: 'NAD',
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
        price: 845.00,
        currency: 'NAD',
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
        price: 168.99,
        currency: 'NAD',
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
        price: 806.99,
        currency: 'NAD',
        rating: 4.8,
        reviews: 567,
        shipping: 'Express 5-7 days',
        inStock: false,
        source: 'aliexpress',
        description: 'Special limited edition with unique features'
      }
    ].slice(0, maxResults);

    return NextResponse.json({ products: mockProducts, source: 'mock' });

  } catch (error) {
    console.error('AliExpress API error:', error);
    
    // Return error response
    return NextResponse.json(
      { error: 'Failed to fetch AliExpress products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
