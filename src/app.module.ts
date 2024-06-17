import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CoinMarketCapModule } from './coin-market-cap/coin-market-cap.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    CoinMarketCapModule,
  ],
})
export class AppModule {}
