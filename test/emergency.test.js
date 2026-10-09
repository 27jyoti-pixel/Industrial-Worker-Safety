const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const EmergencyIncident = require('../src/models/emergencyIncidentModel');
const { factoryOf, publicIncident } = require('../src/controllers/emergencyController');
const { factoryRoom } = require('../src/sockets/emergencySocket');

test('incident schema accepts a valid emergency and constrains status/type', () => {
  const incident = new EmergencyIncident({
    factoryName: 'apex steel',
    reportedBy: new mongoose.Types.ObjectId(),
    requestId: 'request-1234567890',
    type: 'Gas leakage',
    location: 'Line 4',
    description: 'Odor reported near a valve'
  });
  assert.equal(incident.validateSync(), undefined);
  incident.type = 'Routine maintenance';
  assert.equal(incident.validateSync().errors.type.kind, 'enum');
});

test('factory scoping is normalized and produces different rooms for different factories', () => {
  assert.equal(factoryOf({ factoryName: ' Apex Steel ' }), 'apex steel');
  assert.equal(factoryRoom(' Apex Steel '), factoryRoom('apex steel'));
  assert.notEqual(factoryRoom('apex steel'), factoryRoom('other factory'));
  assert.throws(() => factoryOf({}), { statusCode: 403 });
});

test('broadcast incident payload omits worker identifiers', () => {
  const incident = {
    _id: 'incident-1', type: 'Fire or explosion', location: 'Unit 2', description: '', status: 'ACTIVE',
    createdAt: new Date('2026-10-09T00:00:00Z'), acknowledgements: [{ user: 'private-user-id' }]
  };
  const payload = publicIncident(incident);
  assert.equal(payload.acknowledgementCount, 1);
  assert.equal(Object.hasOwn(payload, 'acknowledgements'), false);
  assert.equal(Object.hasOwn(payload, 'factoryName'), false);
  assert.equal(Object.hasOwn(payload, 'reportedBy'), false);
});
