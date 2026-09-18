import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServiceUnavailableException } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;
  let mockAppService: { checkHealth: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockAppService = {
      checkHealth: vi.fn(),
    };
    appController = new AppController(mockAppService as unknown as AppService);
  });

  describe('health', () => {
    it('returns health status with database connectivity', async () => {
      const mockResult = {
        status: 'ok',
        database: 'connected',
        timestamp: '2026-09-17T00:00:00.000Z',
      };
      mockAppService.checkHealth.mockResolvedValue(mockResult);

      const result = await appController.getHealth();
      expect(result).toEqual(mockResult);
      expect(mockAppService.checkHealth).toHaveBeenCalledTimes(1);
    });

    it('propagates ServiceUnavailableException when health check fails', async () => {
      mockAppService.checkHealth.mockRejectedValue(
        new ServiceUnavailableException('Database down'),
      );

      await expect(appController.getHealth()).rejects.toThrow(
        ServiceUnavailableException,
      );
    });
  });
});
