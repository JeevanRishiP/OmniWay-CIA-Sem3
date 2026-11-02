import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../src/server.js';
import { Place } from '../src/models/Place.js';
import { VerificationNote } from '../src/models/VerificationNote.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await Place.deleteMany({});
  await VerificationNote.deleteMany({});
});

describe('OmniWay API', () => {
  describe('GET /api/health', () => {
    it('returns service health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('database', 'connected');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/places', () => {
    it('creates a new place with valid payload', async () => {
      const payload = {
        name: 'Civic Library and Learning Hub',
        category: 'education',
        address: {
          street: '100 Main Street',
          city: 'Seattle',
          state: 'WA',
          postalCode: '98101',
          country: 'USA'
        },
        initialFeatures: {
          ramp: {
            available: true,
            notes: 'Wide concrete ramp at east door',
            contributorName: 'Alex K.'
          }
        }
      };

      const res = await request(app).post('/api/places').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.place).toHaveProperty('_id');
      expect(res.body.place.name).toBe('Civic Library and Learning Hub');
      expect(res.body.place.features.ramp.available).toBe(true);
      expect(res.body.place.features.ramp.verificationCount).toBe(1);
      expect(res.body.place.overallFreshnessScore).toBe('fresh');

      // Check initial verification note created
      const notes = await VerificationNote.find({ placeId: res.body.place._id });
      expect(notes.length).toBe(1);
      expect(notes[0].feature).toBe('ramp');
      expect(notes[0].contributorName).toBe('Alex K.');
    });

    it('returns RFC 7807 400 error on invalid payload', async () => {
      const invalidPayload = {
        name: '', // Empty name violates schema
        category: 'invalid_category'
      };

      const res = await request(app).post('/api/places').send(invalidPayload);

      expect(res.status).toBe(400);
      expect(res.body.type).toBe('https://api.accessibleplace.org/errors/validation-error');
      expect(res.body.title).toBe('Validation Error');
      expect(res.body).toHaveProperty('invalidParams');
    });
  });

  describe('GET /api/places', () => {
    beforeEach(async () => {
      await Place.create([
        {
          name: 'Blue Harbor Cafe',
          category: 'restaurant',
          address: { street: '10 Ocean Way', city: 'Portland', state: 'OR', postalCode: '97201' },
          features: {
            ramp: { available: true, lastVerifiedAt: new Date(), verificationCount: 1, notes: 'Good condition' },
            lift: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' },
            accessibleToilet: { available: true, lastVerifiedAt: new Date(), verificationCount: 1, notes: 'Spacious' },
            stepFreeEntrance: { available: true, lastVerifiedAt: new Date(), verificationCount: 1, notes: 'Flush threshold' }
          },
          overallFreshnessScore: 'fresh'
        },
        {
          name: 'Mountain Health Clinic',
          category: 'healthcare',
          address: { street: '50 Alpine Rd', city: 'Denver', state: 'CO', postalCode: '80202' },
          features: {
            ramp: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' },
            lift: { available: true, lastVerifiedAt: new Date(), verificationCount: 2, notes: 'Running smooth' },
            accessibleToilet: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' },
            stepFreeEntrance: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' }
          },
          overallFreshnessScore: 'fresh'
        }
      ]);
    });

    it('returns paginated place list', async () => {
      const res = await request(app).get('/api/places');
      expect(res.status).toBe(200);
      expect(res.body.places.length).toBe(2);
      expect(res.body.pagination.total).toBe(2);
    });

    it('filters by category', async () => {
      const res = await request(app).get('/api/places?category=restaurant');
      expect(res.status).toBe(200);
      expect(res.body.places.length).toBe(1);
      expect(res.body.places[0].name).toBe('Blue Harbor Cafe');
    });

    it('filters by search keyword', async () => {
      const res = await request(app).get('/api/places?search=Mountain');
      expect(res.status).toBe(200);
      expect(res.body.places.length).toBe(1);
      expect(res.body.places[0].name).toBe('Mountain Health Clinic');
    });

    it('filters by feature availability', async () => {
      const res = await request(app).get('/api/places?ramp=true');
      expect(res.status).toBe(200);
      expect(res.body.places.length).toBe(1);
      expect(res.body.places[0].name).toBe('Blue Harbor Cafe');
    });
  });

  describe('POST /api/places/:id/verify', () => {
    it('submits verification and updates feature timestamp and count atomically', async () => {
      const place = await Place.create({
        name: 'Starlight Theater',
        category: 'entertainment',
        address: { street: '44 Broadway', city: 'New York', state: 'NY', postalCode: '10001' },
        features: {
          ramp: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' },
          lift: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' },
          accessibleToilet: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' },
          stepFreeEntrance: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' }
        },
        overallFreshnessScore: 'unverified'
      });

      const verifyPayload = {
        feature: 'ramp',
        observedStatus: true,
        details: 'Newly installed permanent ramp with dual handrails and slip-resistant surface.',
        conditionRating: 'excellent',
        contributorName: 'Sam Q. (Accessibility Auditor)'
      };

      const res = await request(app)
        .post(`/api/places/${place._id}/verify`)
        .send(verifyPayload);

      expect(res.status).toBe(201);
      expect(res.body.place.features.ramp.available).toBe(true);
      expect(res.body.place.features.ramp.verificationCount).toBe(1);
      expect(res.body.place.features.ramp.notes).toBe(verifyPayload.details);
      expect(res.body.place.overallFreshnessScore).toBe('fresh');
      expect(res.body.note).toHaveProperty('_id');
      expect(res.body.note.feature).toBe('ramp');

      // Check notes endpoint
      const notesRes = await request(app).get(`/api/places/${place._id}/notes`);
      expect(notesRes.status).toBe(200);
      expect(notesRes.body.notes.length).toBe(1);
      expect(notesRes.body.notes[0].details).toBe(verifyPayload.details);
    });

    it('returns 404 for non-existent place', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).post(`/api/places/${fakeId}/verify`).send({
        feature: 'lift',
        observedStatus: true,
        details: 'Lift is operational'
      });

      expect(res.status).toBe(404);
      expect(res.body.type).toBe('https://api.accessibleplace.org/errors/place-not-found');
    });
  });
});

