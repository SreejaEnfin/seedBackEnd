import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountSettings } from './entities/setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountSettings])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
