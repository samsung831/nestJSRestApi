import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    signup(dto: AuthDto) {
        return 'i am singed up';
    }
    
    signin() {
        return 'i am singed in';
    }
}