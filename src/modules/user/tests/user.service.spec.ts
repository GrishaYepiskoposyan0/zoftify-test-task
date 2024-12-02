import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { PrismaService } from '../../../common/database/prisma/prisma.service';
import { mockPrismaService } from './mocks/prisma.service.mock';
import { NotFoundException } from '../../../common/exceptions/not-found.exception';
import { BadRequestException } from '../../../common/exceptions/bad-request.exception';

describe('UserService', () => {
  let service: UserService;
  let prismaService: jest.Mocked<typeof mockPrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService) as UserService;
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateUserById', () => {
    it('should update a user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'John',
        surname: 'Doe',
      };
      const updateUserDto = {
        email: 'new@test.com',
        name: 'Jane',
        surname: 'Smith',
      };
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.user.update.mockResolvedValue(updateUserDto);

      const result = await service.updateUserById(updateUserDto, mockUser.id);

      expect(result).toEqual({ success: true, data: updateUserDto });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: updateUserDto,
        select: expect.any(Object),
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateUserById(
          { email: 'test@test.com', name: 'John', surname: 'Doe' },
          1,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on unknown error', async () => {
      prismaService.user.findUnique.mockRejectedValue(
        new Error('Unexpected error'),
      );

      await expect(
        service.updateUserById(
          { email: 'test@test.com', name: 'John', surname: 'Doe' },
          1,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUserById', () => {
    it('should return user details successfully', async () => {
      const mockUser = {
        email: 'test@test.com',
        name: 'John',
        surname: 'Doe',
        role: 1,
      };
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserById(1);

      expect(result).toEqual({ success: true, data: { id: 1, ...mockUser } });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: expect.any(Object),
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'test@test.com',
          name: 'John',
          surname: 'Doe',
          role: 1,
        },
      ];
      prismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.getAllUsers({ role: 1 });

      expect(result).toEqual({ success: true, data: mockUsers });
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        where: { role: 1 },
        select: expect.any(Object),
      });
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user successfully', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.deleteUserById(1);

      expect(result).toEqual({ success: true });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.deleteUserById(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
