import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGurad } from 'src/auth/guard';


@Controller('users')
export class UserController {
    @UseGuards(JwtGurad)
    @Get('me')
    getMe(@Req() req: Request) {
        return req.user;
    }
}
