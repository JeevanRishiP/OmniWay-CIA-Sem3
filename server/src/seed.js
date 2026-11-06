import 'dotenv/config';
import { subDays } from 'date-fns';
import { connectDB, disconnectDB } from './config/db.js';
import { Place } from './models/Place.js';
import { VerificationNote } from './models/VerificationNote.js';
import { calculateOverallFreshness } from './utils/freshnessCalculator.js';
import { fileURLToPath } from 'url';

export async function seedDatabase(uri = process.env.MONGODB_URI, autoDisconnect = true) {
  try {
    await connectDB(uri);
    console.log('[Seed] Clearing existing places and verification notes...');
    await Place.deleteMany({});
    await VerificationNote.deleteMany({});

    const now = new Date();

    const bangaloreVenues = [
      // 1. TRANSIT
      {
        name: 'Nadaprabhu Kempegowda Metro Station (Majestic)',
        category: 'transit',
        address: {
          street: 'Gubbi Thotadappa Road, Kempegowda Intermodal Hub, Gandhi Nagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560009',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.5726, 12.9757] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 2),
            verificationCount: 8,
            notes: 'Wide ramp with tactile paving leading from BMTC bus stand footbridge directly into Concourse Gate 3.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 2),
            verificationCount: 12,
            notes: 'Interchange elevators between Purple and Green line underground platforms have Braille buttons and multilingual audio chimes.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 5),
            verificationCount: 5,
            notes: 'Dedicated disabled restroom stall near Customer Care counter on concourse level; grab rails are sturdy.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 2),
            verificationCount: 9,
            notes: 'Entry Gate 1 on Tank Bund Road is completely level with automatic wide-flange flap gates.'
          }
        }
      },
      {
        name: 'Indiranagar Metro Station (Purple Line)',
        category: 'transit',
        address: {
          street: 'CMH Road, Stage 1, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.6387, 12.9784] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 8),
            verificationCount: 4,
            notes: 'Pavement ramp from CMH Road is paved, but watch out for two-wheelers parked near the ramp entrance.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 8),
            verificationCount: 6,
            notes: 'Street-to-concourse lift is active and staffed with a BMRCL security marshal.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 38), // Moderate
            verificationCount: 2,
            notes: 'Restroom is locked by default; security guard opens it immediately on request.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 8),
            verificationCount: 4,
            notes: 'Step-free access from street elevator directly onto ticketing floor.'
          }
        }
      },
      {
        name: 'Sir M. Visvesvaraya Terminal (SMVT Bengaluru)',
        category: 'transit',
        address: {
          street: 'Baiyappanahalli Main Road, Banaswadi',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.6534, 13.0033] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 14),
            verificationCount: 3,
            notes: 'Airport-style terminal with gentle slope ramps at departures and arrivals concourses.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 14),
            verificationCount: 5,
            notes: 'High-capacity glass elevators connect waiting lounge to all 7 train platforms.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 14),
            verificationCount: 4,
            notes: 'Spacious wheelchair-accessible washroom inside VIP waiting hall with sensor taps.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 14),
            verificationCount: 4,
            notes: 'Flush sliding glass entrance with low luggage scanner tables.'
          }
        }
      },
      {
        name: 'MG Road Metro Station',
        category: 'transit',
        address: {
          street: 'Mahatma Gandhi Road, Near Brigade Road Junction',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.6075, 12.9754] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 45), // Moderate
            verificationCount: 3,
            notes: 'Ramp on Church Street side is clean and clearly marked with international wheelchair symbol.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 45),
            verificationCount: 4,
            notes: 'Lift operates between boulevard level and platform; buttons have tactile Kannada and English Braille.'
          },
          accessibleToilet: {
            available: false,
            lastVerifiedAt: subDays(now, 50),
            verificationCount: 1,
            notes: 'Under renovation during metro maintenance check.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 45),
            verificationCount: 3,
            notes: 'Level walkway connecting Rangoli Metro Art Center directly to concourse.'
          }
        }
      },
      {
        name: 'Jayanagar Metro Station',
        category: 'transit',
        address: {
          street: 'Rashtriya Vidyalaya Road, 4th Block, Jayanagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560011',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.5802, 12.9304] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 110), // Stale
            verificationCount: 1,
            notes: 'Ramp surface near auto stand was slightly cracked when audited last quarter.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 110),
            verificationCount: 2,
            notes: 'Lift works but has occasional wait time during evening peak hours.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 110),
            verificationCount: 1,
            notes: 'Located on platform 1 level; key available with station supervisor.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 110),
            verificationCount: 1,
            notes: 'West side entry is completely flush with the newly laid pedestrian footpath.'
          }
        }
      },

      // 2. HEALTHCARE
      {
        name: 'Manipal Hospital (Old Airport Road)',
        category: 'healthcare',
        address: {
          street: '98, HAL Old Airport Road, Kodihalli',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560017',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.6521, 12.9592] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 4),
            verificationCount: 6,
            notes: 'Broad concrete ramp with dual non-slip handrails at both Main Emergency and OPD blocks.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 4),
            verificationCount: 7,
            notes: 'Multiple oversized bed-and-wheelchair elevators with dedicated hospital attendants.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 4),
            verificationCount: 5,
            notes: 'Fully compliant ADA accessible restrooms with anti-slip flooring and emergency bell cords.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 4),
            verificationCount: 8,
            notes: 'Covered ambulance porch with zero-threshold sliding glass doors.'
          }
        }
      },
      {
        name: 'Apollo Hospital (Bannerghatta Road)',
        category: 'healthcare',
        address: {
          street: '154/11, Opposite IIM-B, Bannerghatta Main Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560076',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.5986, 12.8953] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 10),
            verificationCount: 4,
            notes: 'Gentle gradient ramp from covered basement parking and surface drop-off.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 10),
            verificationCount: 6,
            notes: 'All lifts accommodate large power wheelchairs and medical stretchers.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 10),
            verificationCount: 3,
            notes: 'Restrooms on Ground, 1st, and 2nd OPD floors feature wide inward/outward doors and grab bars.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 10),
            verificationCount: 5,
            notes: 'Main lobby entrance is completely flat with security staff assisting wheelchair transfers.'
          }
        }
      },
      {
        name: 'Fortis Hospital (Cunningham Road)',
        category: 'healthcare',
        address: {
          street: '14, Cunningham Road, Vasanth Nagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560052',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.5971, 12.9882] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 22),
            verificationCount: 3,
            notes: 'Solid tiled ramp leading to admissions desk; slight gradient requires steady push.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 22),
            verificationCount: 4,
            notes: 'Two dedicated patient elevators with voice floor announcements.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 22),
            verificationCount: 2,
            notes: 'Ground floor casualty restroom is wheelchair accessible with low sink counters.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 22),
            verificationCount: 3,
            notes: 'Main portico is level with driveway for seamless vehicle-to-wheelchair boarding.'
          }
        }
      },
      {
        name: 'NIMHANS (Neuro Sciences & Psychology Centre)',
        category: 'healthcare',
        address: {
          street: 'Hosur Road, Near Dairy Circle, Lakkasandra',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560029',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.5956, 12.9392] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 65), // Moderate
            verificationCount: 2,
            notes: 'Heritage campus building has paved stone ramps connecting OPD wards to pharmacy.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 65),
            verificationCount: 2,
            notes: 'Modern lifts in the Neuro-Centre annex; older wing relies on covered ground corridors.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 65),
            verificationCount: 2,
            notes: 'Western-style accessible restroom next to the central diagnostic reception.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 65),
            verificationCount: 3,
            notes: 'Wide double door entrance with zero raised threshold.'
          }
        }
      },
      {
        name: 'Victoria Hospital (BMC Campus)',
        category: 'healthcare',
        address: {
          street: 'Fort Road, Near City Market, Kalasipalya',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560002',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.5752, 12.9626] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 125), // Stale
            verificationCount: 1,
            notes: 'Ramps at Trauma Care Centre are operational, but corridor was crowded during morning hours.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 125),
            verificationCount: 2,
            notes: 'Elevator in Surgical Block is functional and monitored by ward security.'
          },
          accessibleToilet: {
            available: false,
            lastVerifiedAt: subDays(now, 125),
            verificationCount: 1,
            notes: 'Stall was under sanitation maintenance during last inspection.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 125),
            verificationCount: 1,
            notes: 'Ground floor emergency entrance has flat threshold.'
          }
        }
      },

      // 3. RESTAURANTS & CAFES
      {
        name: 'Toit Brewpub (Indiranagar)',
        category: 'restaurant',
        address: {
          street: '298, 100 Feet Road, Near Binnamangala, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.6409, 12.9793] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 6),
            verificationCount: 4,
            notes: 'Sturdy wooden ramp at main entrance; valet assists guests from the curbside.'
          },
          lift: {
            available: false,
            lastVerifiedAt: subDays(now, 6),
            verificationCount: 2,
            notes: 'No elevator to upper loft/mezzanine seating, but ground floor tables are fully accessible.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 6),
            verificationCount: 3,
            notes: 'Single-occupancy wheelchair-friendly restroom on ground floor behind brewing kettles.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 6),
            verificationCount: 5,
            notes: 'Main wooden double doors have flush threshold into dining hall.'
          }
        }
      },
      {
        name: 'Truffles (Koramangala 5th Block)',
        category: 'restaurant',
        address: {
          street: '93/A, Ground Floor, 4th B Cross, 5th Block, Koramangala',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560095',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.6186, 12.9348] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 18),
            verificationCount: 3,
            notes: 'Small concrete ramp at front door; sidewalk is reasonably level.'
          },
          lift: {
            available: false,
            lastVerifiedAt: null, // Unverified
            verificationCount: 0,
            notes: ''
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 18),
            verificationCount: 2,
            notes: 'Washroom doorway is wide enough for standard wheelchair, but lacks side grab bar.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 18),
            verificationCount: 3,
            notes: 'Level entry through main glass door with staff opening doors.'
          }
        }
      },
      {
        name: 'Mavalli Tiffin Room (MTR 1924, Lalbagh)',
        category: 'restaurant',
        address: {
          street: '14, Lalbagh Road, Mavalli, Sudhama Nagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560027',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.5878, 12.9556] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 55), // Moderate
            verificationCount: 2,
            notes: 'Heritage building has a side slope ramp leading directly into the ground floor tiffin hall.'
          },
          lift: {
            available: false,
            lastVerifiedAt: subDays(now, 55),
            verificationCount: 1,
            notes: 'Upper dining hall is accessible only via narrow wooden heritage stairs; ground floor reserved for mobility needs.'
          },
          accessibleToilet: {
            available: false,
            lastVerifiedAt: subDays(now, 55),
            verificationCount: 1,
            notes: 'Traditional washroom has a 4-inch raised step threshold.'
          },
          stepFreeEntrance: {
            available: false,
            lastVerifiedAt: subDays(now, 55),
            verificationCount: 2,
            notes: 'Front entrance has 3 heritage stone steps; use the designated side ramp.'
          }
        }
      },
      {
        name: 'Vidyarthi Bhavan (Gandhi Bazaar)',
        category: 'restaurant',
        address: {
          street: '32, Gandhi Bazaar Main Road, Basavanagudi',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560004',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.5702, 12.9438] },
        features: {
          ramp: {
            available: false,
            lastVerifiedAt: subDays(now, 75), // Moderate
            verificationCount: 2,
            notes: 'Old heritage shopfront with a single 6-inch stone doorstep; staff enthusiastically assist.'
          },
          lift: {
            available: false,
            lastVerifiedAt: subDays(now, 75),
            verificationCount: 1,
            notes: 'Single ground floor seating area only.'
          },
          accessibleToilet: {
            available: false,
            lastVerifiedAt: subDays(now, 75),
            verificationCount: 1,
            notes: 'Restroom stall at rear is compact with narrow door frame.'
          },
          stepFreeEntrance: {
            available: false,
            lastVerifiedAt: subDays(now, 75),
            verificationCount: 2,
            notes: 'Stone threshold requires manual step-up.'
          }
        }
      },
      {
        name: "Koshy's Restaurant (St. Marks Road)",
        category: 'restaurant',
        address: {
          street: '39, St. Marks Road, Shanthala Nagar, Ashok Nagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.6015, 12.9734] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 100), // Stale
            verificationCount: 1,
            notes: 'Permanent side ramp from parking courtyard into Jewels de Paragon wing.'
          },
          lift: {
            available: false,
            lastVerifiedAt: subDays(now, 100),
            verificationCount: 1,
            notes: 'Ground floor only.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 100),
            verificationCount: 1,
            notes: 'Air-conditioned section has a western commode with grab bars.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 100),
            verificationCount: 2,
            notes: 'Flush doorway into main dining room.'
          }
        }
      },
      {
        name: 'CTR - Shri Sagar (Malleshwaram)',
        category: 'restaurant',
        address: {
          street: '7th Cross, Margosa Road, Malleshwaram',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560003',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.5714, 12.9984] },
        features: {
          ramp: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' },
          lift: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' },
          accessibleToilet: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' },
          stepFreeEntrance: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' }
        }
      },

      // 4. RETAIL & SHOPPING MALLS
      {
        name: 'Phoenix Marketcity (Whitefield)',
        category: 'retail',
        address: {
          street: 'Dyavasandra Industrial Area, Mahadevapura, Whitefield Main Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560048',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.6974, 12.9967] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 3),
            verificationCount: 6,
            notes: 'Smooth, tactile-guided ramps at both Lower Ground and Upper Ground plazas.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 3),
            verificationCount: 8,
            notes: 'Multiple panoramic and service elevators across all 4 retail wings; priority buttons for wheelchairs.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 3),
            verificationCount: 5,
            notes: 'Impeccably maintained accessible restrooms on every floor with automatic soap dispensers and panic buttons.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 3),
            verificationCount: 7,
            notes: 'Completely step-free automatic sliding sensor entrance with security bag scanners wide enough for wheelchairs.'
          }
        }
      },
      {
        name: 'Orion Mall at Brigade Gateway',
        category: 'retail',
        address: {
          street: '26/1, Dr. Rajkumar Road, Malleshwaram-Rajajinagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560055',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.5552, 13.0112] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 7),
            verificationCount: 5,
            notes: 'Lakeside promenade ramp has gentle slope and wide turning bays.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 7),
            verificationCount: 6,
            notes: 'Fast glass elevators connecting PVR Cinemas and food court to multi-level parking.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 7),
            verificationCount: 4,
            notes: 'All public restrooms include a dedicated disabled stall with horizontal and vertical grab rails.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 7),
            verificationCount: 6,
            notes: 'Zero steps from Brigade Gateway walkway into lower ground floor.'
          }
        }
      },
      {
        name: 'UB City (Vittal Mallya Road)',
        category: 'retail',
        address: {
          street: '24, Vittal Mallya Road, KG Halli, Ashok Nagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.5966, 12.9719] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 12),
            verificationCount: 4,
            notes: 'Marble ramp with brass handrails at main portico near concourse drop-off.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 12),
            verificationCount: 5,
            notes: 'Elevators connect Piazza level, luxury arcade, and rooftop restaurants.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 12),
            verificationCount: 3,
            notes: 'Pristine accessible restroom on 2nd floor luxury retail corridor.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 12),
            verificationCount: 5,
            notes: 'Motorized revolving doors with adjacent wide push-button automatic accessible door.'
          }
        }
      },
      {
        name: 'Commercial Street Pedestrian Enclave',
        category: 'retail',
        address: {
          street: 'Commercial Street, Tasker Town, Shivaji Nagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.6108, 12.9822] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 80), // Moderate
            verificationCount: 2,
            notes: 'Smart City cobblestone redesign added curb ramps at major intersections, though shoppers can be crowded.'
          },
          lift: {
            available: false,
            lastVerifiedAt: subDays(now, 80),
            verificationCount: 1,
            notes: 'Open-air street level shopping; individual multi-story clothing shops rarely have internal lifts.'
          },
          accessibleToilet: {
            available: false,
            lastVerifiedAt: subDays(now, 80),
            verificationCount: 1,
            notes: 'BBMP public toilet near Kamaraj Road is not wheelchair accessible.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 80),
            verificationCount: 2,
            notes: 'Smart City paving has made the street promenade completely step-free.'
          }
        }
      },

      // 5. EDUCATION & LIBRARIES
      {
        name: 'State Central Library (Cubbon Park)',
        category: 'education',
        address: {
          street: 'Seshadri Iyer Memorial Hall, Central Cubbon Park, Kasturba Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.5928, 12.9763] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 9),
            verificationCount: 3,
            notes: 'Historic red brick hall has a dedicated concrete ramp on the eastern verandah entrance.'
          },
          lift: {
            available: false,
            lastVerifiedAt: subDays(now, 9),
            verificationCount: 1,
            notes: 'Heritage structure has no elevator; ground floor reading rooms and Braille section are fully accessible.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 9),
            verificationCount: 2,
            notes: 'Braille Section annex includes an accessible western-style restroom.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 9),
            verificationCount: 4,
            notes: 'East gate entrance allows direct roll-in access into the main reading hall.'
          }
        }
      },
      {
        name: 'Bangalore International Centre (BIC)',
        category: 'education',
        address: {
          street: '7, 4th Main Road, Domlur II Stage',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560071',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.6372, 12.9644] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 16),
            verificationCount: 4,
            notes: 'Architectural masterpiece designed for barrier-free access with continuous gentle ramps.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 16),
            verificationCount: 5,
            notes: 'Modern elevators connect library, auditorium, gallery, and terrace garden.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 16),
            verificationCount: 3,
            notes: 'Gender-neutral accessible washrooms on all three floors.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 16),
            verificationCount: 5,
            notes: 'Completely level courtyard with wide automatic glass doors.'
          }
        }
      },
      {
        name: 'IISc - J.R.D. Tata Memorial Library',
        category: 'education',
        address: {
          street: 'Indian Institute of Science Campus, CV Raman Road, Malleshwaram',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560012',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.5682, 13.0189] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 70), // Moderate
            verificationCount: 2,
            notes: 'Paved ramp with sturdy stainless steel handrails leads to central circulation desk.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 70),
            verificationCount: 3,
            notes: 'Elevator inside the journal stacks building; accessible with student/faculty RFID or security assist.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 70),
            verificationCount: 2,
            notes: 'Ground floor restroom is wheelchair accessible with clear signage.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 70),
            verificationCount: 2,
            notes: 'Wide automated main gate at library portico.'
          }
        }
      },

      // 6. ENTERTAINMENT, CULTURE & PUBLIC PARKS
      {
        name: 'Ranga Shankara Theatre',
        category: 'entertainment',
        address: {
          street: '36/2, 8th Cross Road, 2nd Phase, J.P. Nagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560078',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.5794, 12.9126] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 5),
            verificationCount: 4,
            notes: 'Well-maintained brick ramp from entrance foyer to theatre auditorium and cafe.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 5),
            verificationCount: 3,
            notes: 'Elevator connects lower bookshop and foyer to the main auditorium.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 5),
            verificationCount: 3,
            notes: 'Spacious accessible restroom next to the green room and courtyard.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 5),
            verificationCount: 5,
            notes: 'Theatre foyer is on flat ground grade; designated front-row wheelchair seating spaces.'
          }
        }
      },
      {
        name: 'Visvesvaraya Industrial & Technological Museum',
        category: 'entertainment',
        address: {
          street: 'Kasturba Road, Near Bal Bhavan, Cubbon Park',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.5985, 12.9751] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 25),
            verificationCount: 3,
            notes: 'Tiled access ramp leads past the security ticket turnstiles.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 25),
            verificationCount: 4,
            notes: 'Heavy-duty elevator connects ground floor engine hall to the Space and Biotech galleries.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 25),
            verificationCount: 2,
            notes: 'Accessible washroom located near science park exhibits.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 25),
            verificationCount: 4,
            notes: 'Wide side gate for prams and wheelchairs directly into lobby.'
          }
        }
      },
      {
        name: 'Ravindra Kalakshetra',
        category: 'entertainment',
        address: {
          street: 'Jayachamaraja Road, Sampangi Rama Nagara',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560002',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.5855, 12.9642] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 115), // Stale
            verificationCount: 1,
            notes: 'Side ramp leads into the main drama auditorium; could use refreshed paint markings.'
          },
          lift: {
            available: false,
            lastVerifiedAt: subDays(now, 115),
            verificationCount: 1,
            notes: 'Balcony tier seating is accessible only by stairs; ground auditorium is step-free.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 115),
            verificationCount: 1,
            notes: 'Ground floor restroom has wide door and grab bar.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 115),
            verificationCount: 1,
            notes: 'Side auditorium doors provide step-free access.'
          }
        }
      },
      {
        name: 'Lalbagh Botanical Garden (West Gate Entrance)',
        category: 'public_service',
        address: {
          street: 'Krumbiegal Road, Mavalli, Basavanagudi',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560004',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.5839, 12.9507] },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 11),
            verificationCount: 5,
            notes: 'Paved, wide concrete pathway with zero steps leading past the historic ticket counter.'
          },
          lift: {
            available: false,
            lastVerifiedAt: null, // Open botanical park
            verificationCount: 0,
            notes: ''
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 11),
            verificationCount: 3,
            notes: 'Public e-toilet unit near Glass House has a dedicated wheelchair accessible ramp and stall.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 11),
            verificationCount: 6,
            notes: 'Wide pedestrian turnstile has an adjacent accessible gate for wheelchairs and buggies.'
          }
        }
      },
      {
        name: 'Bangalore Golf Club & Pavillion',
        category: 'other',
        address: {
          street: '2, Sankey Road, High Grounds',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [77.5833, 12.9933] },
        features: {
          ramp: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' },
          lift: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' },
          accessibleToilet: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' },
          stepFreeEntrance: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' }
        }
      }
    ];

    const insertedPlaces = [];

    for (const venue of bangaloreVenues) {
      venue.overallFreshnessScore = calculateOverallFreshness(venue.features, now);
      const doc = new Place(venue);
      await doc.save();
      insertedPlaces.push(doc);

      // Generate realistic timeline verification notes for verified features
      const featureKeys = ['ramp', 'lift', 'accessibleToilet', 'stepFreeEntrance'];
      const notesToInsert = [];

      const bangaloreAuditors = [
        'Karthik S. (Wheelchair Commuter)',
        'Deepa Rao (Disability Rights Advocate)',
        'Arun Kumar (Pedestrian Safety Volunteer)',
        'Sneha Hegde (Accessible Bengaluru Volunteer)',
        'Vikram Nambiar (Senior Citizen Walker)',
        'Ananya Murthy (Ergonomics Consultant)'
      ];

      for (let i = 0; i < featureKeys.length; i++) {
        const fKey = featureKeys[i];
        const feat = venue.features[fKey];
        if (feat && feat.lastVerifiedAt) {
          const auditor = bangaloreAuditors[(doc.name.length + i) % bangaloreAuditors.length];
          notesToInsert.push({
            placeId: doc._id,
            feature: fKey,
            observedStatus: feat.available,
            contributorName: auditor,
            details: feat.notes || 'Verified feature operational state and physical condition on site.',
            conditionRating: feat.available ? 'operational' : 'needs_maintenance',
            verifiedAt: feat.lastVerifiedAt
          });
        }
      }

      if (notesToInsert.length > 0) {
        await VerificationNote.insertMany(notesToInsert);
      }
    }

    console.log(`[Seed] Successfully seeded ${insertedPlaces.length} authentic Bengaluru venues with realistic verification notes!`);
    return insertedPlaces;
  } catch (err) {
    console.error(`[Seed] Error during seeding: ${err.message}`);
    throw err;
  } finally {
    if (autoDisconnect) {
      await disconnectDB();
    }
  }
}

// Run immediately if executed via CLI
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  seedDatabase()
    .then(() => {
      console.log('[Seed] Seeding finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Fatal error:', err);
      process.exit(1);
    });
}
