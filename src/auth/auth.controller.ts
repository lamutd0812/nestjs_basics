import {
    Body, Controller, Delete, Get,
    NotFoundException, Param, Post, Put, Req, UnauthorizedException, UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    // CRUD
    @Get('/users')
    async getUsers() {
        const users = await this.authService.getUsers();
        return users;
    }

    @UseGuards(JwtAuthGuard)
    @Get('/user/:userId')
    async getUser(
        @Req() req: Request,
        @Param('userId') userId: string
    ) {
        console.log(req.user);
        const user = await this.authService.getUser(userId);
        if (!user) {
            throw new NotFoundException('User not exists!');
        }
        return user;
    }

    @Post('/user')
    async registerUser(@Body() createUserDTO: CreateUserDTO) {
        const newUser = await this.authService.registerUser(createUserDTO);
        return {
            message: 'Register Successfully!',
            user: newUser
        };
    }

    @Put('user/:userId')
    async updateUser(@Param('userId') userId, @Body() createUserDTO: CreateUserDTO) {
        const updatedUser = await this.authService.updateUser(userId, createUserDTO);
        return {
            message: 'Updated User Information',
            user: updatedUser
        };
    }

    @Delete('user/:userId')
    async deleteUser(@Param('userId') userId) {
        const deletedUser = await this.authService.deleteUser(userId);
        return {
            message: 'Deleted User!',
            userId: deletedUser._id
        };
    }

    // Authentication
    @Post('/login')
    async userLogin(@Body() createUserDTO: CreateUserDTO) {
        const user = await this.authService.findUser(createUserDTO.username);
        if (!user || createUserDTO.password !== user.password) {
            throw new UnauthorizedException('User or Password Incorrect!');
        }
        return {
            message: 'Login Successfully!',
            token: this.authService.generateToken(user),
            userId: user._id
        };
    }
}
