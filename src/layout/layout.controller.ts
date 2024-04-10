import { Controller, Get, Post, Body } from '@nestjs/common';
import { LayoutService } from './layout.service';
import { CreateLayoutDto } from './dto/create-layout.dto';
import { Public } from 'src/auth/auth.decorator';

@Controller('layout')
export class LayoutController {
  constructor(private readonly layoutService: LayoutService) {}

  @Post()
  create(@Body() createLayoutDto: CreateLayoutDto) {
    return this.layoutService.create(createLayoutDto);
  }
  @Public()
  @Get()
  getLayout() {
    return this.layoutService.getLayout();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.layoutService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLayoutDto: UpdateLayoutDto) {
  //   return this.layoutService.update(+id, updateLayoutDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.layoutService.remove(+id);
  // }
}
