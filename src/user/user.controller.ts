import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decoretor';
import { JwtGurad } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';


@UseGuards(JwtGurad)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){

    }
    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

    @Patch('edit')
    editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
        return this.userService.editUser(userId, dto);
    }
}
