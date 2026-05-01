// analyze-missing-images.cjs
// Script to analyze which hotels and cities don't have images

const fs = require('fs');
const path = require('path');

// Read hotels data
const hotelsDataPath = path.join(__dirname, 'src', 'data', 'hotels_list.json');
const hotelsData = JSON.parse(fs.readFileSync(hotelsDataPath, 'utf8'));

// Read cities data from Hotels.tsx
const hotelsPagePath = path.join(__dirname, 'src', 'pages', 'Hotels.tsx');
const hotelsPageContent = fs.readFileSync(hotelsPagePath, 'utf8');

// Extract cities array from Hotels.tsx
const citiesMatch = hotelsPageContent.match(/const cities: CityData\[\] = \[([\s\S]*?)\];/);
if (!citiesMatch) {
  console.log('Could not extract cities data from Hotels.tsx');
  process.exit(1);
}

const placeholderHotelUrl = 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg';
const placeholderCityUrl = 'https://images.pexels.com/photos/4133256/pexels-photo-4133256.jpeg';

console.log('🔍 ANALYZING MISSING IMAGES\n');
console.log('='.repeat(50));

// Analyze hotels
console.log('\n📊 HOTEL IMAGE ANALYSIS:');
console.log('-'.repeat(30));

let hotelsWithMissingImages = 0;
let hotelsWithImages = 0;

hotelsData.forEach((hotel, index) => {
  const heroImage = hotel['Hero Image'];
  const hotelName = hotel['Hotel Name'];
  const city = hotel.City;
  
  if (!heroImage || heroImage.trim() === '' || heroImage === placeholderHotelUrl) {
    hotelsWithMissingImages++;
    console.log(`❌ ${hotelName} (${city}) - Missing image`);
  } else {
    hotelsWithImages++;
    // Uncomment the line below to see hotels WITH images
    // console.log(`✅ ${hotelName} (${city}) - Has image`);
  }
});

console.log(`\n📈 Hotel Summary:`);
console.log(`   Total Hotels: ${hotelsData.length}`);
console.log(`   Hotels WITH images: ${hotelsWithImages}`);
console.log(`   Hotels WITHOUT images: ${hotelsWithMissingImages}`);
console.log(`   Percentage with images: ${((hotelsWithImages / hotelsData.length) * 100).toFixed(1)}%`);

// Analyze cities
console.log('\n🏙️ CITY IMAGE ANALYSIS:');
console.log('-'.repeat(30));

// Parse cities data (simplified parsing)
const cityLines = citiesMatch[1].split('\n').filter(line => line.trim().includes('name:'));
let citiesWithMissingImages = 0;
let citiesWithImages = 0;

cityLines.forEach((line) => {
  const nameMatch = line.match(/name:\s*'([^']+)'/);
  const imageMatch = line.match(/image:\s*'([^']+)'/);
  
  if (nameMatch) {
    const cityName = nameMatch[1];
    const imageUrl = imageMatch ? imageMatch[1] : '';
    
    if (!imageUrl || imageUrl.trim() === '' || imageUrl === placeholderCityUrl) {
      citiesWithMissingImages++;
      console.log(`❌ ${cityName} - Missing image`);
    } else {
      citiesWithImages++;
      // Uncomment the line below to see cities WITH images
      // console.log(`✅ ${cityName} - Has image`);
    }
  }
});

console.log(`\n📈 City Summary:`);
console.log(`   Total Cities: ${cityLines.length}`);
console.log(`   Cities WITH images: ${citiesWithImages}`);
console.log(`   Cities WITHOUT images: ${citiesWithMissingImages}`);
console.log(`   Percentage with images: ${((citiesWithImages / cityLines.length) * 100).toFixed(1)}%`);

console.log('\n' + '='.repeat(50));
console.log('✨ PLACEHOLDER SOLUTION IMPLEMENTED:');
console.log('   🏨 Hotel Placeholder: ' + placeholderHotelUrl);
console.log('   🏙️  City Placeholder: ' + placeholderCityUrl);
console.log('\n🎯 All images without valid URLs will now automatically');
console.log('   fallback to these high-quality Pexels placeholders!');
console.log('='.repeat(50));
