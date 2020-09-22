import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDTO } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
        private jwtService: JwtService) { }

    // CRUD
    async getUsers(): Promise<User[]> {
        const users = await this.userModel.find().exec();
        return users;
    }

    async getUser(userId): Promise<User> {
        const user = await this.userModel.findById(userId).exec();
        return user;
    }

    async registerUser(createUserDTO: CreateUserDTO): Promise<User> {
        const newUser = await new this.userModel(createUserDTO);
        return newUser.save();
    }

    async updateUser(userId, createUserDTO: CreateUserDTO): Promise<User> {
        const updatedUser = await this.userModel
            .findByIdAndUpdate(userId, createUserDTO, { new: true });
        return updatedUser;
    }

    async deleteUser(userId): Promise<User> {
        const deletedPost = await this.userModel.findByIdAndDelete(userId);
        return deletedPost;
    }

    // Authentication
    async findUser(username: string): Promise<User> {
        const user = await this.userModel.findOne({ username });
        return user;
    }

    generateToken(user: User) {
        const token = this.jwtService.sign({
            username: user.username,
            userId: user._id
        });
        // console.log(token);
        return token;
    }
}

