import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WithdrawDto } from './dto/withdraw.dto';
import { WalletService } from './wallet.service';

interface JwtUser {
  userId: number;
  email: string;
  role: string;
}

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('me')
  getWallet(@GetUser() user: JwtUser) {
    return this.walletService.getWallet(user.userId);
  }

  @Get('transactions')
  getTransactions(@GetUser() user: JwtUser) {
    return this.walletService.getTransactions(user.userId);
  }

  @Post('deposit')
  deposit(@GetUser() user: JwtUser, @Body() body: { montant: number }) {
    return this.walletService.deposit(user.userId, body.montant);
  }

  @Post('withdraw')
  withdraw(@GetUser() user: JwtUser, @Body() dto: WithdrawDto) {
    return this.walletService.withdraw(user.userId, dto);
  }
}
