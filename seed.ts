import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Room } from './src/lib/models/Room';
import { Mess } from './src/lib/models/Mess';
import { User } from './src/lib/models/User';
import { Review } from './src/lib/models/Review';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI');
  process.exit(1);
}

const mockRooms = [
  {
    name: "Standard Boys Stay",
    location: "Randive Galli, Bawada",
    rent: 2800,
    gender: 'Boys',
    description: "Clean and affordable boys stay with basic facilities. Very close to DYP college campus.",
    totalBeds: 12,
    occupiedBeds: 8,
    vacancyStatus: "Available",
    collegeDistance: 0.4,
    facilities: {
      basic: ["WiFi", "Study Table", "Attached Bathroom", "24x7 Water", "Cupboard"],
      appliances: ["Fan", "Cooler", "Laptop/PC"],
      security: ["CCTV", "Boys Only", "No Smoking"]
    },
    images: [
      "https://images.openai.com/static-rsc-4/rJ8MmJfrIee7zo52QcYBy-baRVfxt8wB_14Ix5BCHwBKd-3khvmk0Vgo4gOPRaTP119l3OnhlXl4oXC1N4gCjam5xRcESNHueGxnvkwASwFlTyVJS7aI-_V32-e4JepwUTDS-Sl691J5e2DD4qUGwq_dnck0nUbncPyjoUfkk7HrG1rQY1HOCWyROZEB7z5P?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/7VNmhxzfSZn9sKQKggUIvK-QWDsL-mejgw8oOriBv87u6O7ExPAEaQ7UkUS5iqaG1kKej67h0QixD4PaBgRlNB_nAKqgXSAttzchPhu-0WapqiZ9UeG9HPalRuS5uIFeplV_3Uct8E07PbHik5XTLb9rM6eQFCduhPRdt9EXrIfFJF57LnBjG7Jcd52Ng9gm?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/azVX_CaFNxCQ3WEnqrV96jUaqKyBOFc82iQ_E7HV3F0KcxrQfmDg3Nn5DWqFjhL4d6aj07WyLsHihDZA_G5ADmE4ncphEoBYDEQJW-ijOmcmommN8hsozkQMIhCsMQCEIvVcTmiIALjbwJmaTp2IRng-bTv-RKmXRfnMTHBiVjeh50P4z8xKhQgxaZP-rDqR?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/uBymhPhR9NPA2XX-wvqClV8SoqIMvJnpgptqOD9AvUauoUNI80NPwzRB-PRDTILVGDNk_jh1DvDgXcXYEmKQWynR2AtypILIwxoqIGjSywibXG95QdHb-yK6j2Ua_PJfRk2aOBFniWiqgq7hABXjzt3xewSZpv4gH2PVxcj0KoP31nIRMDeaEkeQaJFTr6MF?purpose=fullsize"
    ],
    ownerId: "dummy-owner-1",
    rating: 4.6,
    reviewCount: 4
  },
  {
    name: "Saraswati Girls PG",
    location: "Maratha Colony, Bawada",
    rent: 3200,
    gender: 'Girls',
    description: "Homely environment for girl students. High security and quality environment.",
    totalBeds: 15,
    occupiedBeds: 14,
    vacancyStatus: "Few Beds Left",
    collegeDistance: 0.6,
    facilities: {
      basic: ["WiFi", "Drinking Water Filter", "Electricity Backup", "Balcony"],
      appliances: ["Washing Machine", "Iron", "Fan"],
      security: ["Girls Only", "Security Guard", "Night Timing Restrictions", "No Alcohol"]
    },
    images: ["https://images.openai.com/static-rsc-4/2q6awDu0Xpa-Ks7BEIFyyHum0lZnENmOyRmEEq1CIoOl0cdOIVqY-oRij6H_OZxdqFNblGl0K0UI6A8WEzXgXtL5wDPUjf9Fboe_XEH28832jEDXotqctT5urr6fo9s29iRKhDQ48JIjwvVjO35_NGvgNvUl6eWRU4ZAtaTO1z_JpgkaT1ghkPohnZiyaAb8?purpose=fullsize"],
    ownerId: "dummy-owner-1",
    rating: 4.8,
    reviewCount: 12
  },
  {
    name: "Student Hub Residency",
    location: "Chaugule Galli, Bawada",
    rent: 2500,
    gender: 'Boys',
    description: "Budget friendly room for students. Multiple mess options available nearby.",
    totalBeds: 8,
    occupiedBeds: 8,
    vacancyStatus: "No Vacancy",
    expectedVacancyDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    collegeDistance: 0.9,
    facilities: {
      basic: ["Shared Bathroom", "24x7 Water", "Cupboard"],
      appliances: ["Fan"],
      security: ["CCTV", "Both Allowed"]
    },
    images: ["https://images.openai.com/static-rsc-4/YqNbImJbubHzDdSzZS_lZFoiU3YJnTXsgugxXbUnGy4X5A6AgSqRG3n6Vr9mzVfumh3UqAd6uifMbR9-XIbPa8bo2omjJuaBIKMRiQ-GfGX2vfQwpIrmehpE4yQfIJzWJKjPZVuukcnTCvLSOlrg8T8yriTKDx4XSCq3-ygTvVSKCZbH0Hh8h996HySeq75s?purpose=fullsize"],
    ownerId: "dummy-owner-1",
    rating: 4.2,
    reviewCount: 2
  },
  {
    name: "Standard Studio PG",
    location: "Gruhayog, Kasaba Bawada",
    rent: 3500,
    gender: 'Girls',
    description: "Decent stay for final year students and interns. Functional furniture and peaceful environment.",
    totalBeds: 6,
    occupiedBeds: 2,
    vacancyStatus: "Available",
    collegeDistance: 1.1,
    facilities: {
      basic: ["WiFi", "Attached Bathroom", "Drinking Water Filter", "Parking"],
      appliances: ["Refrigerator", "Induction", "Laptop/PC", "Heater"],
      security: ["CCTV", "Visitor Allowed", "No Smoking"]
    },
    images: ["https://images.openai.com/static-rsc-4/dQW5r2WcN_5OlF9hvDUcaYR6Aim7ScuhwZtSdMnIbG_1mZDwDahSf1JoD3cLrwIvC1IDqCA8s8WILevVSGGvZntY469qIaIpf-aDHi0jujelN-qQByL742R3Y0uL3-HAXQd9paE8lneMU48RCK-J5TRVLEFc41GBG3OQu-rfOs5tz8qQu1HDVSJaftY7Xhzb?purpose=fullsize"],
    ownerId: "dummy-owner-1",
    rating: 4.9,
    reviewCount: 1
  },
  {
    name: "Common Boys Residency",
    location: "100 Futi, Kolhapur",
    rent: 2600,
    gender: 'Boys',
    description: "Basic facility on 100 futi road. Close to main highway and market area.",
    totalBeds: 20,
    occupiedBeds: 15,
    vacancyStatus: "Available",
    collegeDistance: 1.5,
    facilities: {
      basic: ["WiFi", "Shared Bathroom", "Electricity Backup", "Parking"],
      appliances: ["Fan", "Cooler"],
      security: ["CCTV", "Security Guard", "Boys Only"]
    },
    images: ["https://images.openai.com/static-rsc-4/3SpYf0NH26SK38IgdKvT7n1nWCZvF3dzWMMyCVi-ZEYH172Dj5cdJWS8BsM9rQndeU95jrZOq5oNbD4G0rYrjA2rmmzukyTY3T18wW2c3oiBRbwD97wwTq_5aZz-4axu8RlbgRkyq1n0UUxjRCdHqeJdaQYxg-RWYN5_lxRz-qLecTK4B5eB5yJSyh2eas7e?purpose=fullsize"],
    ownerId: "dummy-owner-1",
    rating: 4.4,
    reviewCount: 8
  },
  {
    name: "Wadkar Students Home",
    location: "Wadkar, Bawada",
    rent: 2700,
    gender: 'Girls',
    description: "Simple rooms with natural lighting and ventilation. Managed by local Wadkar family.",
    totalBeds: 10,
    occupiedBeds: 9,
    vacancyStatus: "Few Beds Left",
    collegeDistance: 0.7,
    facilities: {
      basic: ["WiFi", "Drinking Water Filter", "Attached Bathroom", "Study Table"],
      appliances: ["Fan", "Washing Machine"],
      security: ["CCTV", "Girls Only", "Night Timing Restrictions"]
    },
    images: ["https://images.openai.com/static-rsc-4/rJ8MmJfrIee7zo52QcYBy-baRVfxt8wB_14Ix5BCHwBKd-3khvmk0Vgo4gOPRaTP119l3OnhlXl4oXC1N4gCjam5xRcESNHueGxnvkwASwFlTyVJS7aI-_V32-e4JepwUTDS-Sl691J5e2DD4qUGwq_dnck0nUbncPyjoUfkk7HrG1rQY1HOCWyROZEB7z5P?purpose=fullsize"],
    ownerId: "dummy-owner-1",
    rating: 4.7,
    reviewCount: 15
  }
];

const mockMesses = [
  {
    name: "Annapurna Mess Service",
    location: "Maratha Colony, Bawada",
    feesBoys: 2200,
    feesGirls: 2000,
    serviceFor: 'Both',
    collegeDistance: 0.5,
    vegNonVeg: "Both",
    specialSundayMenu: "Puran Poli / Chicken Curry",
    detailedRatings: { hygiene: 5, taste: 5, quantity: 4 },
    menu: {
      monday: { lunch: "Chapati, Bhaji, Dal, Rice", dinner: "Veg Kolhapuri, Roti" },
      tuesday: { lunch: "Bhakri, Pithla, Thecha", dinner: "Dal Tadka, Jeera Rice" },
      wednesday: { lunch: "Chapati, Paneer Bhaji", dinner: "Egg Curry / Veg Thali" },
      thursday: { lunch: "Batata Bhaji, Puri", dinner: "Kadhi Khichdi" },
      friday: { lunch: "Chapati, Mix Veg", dinner: "Misal Pav" },
      saturday: { lunch: "Varan Bhat, Bhaji", dinner: "Pav Bhaji" },
      sunday: { lunch: "Puran Poli / Chicken Thali", dinner: "Light Veg Pulav" }
    },
    images: ["https://images.openai.com/static-rsc-4/Arq0ekVDz-uzE6dCilD9z0MyKyxeyevBL223aMFo0MKf22v8lXU8RK6Ux9XYnKIj18Zx6KawTI2zlIpZeGVndjsLShZvKan4EF11tBapYWTjeULCFWMLvbcN7nZtUcTQyAAIVHu6Fzt1a-1ec3tND8nG5JF6I1kh2xwGOnEPvoZU2n1oXwSeRHsVysYO_9FT?purpose=fullsize"],
    kitchenImages: ["https://images.unsplash.com/photo-1556912177-f547c12dd0ee?q=80&w=800&auto=format&fit=crop"],
    ownerId: "dummy-owner-1",
    rating: 4.8,
    reviewCount: 45
  },
  {
    name: "Sai Mess Service",
    location: "Chaugule Galli, Bawada",
    feesBoys: 2000,
    feesGirls: 1800,
    serviceFor: 'Both',
    collegeDistance: 0.8,
    vegNonVeg: "Veg",
    specialSundayMenu: "Paneer Masala & Gulab Jamun",
    detailedRatings: { hygiene: 4, taste: 4, quantity: 5 },
    menu: {
      monday: { lunch: "Chapati, Aloo Jeera, Dal", dinner: "Veg Pulao, Raita" },
      tuesday: { lunch: "Bhakri, Baingan Bharta", dinner: "Dal Fry, Rice" },
      wednesday: { lunch: "Chapati, Matar Paneer", dinner: "Tawa Pulao" },
      thursday: { lunch: "Chapati, Methi Bhaji", dinner: "Sev Bhaji, Roti" },
      friday: { lunch: "Chapati, Chole Masala", dinner: "Masala Khichdi" },
      saturday: { lunch: "Veg Biryani", dinner: "Mix Veg, Chapati" },
      sunday: { lunch: "Special Veg Thali", dinner: "Pav Bhaji" }
    },
    images: ["https://images.openai.com/static-rsc-4/sPFWMuDNmrcc71_OVfOFd8oDqoKoR6to3nyaiABKFmjzhQ4G6w4EpLx16ZwevHQH3klAzjegV4l8kG5sOKVGsuzGiQag9JjAIKprvHCS2mmaPnwhMaG5jb1WoSlCkhmN01K_N2PS-naQCARod4lVhDJ4PaZ0nikCiwxa12kxDMvtF8sW6RJjAjxYLcMqIhvV?purpose=fullsize"],
    kitchenImages: ["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop"],
    ownerId: "dummy-owner-1",
    rating: 4.4,
    reviewCount: 22
  },
  {
    name: "Wadkar Mess & Dining",
    location: "Wadkar, Bawada",
    feesBoys: 2100,
    feesGirls: 2100,
    serviceFor: 'Both',
    collegeDistance: 0.6,
    vegNonVeg: "Both",
    specialSundayMenu: "Mutton Thali / Shrikhand Puri",
    detailedRatings: { hygiene: 5, taste: 5, quantity: 5 },
    menu: {
      monday: { lunch: "Chapati, Bhaji, Dal, Rice", dinner: "Chicken Curry / Paneer" },
      tuesday: { lunch: "Bhakri, Sukhi Bhaji", dinner: "Dal Tadka, Rice" },
      wednesday: { lunch: "Chapati, Kurma Bhaji", dinner: "Egg Masala / Veg" },
      thursday: { lunch: "Chapati, Usal", dinner: "Veg Maratha, Roti" },
      friday: { lunch: "Chapati, Bhendi Fry", dinner: "Shevga Rassa" },
      saturday: { lunch: "Rice, Sambar, Bhaji", dinner: "Veg Handi" },
      sunday: { lunch: "Mutton Thali / Shrikhand Puri", dinner: "Masala Rice" }
    },
    images: ["https://images.openai.com/static-rsc-4/Qqp00oR3sY-Mo1AayK_k4XIoRXfB8nWk93RXsDNg0OH-3CoKo9gUAqSA96FYyJjExs1JPbWbMwSkab7sglW7Hg6c6DCNDwv7J2UZQtg3KFJPAQh-07Qm1kiDoH3ZHL5yDIe3UdglY01-7rxZVkvqUFuzkc5QkNL6AJc30l_nhovskKJxTYiMrc7py19DihK_?purpose=fullsize"],
    kitchenImages: ["https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=800&auto=format&fit=crop"],
    ownerId: "dummy-owner-1",
    rating: 4.9,
    reviewCount: 65
  },
  {
    name: "Shradha Home Mess",
    location: "100 Futi, Kolhapur",
    feesBoys: 1800,
    feesGirls: 1800,
    serviceFor: 'Both',
    collegeDistance: 1.4,
    vegNonVeg: "Veg",
    specialSundayMenu: "Amras Puri (Seasonal)",
    detailedRatings: { hygiene: 4, taste: 5, quantity: 4 },
    menu: {
      monday: { lunch: "Chapati, Dal, Rice, Bhaji", dinner: "Khichdi Kadhi" },
      tuesday: { lunch: "Bhakri, Pithla", dinner: "Dal Rice, Sukhi Bhaji" },
      wednesday: { lunch: "Chapati, Paneer", dinner: "Veg Pulav" },
      thursday: { lunch: "Chapati, Mix Veg", dinner: "Dal Fry, Rice" },
      friday: { lunch: "Chapati, Aloo Matar", dinner: "Misal Pav" },
      saturday: { lunch: "Varan Bhat, Bhaji", dinner: "Tawa Pulao" },
      sunday: { lunch: "Special Thali", dinner: "Light Veg Pulav" }
    },
    images: [
      "https://images.openai.com/static-rsc-4/4ZcHCLkNKbULM8g8oMfUHhBetSkRLUqYbhKod4D2-o1rb0hsp4hdIiU_dntXSHAjQWE0NrJuFu3gxYHPOOVZea3qicjCTgkksiw7wtXUzd4rmkkaDWLyLsvidrBw6QKaVsNjWtePSW3luVNcD2mMZpCHH92GbqP6wFsUd9BBNTbCzuHBI9qrj88i-pYOkcpT?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/RoEHZSEZGTIKluMRhltz1S9NOWTFJV8RkHg6P1xkYrY18hu0L9NA7ZjABU1B_R4ua3PePszIIlM3FDtFFf32viaacQfhQhHrv3zeXasGzm-U2FL3L6rUWVjJpJvNAejKirmmQsO8mkty-u6uEWpWVYDVBrppLXjElnnjk6ZUYxAKANmG1Yq45RYiTrnC_eTI?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/TkOls6g7X3eu49ZgJ-t76II6ufVgFaJkV5ejMpYrLfhueNbFP9oMvCObSi-QGOOVZcAxMVztHAZvaH9c_ZC0BKSVXolj5h_kZnlWeYR9yXcdZRFCPoYvo2M1po3T-G37roEAkYpWetxtjp0HXYgweKKG0V9bHt4RaUwlnULdqvR3UZt9AApzhaBc06znEdrN?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/7feEaWvSDDpBcQLh3izN-EeNXAFs_SPI_Nkf22RNAJpHtMo6HRgtcNMEMcYPWGywmHyjtCHfbZ3lnznIBdXA4kWL3b_PuHhJDksSSI94hKpBSyQQgARPfErAiWGB0TY94DhC7jBDBekerslldW33_LfA-sgEFF2k_BgClCsK68g7NgXZgkmKalOlYNBA-BLP?purpose=fullsize"
    ],
    ownerId: "dummy-owner-1",
    rating: 4.5,
    reviewCount: 18
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!, { dbName: 'campusconnect', serverSelectionTimeoutMS: 15000 });
    console.log('Connected!');

    console.log('Clearing old data...');
    await Room.deleteMany({});
    await Mess.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});

    console.log('Inserting dummy user...');
    await User.create({
      uid: 'dummy-owner-1',
      name: 'Rajesh Owner',
      email: 'rajesh@example.com',
      role: 'roomOwner'
    });

    console.log('Inserting rooms...');
    const insertedRooms = await Room.insertMany(mockRooms);

    console.log('Inserting messes...');
    const insertedMesses = await Mess.insertMany(mockMesses);

    console.log('Inserting student reviews...');
    const mockReviews = [
      {
        targetId: insertedRooms[0]._id,
        targetType: 'Room',
        userId: 'student-1',
        studentName: 'Amit Sharma',
        rating: 5,
        comment: "Excellent stay! The WiFi is super fast and the owner is very helpful. Best place for DYP students.",
        createdAt: new Date()
      },
      {
        targetId: insertedRooms[1]._id,
        targetType: 'Room',
        userId: 'student-2',
        studentName: 'Sneha Patil',
        rating: 4,
        comment: "Very safe for girls. The cleaning is done daily. Highly recommended.",
        createdAt: new Date()
      },
      {
        targetId: insertedRooms[2]._id,
        targetType: 'Room',
        userId: 'student-5',
        studentName: 'Rahul Deshmukh',
        rating: 4,
        comment: "Good budget option. Close to all the main mess services.",
        createdAt: new Date()
      },
      {
        targetId: insertedRooms[3]._id,
        targetType: 'Room',
        userId: 'student-6',
        studentName: 'Priya Kulkarni',
        rating: 5,
        comment: "Modern facilities and very quiet environment. Perfect for studies.",
        createdAt: new Date()
      },
      {
        targetId: insertedRooms[4]._id,
        targetType: 'Room',
        userId: 'student-7',
        studentName: 'Aditya Shinde',
        rating: 4,
        comment: "Spacious rooms and great ventilation. The security guard is very alert.",
        createdAt: new Date()
      },
      {
        targetId: insertedMesses[0]._id,
        targetType: 'Mess',
        userId: 'student-3',
        studentName: 'Anjali More',
        rating: 5,
        comment: "The Puran Poli on Sunday is amazing! Hygiene is top-notch. Feels like home food.",
        createdAt: new Date()
      },
      {
        targetId: insertedMesses[1]._id,
        targetType: 'Mess',
        userId: 'student-4',
        studentName: 'Pratik Pawar',
        rating: 4,
        comment: "Budget friendly and good taste. The quantity is more than enough for one person.",
        createdAt: new Date()
      },
      {
        targetId: insertedMesses[2]._id,
        targetType: 'Mess',
        userId: 'student-8',
        studentName: 'Siddharth Joshi',
        rating: 5,
        comment: "Best non-veg thali in Bawada! Their Mutton Thali on Sunday is a must-try.",
        createdAt: new Date()
      },
      {
        targetId: insertedMesses[3]._id,
        targetType: 'Mess',
        userId: 'student-9',
        studentName: 'Tanvi Gadgil',
        rating: 5,
        comment: "Purely vegetarian and very light on the stomach. Perfect for daily eating.",
        createdAt: new Date()
      },
      {
        targetId: insertedMesses[0]._id,
        targetType: 'Mess',
        userId: 'student-10',
        studentName: 'Omkar Jadhav',
        rating: 4,
        comment: "Variety of food is great. Never gets boring.",
        createdAt: new Date()
      }
    ];
    await Review.insertMany(mockReviews);

    console.log('Database successfully seeded!');
  } catch (e) {
    console.error('Seeding failed:', e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedDatabase();
