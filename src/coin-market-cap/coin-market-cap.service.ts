import { HttpException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/utils/prisma.service';

@Injectable()
export class CoinMarketCapService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    try {
      let currentPrice = await this.getBitcoinCurrentPrice();
      let previousPrice = await this.getBitcoinPreviousPrice();
      let changeAmount = currentPrice - previousPrice;
      if (previousPrice === 0) previousPrice = 1;
      changeAmount = (changeAmount / previousPrice) * 100;

      await this.prisma.coinMarketCap.create({
        data: {
          currentPrice,
          changeAmount,
        },
      });
    } catch (error) {
      throw new HttpException('server error', 500); 
    }
  }

  private async getBitcoinCurrentPrice() {
    const data = await fetch(
      process.env.COIN_MARKET_CAP_API_URL +
        '/cryptocurrency/listings/latest?start=1&limit=1&convert=USD',
      {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API_KEY,
          Accept: 'application/json',
        },
      },
    );

    if (!data.ok) return 0;
    const response = await data.json();
    return response.data[0].quote.USD.price;
  }

  private async getBitcoinPreviousPrice() {
    const previousData = await this.prisma.coinMarketCap.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        currentPrice: true,
      },
    });
    if (!previousData) return 0;

    return previousData.currentPrice;
  }

  async getBitCoins() {
    const data = await this.prisma.coinMarketCap.findMany({
      take: 10,
    });

    return data.map((coin) => {
      return {
        currentPrice: coin.currentPrice.toFixed(2) + '$',
        changeAmount: coin.changeAmount.toFixed(2) + '%',
        createdAt: coin.createdAt,
      };
    });
  }
}
