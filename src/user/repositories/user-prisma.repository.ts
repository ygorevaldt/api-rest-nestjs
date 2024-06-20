import { Injectable } from '@nestjs/common';
import { IUserRepository } from './user.repository.interface';
import { PrismaService } from 'src/database/prisma.service';
import { User as UserEntity } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateUserDto): Promise<void> {
        await this.prisma.user.create({
            data: dto,
        });
    }

    async findUnique(params: {
        id?: number;
        email?: string;
    }): Promise<UserEntity | null> {
        const { id, email } = params;
        const register = await this.prisma.user.findUnique({
            where: {
                id,
                email,
            },
        });
        return this.fromDatabase(register);
    }

    async update(id: number, dto: UpdateUserDto): Promise<void> {
        await this.prisma.user.update({
            where: { id },
            data: dto,
        });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.user.delete({
            where: { id },
        });
    }

    private fromDatabase({
        id,
        email,
        password,
        name,
        phone,
    }: User): UserEntity {
        return new UserEntity(id, email, password, name, phone);
    }
}
