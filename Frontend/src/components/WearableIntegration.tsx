import React, { useState, useEffect } from 'react';
import '../Styles/WearableIntegration.css';
import axios from 'axios';

interface HealthData {
  heartRate: number;
  steps: number;
  calories: number;
  sleep: number;
  bloodOxygen: number;
  breathingRate: number;
  skinTemperature: number;
  alerts: Array<{
    type: string;
    message: string;
    metric: string;
    value: number;
  }>;
  lastSync: string;
}

const WearableIntegration: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showAlerts, setShowAlerts] = useState(false);

  const supportedDevices = [
    { id: 'fitbit', name: 'Fitbit' },
    { id: 'apple-watch', name: 'Apple Watch' },
    { id: 'garmin', name: 'Garmin' },
    { id: 'samsung', name: 'Samsung Health' }
  ];

  const connectDevice = async (deviceId: string) => {
    try {
      setError('');
      // Redirect to the appropriate authentication endpoint
      window.location.href = `/api/wearable/auth/${deviceId}`;
    } catch (error) {
      console.error('Failed to connect device:', error);
      setError('Failed to connect device. Please try again.');
    }
  };

  const disconnectDevice = async () => {
    try {
      setError('');
      await axios.post(`/api/wearable/disconnect/${selectedDevice}`);
      setIsConnected(false);
      setSelectedDevice('');
      setHealthData(null);
    } catch (error) {
      console.error('Failed to disconnect device:', error);
      setError('Failed to disconnect device. Please try again.');
    }
  };

  const fetchHealthData = async () => {
    try {
      setError('');
      const response = await axios.get(`/api/wearable/data/${selectedDevice}`);
      setHealthData({
        ...response.data,
        lastSync: new Date().toLocaleString()
      });
    } catch (error) {
      console.error('Failed to fetch health data:', error);
      setError('Failed to fetch health data. Please try again.');
    }
  };

  // Check URL parameters for device connection status
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const device = params.get('device');
    const status = params.get('status');

    if (device && status === 'connected') {
      setSelectedDevice(device);
      setIsConnected(true);
      fetchHealthData();
    } else if (status === 'error') {
      setError('Failed to connect device. Please try again.');
    }
  }, []);

  // Set up polling for health data
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(fetchHealthData, 300000); // Poll every 5 minutes
    }
    return () => clearInterval(interval);
  }, [isConnected, selectedDevice]);

  return (
    <div className="wearable-integration">
      <h2>Chronic Illness Monitoring</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {!isConnected ? (
        <div className="device-selection">
          <h3>Select Your Device</h3>
          <div className="device-list">
            {supportedDevices.map(device => (
              <button
                key={device.id}
                className="device-button"
                onClick={() => connectDevice(device.id)}
              >
                {device.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="device-data">
          <div className="device-header">
            <h3>Connected: {selectedDevice}</h3>
            <button onClick={disconnectDevice} className="disconnect-button">
              Disconnect
            </button>
          </div>
          
          {healthData && (
            <div className="health-metrics">
              <div className="metrics-grid">
                <div className="metric-card critical">
                  <h4>Blood Oxygen</h4>
                  <p>{healthData.bloodOxygen}%</p>
                  {healthData.bloodOxygen < 95 && (
                    <span className="alert-indicator">⚠️</span>
                  )}
                </div>
                <div className="metric-card critical">
                  <h4>Breathing Rate</h4>
                  <p>{healthData.breathingRate} bpm</p>
                  {healthData.breathingRate > 20 && (
                    <span className="alert-indicator">⚠️</span>
                  )}
                </div>
                <div className="metric-card critical">
                  <h4>Skin Temperature</h4>
                  <p>{healthData.skinTemperature}°C</p>
                  {healthData.skinTemperature > 37.5 && (
                    <span className="alert-indicator">⚠️</span>
                  )}
                </div>
                <div className="metric-card">
                  <h4>Heart Rate</h4>
                  <p>{healthData.heartRate} bpm</p>
                </div>
                <div className="metric-card">
                  <h4>Steps</h4>
                  <p>{healthData.steps}</p>
                </div>
                <div className="metric-card">
                  <h4>Sleep</h4>
                  <p>{healthData.sleep} hours</p>
                </div>
              </div>

              {healthData.alerts && healthData.alerts.length > 0 && (
                <div className="alerts-section">
                  <button 
                    className="alerts-toggle"
                    onClick={() => setShowAlerts(!showAlerts)}
                  >
                    {showAlerts ? 'Hide Alerts' : 'Show Alerts'} ({healthData.alerts.length})
                  </button>
                  
                  {showAlerts && (
                    <div className="alerts-list">
                      {healthData.alerts.map((alert, index) => (
                        <div key={index} className={`alert-item ${alert.type}`}>
                          <span className="alert-icon">⚠️</span>
                          <div className="alert-content">
                            <p className="alert-message">{alert.message}</p>
                            <p className="alert-value">Current value: {alert.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="sync-info">
                <p>Last synced: {healthData.lastSync}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WearableIntegration; 