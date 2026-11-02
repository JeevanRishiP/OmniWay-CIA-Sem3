import 'dotenv/config';
import { subDays } from 'date-fns';
import { connectDB, disconnectDB } from './config/db.js';
import { Place } from './models/Place.js';
import { VerificationNote } from './models/VerificationNote.js';
import { calculateOverallFreshness } from './utils/freshnessCalculator.js';

export async function seedDatabase(uri = process.env.MONGODB_URI, autoDisconnect = true) {
  try {
    await connectDB(uri);
    console.log('[Seed] Clearing existing places and verification notes...');
    await Place.deleteMany({});
    await VerificationNote.deleteMany({});

    const now = new Date();

    const sampleVenues = [
      {
        name: 'Metro Central Transit Station',
        category: 'transit',
        address: {
          street: '100 Transit Plaza',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94103',
          country: 'USA'
        },
        location: {
          type: 'Point',
          coordinates: [-122.4194, 37.7749]
        },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 3),
            verificationCount: 4,
            notes: 'Exterior wide ramp has non-slip grip tape and heavy-duty handrails on both sides.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 5),
            verificationCount: 6,
            notes: 'Elevator between mezzanine and train platforms is active, with audible chimes and Braille buttons.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 8),
            verificationCount: 3,
            notes: 'Automated door push-plate works smoothly. Interior grab bars are sturdy and compliant.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 3),
            verificationCount: 5,
            notes: 'Main double glass doors open automatically via infrared sensor. Wide 42-inch clearance.'
          }
        }
      },
      {
        name: 'Green Leaf Community Health Center',
        category: 'healthcare',
        address: {
          street: '450 Wellness Boulevard',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94102',
          country: 'USA'
        },
        location: {
          type: 'Point',
          coordinates: [-122.422, 37.781]
        },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 12),
            verificationCount: 2,
            notes: 'Gentle 1:12 slope ramp leading from street parking directly to patient intake.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 45), // Moderate
            verificationCount: 2,
            notes: 'Stretcher-rated elevator operational, occasional delay during morning shift changes.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 12),
            verificationCount: 3,
            notes: 'All-gender wheelchair-accessible restroom on 1st floor; motion-sensor sink and soap dispenser.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 45),
            verificationCount: 1,
            notes: 'Threshold is completely flush with the sidewalk. Automatic sliding door sensor is sensitive.'
          }
        }
      },
      {
        name: 'The Blue Harbor Seafood Bistro',
        category: 'restaurant',
        address: {
          street: '220 Waterfront Esplanade',
          city: 'Oakland',
          state: 'CA',
          postalCode: '94607',
          country: 'USA'
        },
        location: {
          type: 'Point',
          coordinates: [-122.277, 37.795]
        },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 55), // Moderate
            verificationCount: 2,
            notes: 'Wood decking ramp to patio is solid, slight incline requires care when wet.'
          },
          lift: {
            available: false,
            lastVerifiedAt: subDays(now, 70), // Moderate
            verificationCount: 1,
            notes: 'No lift available for upper mezzanine dining area; ground floor seating is fully accessible.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 60), // Moderate
            verificationCount: 2,
            notes: 'Single-occupancy ADA restroom next to main bar; turn radius is generous.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 55), // Moderate
            verificationCount: 3,
            notes: 'Front entrance has zero steps. Double doors require manual push.'
          }
        }
      },
      {
        name: 'Civic Center Grand Cinema & Theater',
        category: 'entertainment',
        address: {
          street: '88 Arts Parkway',
          city: 'San Jose',
          state: 'CA',
          postalCode: '95113',
          country: 'USA'
        },
        location: {
          type: 'Point',
          coordinates: [-121.889, 37.332]
        },
        features: {
          ramp: {
            available: true,
            lastVerifiedAt: subDays(now, 110), // Stale (> 90 days)
            verificationCount: 1,
            notes: 'Side ramp leads into Auditorium 1. Handrail paint was peeling when checked last autumn.'
          },
          lift: {
            available: true,
            lastVerifiedAt: subDays(now, 140), // Stale
            verificationCount: 1,
            notes: 'Lift to balcony tier was running, needs keycard from usher to operate.'
          },
          accessibleToilet: {
            available: true,
            lastVerifiedAt: subDays(now, 105), // Stale
            verificationCount: 1,
            notes: 'Restroom stall at rear of lobby; grab bar on left side was slightly loose.'
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 110), // Stale
            verificationCount: 1,
            notes: 'Historic facade has stone stairs, but western side door has step-free grade.'
          }
        }
      },
      {
        name: 'Apex Tech & Independent Books',
        category: 'retail',
        address: {
          street: '1540 University Ave',
          city: 'Berkeley',
          state: 'CA',
          postalCode: '94703',
          country: 'USA'
        },
        location: {
          type: 'Point',
          coordinates: [-122.281, 37.871]
        },
        features: {
          ramp: {
            available: false,
            lastVerifiedAt: subDays(now, 18),
            verificationCount: 1,
            notes: 'Store entrance is level with pavement; no ramp required.'
          },
          lift: {
            available: false,
            lastVerifiedAt: null, // Unverified
            verificationCount: 0,
            notes: ''
          },
          accessibleToilet: {
            available: false,
            lastVerifiedAt: null, // Unverified
            verificationCount: 0,
            notes: ''
          },
          stepFreeEntrance: {
            available: true,
            lastVerifiedAt: subDays(now, 18),
            verificationCount: 2,
            notes: 'Automatic sliding door with wide corridor between display tables.'
          }
        }
      },
      {
        name: 'Heritage Community Archive & Reading Room',
        category: 'education',
        address: {
          street: '310 Mission Trail',
          city: 'Palo Alto',
          state: 'CA',
          postalCode: '94301',
          country: 'USA'
        },
        location: {
          type: 'Point',
          coordinates: [-122.159, 37.441]
        },
        features: {
          ramp: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' },
          lift: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' },
          accessibleToilet: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' },
          stepFreeEntrance: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' }
        }
      }
    ];

    const insertedPlaces = [];

    for (const venue of sampleVenues) {
      venue.overallFreshnessScore = calculateOverallFreshness(venue.features, now);
      const doc = new Place(venue);
      await doc.save();
      insertedPlaces.push(doc);

      // Generate realistic timeline verification notes for verified features
      const featureKeys = ['ramp', 'lift', 'accessibleToilet', 'stepFreeEntrance'];
      const notesToInsert = [];

      for (const fKey of featureKeys) {
        const feat = venue.features[fKey];
        if (feat && feat.lastVerifiedAt) {
          notesToInsert.push({
            placeId: doc._id,
            feature: fKey,
            observedStatus: feat.available,
            contributorName:
              fKey === 'ramp'
                ? 'Jordan (Wheelchair User)'
                : fKey === 'lift'
                ? 'Elena Vance (Transit Advocate)'
                : 'Marcus R. (Community Auditor)',
            details: feat.notes || 'Verified feature operational state and physical condition.',
            conditionRating: feat.available ? 'excellent' : 'needs_maintenance',
            verifiedAt: feat.lastVerifiedAt
          });
        }
      }

      if (notesToInsert.length > 0) {
        await VerificationNote.insertMany(notesToInsert);
      }
    }

    console.log(`[Seed] Successfully seeded ${insertedPlaces.length} venues with realistic verification notes!`);
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

import { fileURLToPath } from 'url';

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

