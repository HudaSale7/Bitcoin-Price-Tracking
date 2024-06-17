import { Controller, Get, HttpException } from '@nestjs/common';
import { CoinMarketCapService } from './coin-market-cap.service';

@Controller('coin-market-cap')
export class CoinMarketCapController {
  constructor(private readonly coinMarketCapService: CoinMarketCapService) {}

  @Get()
  async getBitcoins() {
    try {
      const result = await this.coinMarketCapService.getBitCoins();
      return result;
    }
    catch (error) {
      throw new HttpException('server error', 500);
    }
  }
}


