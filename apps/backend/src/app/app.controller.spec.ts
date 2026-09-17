import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;
  let appService: { checkHealth: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    appService = {
      checkHealth: vi.fn(),
    };
    appController = new AppController(appService as unknown as AppService);
  });

  describe('health', () => {
    it('returns health status with database connectivity', async () => {
      const mockResult = {
        status: 'ok',
        database: 'connected',
        timestamp: '2026-09-17T00:00:00.000Z',
      };
      appService.checkHealth.mockResolvedValue(mockResult);

      const result = await appController.getHealth();
      expect(result).toEqual(mockResult);
    });
  });
});
