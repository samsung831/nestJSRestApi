import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';


describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    }));

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'nikolaj@gmail.com',
      password: '123'
    };
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
            .spec()
            .post('/auth/signup')
            .withBody({password: dto.password})
            .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
            .spec()
            .post('/auth/signup')
            .withBody({email: dto.email})
            .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
            .spec()
            .post('/auth/signup')
            .expectStatus(400);
      });
      it('should sign up', () => {
        return pactum
            .spec()
            .post('/auth/signup')
            .withBody(dto)
            .expectStatus(201);
      });
    });
    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
            .spec()
            .post('/auth/signin')
            .withBody({password: dto.password})
            .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
            .spec()
            .post('/auth/signin')
            .withBody({email: dto.email})
            .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
            .spec()
            .post('/auth/signin')
            .expectStatus(400);
      });
      it('should sign in', () => {
        return pactum
            .spec()
            .post('/auth/signin')
            .withBody(dto)
            .expectStatus(200)
            .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
            .spec()
            .get('/users/me')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}'
            })
            .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Niko',
          email: 'niko@niko.com'
        };
        return pactum
            .spec()
            .patch('/users/edit')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}'
            })
            .withBody(dto)
            .expectStatus(200)
            .expectBodyContains(dto.firstName)
            .expectBodyContains(dto.email);
      });    
    });
  });

  describe('Bookmakr', () => {
    describe('Create bookmark', () => {
      
    });
    describe('Get bookmakrs', () => {
      
    });
    describe('Get bookmark by id', () => {
      
    });
    describe('Edit bookmark by id', () => {
      
    });
    describe('Delete bookmark by id', () => {
      
    });
  });
});