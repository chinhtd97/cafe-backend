/* eslint-disable @typescript-eslint/unbound-method */

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: AuthService, useValue: { login: jest.fn() } },
      ],
    }).compile();

    controller = module.get(AuthController);
    service = module.get(AuthService);
  });

  it('should call login service', async () => {
    // ✅ Arrow function mock cookie → tránh unbound-method
    const cookieMock = jest.fn().mockReturnThis();
    const mockRes = { cookie: cookieMock } as unknown as Parameters<
      AuthController['login']
    >[1];

    // mock login trả đầy đủ giá trị
    (service.login as jest.Mock).mockResolvedValueOnce({
      accessToken: 'fake-access',
      refreshToken: 'fake-refresh', // bắt buộc
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@mail.com',
        role_id: 'role123',
      },
    });

    const result = await controller.login(
      { email: 'test@mail.com', password: '123456' },
      mockRes,
    );

    expect(service.login).toHaveBeenCalledWith('test@mail.com', '123456');

    // ✅ luôn dùng cookieMock trực tiếp → ESLint không báo lỗi
    expect(cookieMock).toHaveBeenCalledWith(
      'refreshToken',
      'fake-refresh',
      expect.any(Object),
    );

    expect(result).toEqual({
      accessToken: 'fake-access',
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@mail.com',
        role_id: 'role123',
      },
    });
  });
});
