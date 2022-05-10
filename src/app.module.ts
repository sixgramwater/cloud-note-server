import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DirectoryModule } from './directory/directory.module';
import { FileModule } from './file/file.module';
import { EntryModule } from './entry/entry.module';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    NotesModule,
    UsersModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27017/cloud-note'),
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'upload'),
      serveStaticOptions: {
        index: false,
      }
      // rootPath: join(__dirname, '..', '..','react-cloud-note', 'build'),
    }),
    DirectoryModule,
    FileModule,
    EntryModule,
    UploadModule,    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
