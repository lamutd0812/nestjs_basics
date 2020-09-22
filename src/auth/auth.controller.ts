import {
    Body, Controller, Delete, Get, HttpStatus,
    NotFoundException, Param, Post, Put, Req, Res, UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    // CRUD
    @Get('/users')
    async getUsers(@Res() res) {
        const users = await this.authService.getUsers();
        return res.status(HttpStatus.OK).json(users);
    }

    @Get('/user/:userId')
    async getUser(
        @Req() req: Request,
        @Res() res,
        @Param('userId') userId
    ) {
        const user = await this.authService.getUser(userId);
        if (!user) {
            throw new NotFoundException('User not exists!');
        }
        return res.status(HttpStatus.OK).json(user);
    }

    @Post('/user')
    async registerUser(@Res() res, @Body() createUserDTO: CreateUserDTO) {
        const newUser = await this.authService.registerUser(createUserDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Register Successfully!',
            user: newUser
        });
    }

    @Put('user/:userId')
    async updateUser(@Res() res, @Param('userId') userId, @Body() createUserDTO: CreateUserDTO) {
        const updatedUser = await this.authService.updateUser(userId, createUserDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Updated User Information',
            user: updatedUser
        });
    }

    @Delete('user/:userId')
    async deleteUser(@Res() res, @Param('userId') userId) {
        const deletedUser = await this.authService.deleteUser(userId);
        return res.status(HttpStatus.OK).json({
            message: 'Deleted User!',
            userId: deletedUser._id
        });
    }

    // Authentication
    @Post('/login')
    async userLogin(@Body() createUserDTO: CreateUserDTO) {
        const user = await this.authService.findUser(createUserDTO.username);
        if(!user || createUserDTO.password !== user.password) {
            throw new UnauthorizedException('User or Password Incorrect!');
        }
        return {
            message: 'Login Successfully!',
            token: this.authService.generateToken(user),
            user
        };
    }
}
