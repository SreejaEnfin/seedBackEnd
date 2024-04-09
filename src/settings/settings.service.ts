import { Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountSettings } from './entities/setting.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(AccountSettings)
    private Settings: Repository<AccountSettings>,
  ) {}
  async create(createSettingDto: CreateSettingDto) {
    const { AsKey, AsSettings, AsAccountId } = createSettingDto;
    const settings = new AccountSettings();

    settings.AsKey = AsKey;
    settings.AsSetting = AsSettings;
    settings.AsAccountId = AsAccountId;

    return await this.Settings.save(settings);
  }

  async findAll(): Promise<any> {
    const res = await this.Settings.find();
    console.log(res);
    return res;
  }

  findOne(id: number) {
    return `This action returns a #${id} setting`;
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return `This action updates a #${id} ${updateSettingDto}setting`;
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
}
