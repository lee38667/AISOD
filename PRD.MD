🧾 Product Requirements Document (PRD)
Product Name: Spenda
Owner: Lineekela Shinavene
Platform: Web (React.js)
Design Theme: Futuristic, dark, modern UI
Version: 1.0 MVP

🧠 1. Purpose
Spenda is a smart, personal finance planner designed to help users list items they intend to purchase, track prices (manually or via API), mark off acquired items, and manage their buying priorities. It aims to simplify budgeting and spending decisions through a visually immersive and intuitive interface.

🎯 2. Goals & Objectives
Create an organized visual space to plan and track upcoming purchases.

Integrate optional real-time price lookup via external sources (e.g., Alibaba).

Visualize total estimated costs and track actual spending.

Provide a clean and futuristic interface for managing finances without login overheads.

🔍 3. Features & Requirements
3.1. Core Features
🛒 Purchase List
Add, edit, delete items.

Each item includes:

Name

Estimated Price

Purchase Status: Planned, Bought, On Hold

Source (manual entry or selected from fetched data)

Priority: Low, Medium, High

Optional Notes

Image/Thumbnail (optional)

Date Added / Date Bought (auto-handled)

✅ Item Status Tracking
Toggle to mark item as Bought

Update actual price after purchase

Visual indicator (badge or color tag)

🌐 Price & Source Lookup Integration (Phase 2)
Search for products using a public API (e.g., Alibaba or scraping fallback)

Autofill: name, price, store link, and image

Manually override fetched data

📊 Dashboard Overview
Summary cards for:

Total Planned Items

Items Bought

Total Estimated Cost

Total Spent

Filters: status, priority, category

Budget warning if estimated > set monthly cap

🔎 Search & Filter Functionality
Filter by:

Purchase status

Priority level

Source

Text-based search for quick item lookup

🖼️ 4. Design Requirements
4.1. Theme & Style
Dark Mode Only (initial version)

Futuristic UI with:

Neon accents (blue, purple, or green)

Matte black/gray background

Rounded cards, soft shadows

Animated toggles, dropdowns, and modal transitions

Typography: Sans-serif (Orbitron, Inter, or Space Grotesk)

4.2. Layout
Sidebar Navigation:

Dashboard

My Items

Add Item

Settings

Main Content Panel:

Responsive grid/list view

Item Cards with hover effects

Add Item Modal:

Controlled form for quick addition

⚙️ 5. Technical Specifications
5.1. Frontend
Framework: React.js (with Hooks)

State Management: Context API or Zustand (for lightweight stores)

Styling: Tailwind CSS with custom theme or styled-components

Routing: React Router

5.2. Backend (Phase 2)
Optional Node.js/Express backend or Firebase for:

Sync across devices

Storing user preferences

Product search proxy server if needed for API scraping

5.3. APIs (for Future)
Alibaba Product Search (via scraping or available APIs)

Currency conversion API (if needed for price localization)

Cloudinary or IPFS for storing/fetching product thumbnails

