import { Module } from '@nestjs/common';
import { DirectoryService } from './directory.service';
import { DirectoryController } from './directory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Directory, DirectorySchema } from './entities/directory.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Directory.name,
        schema: DirectorySchema,
      },
    ]),
  ],
  controllers: [DirectoryController],
  providers: [DirectoryService],
  exports: [DirectoryService],
})
export class DirectoryModule {}
