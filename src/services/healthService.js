const mongoose = require('mongoose');

/**
 * Service handling health check diagnostic checks
 */
class HealthService {
  /**
   * Retrieves server health details and database status
   * @returns {Object} Health status details
   */
  async getSystemHealth() {
    const dbState = mongoose.connection.readyState;
    const dbStatusMap = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting'
    };

    return {
      service: 'Industrial Worker Safety & Compensation Backend API',
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      database: {
        status: dbStatusMap[dbState] || 'Unknown',
        connected: dbState === 1
      }
    };
  }
}

module.exports = new HealthService();
