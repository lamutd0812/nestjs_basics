import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { JwtModule} from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: 'supersecretsecrettoken',
      signOptions: {
        expiresIn: 60 * 60
      }
    }),
  ],
  exports: [
    AuthService
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule { }
