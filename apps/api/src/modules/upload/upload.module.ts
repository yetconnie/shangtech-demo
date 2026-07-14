import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UploadController } from './upload.controller';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '..', '..', '..', 'uploads'),
        filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
          const uniqueName = uuidv4() + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
      fileFilter: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
        const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
        const isDoc = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i;
        if (isImage.test(extname(file.originalname)) || isDoc.test(extname(file.originalname))) {
          cb(null, true);
        } else {
          cb(new Error('仅支持 jpg/png/gif/webp/svg/pdf/doc/docx/xls/xlsx/ppt/pptx 格式'), false);
        }
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  ],
  controllers: [UploadController],
})
export class UploadModule {}
