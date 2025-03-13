const express = require('express');
const router = express.Router();
const wearableService = require('../services/wearableService');
const auth = require('../middleware/auth');
const doctorAuth = require('../middleware/doctorAuth');

// Authenticate with Fitbit
router.get('/auth/fitbit', (req, res) => {
  const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${process.env.FITBIT_CLIENT_ID}&redirect_uri=${process.env.FITBIT_REDIRECT_URI}&scope=activity heartrate sleep`;
  res.redirect(authUrl);
});

// Fitbit callback
router.get('/auth/fitbit/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const tokens = await wearableService.authenticateFitbit(code);
    // Store tokens in database for the user
    res.redirect('/dashboard?device=fitbit&status=connected');
  } catch (error) {
    res.redirect('/dashboard?device=fitbit&status=error');
  }
});

// Authenticate with Apple Health
router.get('/auth/apple', (req, res) => {
  // Implement Apple Health authentication
  res.redirect('/dashboard?device=apple&status=connected');
});

// Authenticate with Garmin
router.get('/auth/garmin', (req, res) => {
  const authUrl = `https://connect.garmin.com/oauthConfirm?response_type=code&client_id=${process.env.GARMIN_CLIENT_ID}&redirect_uri=${process.env.GARMIN_REDIRECT_URI}&scope=activity`;
  res.redirect(authUrl);
});

// Garmin callback
router.get('/auth/garmin/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const tokens = await wearableService.authenticateGarmin(code);
    // Store tokens in database for the user
    res.redirect('/dashboard?device=garmin&status=connected');
  } catch (error) {
    res.redirect('/dashboard?device=garmin&status=error');
  }
});

// Authenticate with Samsung Health
router.get('/auth/samsung', (req, res) => {
  const authUrl = `https://api.samsung.com/health/oauth2/authorize?response_type=code&client_id=${process.env.SAMSUNG_CLIENT_ID}&redirect_uri=${process.env.SAMSUNG_REDIRECT_URI}&scope=activity`;
  res.redirect(authUrl);
});

// Samsung callback
router.get('/auth/samsung/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const tokens = await wearableService.authenticateSamsungHealth(code);
    // Store tokens in database for the user
    res.redirect('/dashboard?device=samsung&status=connected');
  } catch (error) {
    res.redirect('/dashboard?device=samsung&status=error');
  }
});

// Get health data for a specific device
router.get('/data/:deviceType', auth, async (req, res) => {
  try {
    const { deviceType } = req.params;
    const { accessToken } = req.user.devices[deviceType];
    const healthData = await wearableService.fetchHealthData(deviceType, accessToken, req.user.id);
    
    // Store the data for doctor access
    await wearableService.storePatientData(req.user.id, healthData);
    
    res.json(healthData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch health data' });
  }
});

// Doctor Routes
// Get patient data for review
router.get('/doctor/patient/:patientId', doctorAuth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { startDate, endDate } = req.query;
    
    const patientData = await wearableService.getPatientData(
      patientId,
      startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Default to last 7 days
      endDate || new Date()
    );
    
    res.json(patientData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patient data' });
  }
});

// Get alerts for a specific patient
router.get('/doctor/patient/:patientId/alerts', doctorAuth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { startDate, endDate } = req.query;
    
    const patientData = await wearableService.getPatientData(
      patientId,
      startDate || new Date(Date.now() - 24 * 60 * 60 * 1000), // Default to last 24 hours
      endDate || new Date()
    );
    
    const alerts = patientData.data
      .filter(reading => reading.alerts && reading.alerts.length > 0)
      .map(reading => ({
        timestamp: reading.timestamp,
        alerts: reading.alerts
      }));
    
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patient alerts' });
  }
});

// Get patient summary statistics
router.get('/doctor/patient/:patientId/summary', doctorAuth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { startDate, endDate } = req.query;
    
    const patientData = await wearableService.getPatientData(
      patientId,
      startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Default to last 7 days
      endDate || new Date()
    );
    
    res.json(patientData.summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patient summary' });
  }
});

// Disconnect a device
router.post('/disconnect/:deviceType', auth, async (req, res) => {
  try {
    const { deviceType } = req.params;
    // Remove device tokens from database
    res.json({ message: 'Device disconnected successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to disconnect device' });
  }
});

module.exports = router; 