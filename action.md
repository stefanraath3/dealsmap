# DealsMap UI/UX Optimization Plan

## Current Issues

1. Map markers are placed randomly due to missing lat/long coordinates
2. Sidebar list is unwieldy and lacks organization
3. UI doesn't follow modern design patterns (like Airbnb's successful model)

## Action Items

### 1. Database Schema Updates

- Add latitude and longitude columns to deals table
- Add operating_hours column to handle day-specific deals
- Add images column for deal photos (array of URLs)
- Add optional end_date column for time-limited deals

### 2. UI Component Restructuring

- Remove permanent sidebar list
- Implement grid view of deals (Airbnb-style card layout)
- Add "Show map" floating button
- Create smooth transition between list/map views
- Implement map marker clustering for dense areas

### 3. Deal Card Components

- Design modern, clean deal cards showing:
  - Primary image
  - Deal title
  - Location name
  - Price/discount
  - Operating hours/days
  - Category tag
  - Quick action buttons (save, share)

### 4. Map View Enhancements

- Implement proper geocoding for locations
- Add map marker clustering
- Design hover state for map markers
- Create beautiful modal for selected deals showing:
  - Image carousel
  - Full deal details
  - Operating hours
  - Price/savings
  - Location details
  - Related deals nearby

### 5. Filtering System

- Add day-of-week filter
- Add category filter
- Add price range filter
- Add location-based search
- Implement real-time filter updates

### 6. Performance Optimizations

- Implement lazy loading for images
- Add pagination/infinite scroll for deal list
- Optimize map marker rendering
- Cache geocoded locations

### 7. Mobile Responsiveness

- Ensure smooth transitions on mobile
- Optimize touch interactions
- Implement bottom sheet for filters
- Make map fullscreen on mobile

## Implementation Order

1. Database schema updates
2. Basic UI restructuring
3. Deal card component
4. Map view and geocoding
5. Filtering system
6. Modal and interactions
7. Performance optimization
8. Mobile responsiveness

## Technical Requirements

- Next.js 13+ with App Router
- Mapbox or Google Maps API for mapping
- Geocoding service
- Image optimization and CDN
- State management (likely Zustand)
- Database migrations (using Drizzle)
