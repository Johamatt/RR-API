import { Module, Global } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Global()
@Module({
  providers: [
    {
      provide: OAuth2Client,
      useValue: new OAuth2Client(process.env.GOOGLE_CLIENT_ID),
    },
  ],
  exports: [OAuth2Client],
})
export class OAuthModule {}
