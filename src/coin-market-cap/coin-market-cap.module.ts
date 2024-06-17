import { Module } from '@nestjs/common';
import { CoinMarketCapService } from './coin-market-cap.service';
import { CoinMarketCapController } from './coin-market-cap.controller';
import { PrismaService } from 'src/utils/prisma.service';

@Module({
  controllers: [CoinMarketCapController],
  providers: [CoinMarketCapService, PrismaService],
})
export class CoinMarketCapModule {}
