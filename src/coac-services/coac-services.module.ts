import { Module } from '@nestjs/common';
import { CoacServicesService } from './coac-services.service';

@Module({
  providers: [CoacServicesService],
  exports: [CoacServicesService],
})
export class CoacServicesModule {}
