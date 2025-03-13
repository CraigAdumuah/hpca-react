const axios = require('axios');
const jwt = require('jsonwebtoken');

class WearableService {
  constructor() {
    this.deviceTokens = new Map();
  }

  // Fitbit Authentication
  async authenticateFitbit(code) {
    try {
      const response = await axios.post('https://api.fitbit.com/oauth2/token', 
        `grant_type=authorization_code&code=${code}&client_id=${process.env.FITBIT_CLIENT_ID}&client_secret=${process.env.FITBIT_CLIENT_SECRET}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Fitbit authentication error:', error);
      throw error;
    }
  }

  // Apple Health Authentication
  async authenticateAppleHealth(userId) {
    try {
      // Implement Apple Health authentication
      // This would involve JWT generation and Apple Health API calls
      return {
        access_token: 'apple_health_token',
        refresh_token: 'apple_health_refresh_token'
      };
    } catch (error) {
      console.error('Apple Health authentication error:', error);
      throw error;
    }
  }

  // Garmin Authentication
  async authenticateGarmin(code) {
    try {
      const response = await axios.post('https://apis.garmin.com/oauth/token',
        {
          grant_type: 'authorization_code',
          code: code,
          client_id: process.env.GARMIN_CLIENT_ID,
          client_secret: process.env.GARMIN_CLIENT_SECRET,
          redirect_uri: process.env.GARMIN_REDIRECT_URI
        }
      );
      return response.data;
    } catch (error) {
      console.error('Garmin authentication error:', error);
      throw error;
    }
  }

  // Samsung Health Authentication
  async authenticateSamsungHealth(code) {
    try {
      const response = await axios.post('https://api.samsung.com/health/oauth2/token',
        {
          grant_type: 'authorization_code',
          code: code,
          client_id: process.env.SAMSUNG_CLIENT_ID,
          client_secret: process.env.SAMSUNG_CLIENT_SECRET,
          redirect_uri: process.env.SAMSUNG_REDIRECT_URI
        }
      );
      return response.data;
    } catch (error) {
      console.error('Samsung Health authentication error:', error);
      throw error;
    }
  }

  // Fetch Health Data with Chronic Illness Metrics
  async fetchHealthData(deviceType, accessToken, userId) {
    try {
      const baseData = await this.fetchBaseHealthData(deviceType, accessToken);
      const chronicMetrics = await this.fetchChronicMetrics(deviceType, accessToken);
      
      return {
        ...baseData,
        ...chronicMetrics,
        userId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching health data:', error);
      throw error;
    }
  }

  // Fetch Base Health Data
  async fetchBaseHealthData(deviceType, accessToken) {
    try {
      switch (deviceType) {
        case 'fitbit':
          return await this.fetchFitbitData(accessToken);
        case 'apple-watch':
          return await this.fetchAppleHealthData(accessToken);
        case 'garmin':
          return await this.fetchGarminData(accessToken);
        case 'samsung':
          return await this.fetchSamsungData(accessToken);
        default:
          throw new Error('Unsupported device type');
      }
    } catch (error) {
      console.error('Error fetching base health data:', error);
      throw error;
    }
  }

  // Fetch Chronic Illness Specific Metrics
  async fetchChronicMetrics(deviceType, accessToken) {
    try {
      switch (deviceType) {
        case 'fitbit':
          return await this.fetchFitbitChronicMetrics(accessToken);
        case 'apple-watch':
          return await this.fetchAppleChronicMetrics(accessToken);
        case 'garmin':
          return await this.fetchGarminChronicMetrics(accessToken);
        case 'samsung':
          return await this.fetchSamsungChronicMetrics(accessToken);
        default:
          throw new Error('Unsupported device type');
      }
    } catch (error) {
      console.error('Error fetching chronic metrics:', error);
      throw error;
    }
  }

  // Fetch Fitbit Chronic Metrics
  async fetchFitbitChronicMetrics(accessToken) {
    try {
      const [spo2, breathingRate, skinTemp] = await Promise.all([
        axios.get('https://api.fitbit.com/1/user/-/spo2/date/today.json', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }),
        axios.get('https://api.fitbit.com/1/user/-/br/date/today.json', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }),
        axios.get('https://api.fitbit.com/1/user/-/temp/skin/date/today.json', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
      ]);

      return {
        bloodOxygen: spo2.data.value,
        breathingRate: breathingRate.data.value,
        skinTemperature: skinTemp.data.value,
        alerts: this.generateAlerts({
          bloodOxygen: spo2.data.value,
          breathingRate: breathingRate.data.value,
          skinTemperature: skinTemp.data.value
        })
      };
    } catch (error) {
      console.error('Error fetching Fitbit chronic metrics:', error);
      throw error;
    }
  }

  // Generate Health Alerts
  generateAlerts(metrics) {
    const alerts = [];
    
    if (metrics.bloodOxygen < 95) {
      alerts.push({
        type: 'warning',
        message: 'Low blood oxygen level detected',
        metric: 'bloodOxygen',
        value: metrics.bloodOxygen
      });
    }
    
    if (metrics.breathingRate > 20) {
      alerts.push({
        type: 'warning',
        message: 'Elevated breathing rate detected',
        metric: 'breathingRate',
        value: metrics.breathingRate
      });
    }
    
    if (metrics.skinTemperature > 37.5) {
      alerts.push({
        type: 'warning',
        message: 'Elevated skin temperature detected',
        metric: 'skinTemperature',
        value: metrics.skinTemperature
      });
    }

    return alerts;
  }

  // Store Patient Data for Doctor Access
  async storePatientData(userId, healthData) {
    try {
      // Store in database with timestamp and patient ID
      // This would be implemented based on your database schema
      return true;
    } catch (error) {
      console.error('Error storing patient data:', error);
      throw error;
    }
  }

  // Get Patient Data for Doctor Review
  async getPatientData(patientId, startDate, endDate) {
    try {
      // Fetch patient data from database within date range
      // This would be implemented based on your database schema
      return {
        patientId,
        data: [],
        summary: {
          averageHeartRate: 0,
          averageBloodOxygen: 0,
          totalAlerts: 0
        }
      };
    } catch (error) {
      console.error('Error fetching patient data:', error);
      throw error;
    }
  }

  // Fetch Fitbit Data
  async fetchFitbitData(accessToken) {
    try {
      const [heartRate, steps, calories, sleep] = await Promise.all([
        axios.get('https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }),
        axios.get('https://api.fitbit.com/1/user/-/activities/steps/date/today/1d.json', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }),
        axios.get('https://api.fitbit.com/1/user/-/activities/calories/date/today/1d.json', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }),
        axios.get('https://api.fitbit.com/1.2/user/-/sleep/date/today.json', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
      ]);

      return {
        heartRate: heartRate.data['activities-heart'][0].value.heartRateZones[0].max,
        steps: steps.data['activities-steps'][0].value,
        calories: calories.data['activities-calories'][0].value,
        sleep: sleep.data.summary.totalSleepDuration / 3600
      };
    } catch (error) {
      console.error('Error fetching Fitbit data:', error);
      throw error;
    }
  }

  // Fetch Apple Health Data
  async fetchAppleHealthData(accessToken) {
    // Implement Apple Health data fetching
    return {
      heartRate: 75,
      steps: 8500,
      calories: 450,
      sleep: 7.5
    };
  }

  // Fetch Garmin Data
  async fetchGarminData(accessToken) {
    try {
      const response = await axios.get('https://apis.garmin.com/wellness-api/rest/activities', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      return this.processGarminData(response.data);
    } catch (error) {
      console.error('Error fetching Garmin data:', error);
      throw error;
    }
  }

  // Fetch Samsung Health Data
  async fetchSamsungData(accessToken) {
    try {
      const response = await axios.get('https://api.samsung.com/health/data', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      return this.processSamsungData(response.data);
    } catch (error) {
      console.error('Error fetching Samsung data:', error);
      throw error;
    }
  }

  // Process Garmin Data
  processGarminData(data) {
    // Implement Garmin data processing
    return {
      heartRate: data.heartRate || 75,
      steps: data.steps || 8500,
      calories: data.calories || 450,
      sleep: data.sleep || 7.5
    };
  }

  // Process Samsung Data
  processSamsungData(data) {
    // Implement Samsung data processing
    return {
      heartRate: data.heartRate || 75,
      steps: data.steps || 8500,
      calories: data.calories || 450,
      sleep: data.sleep || 7.5
    };
  }
}

module.exports = new WearableService(); 