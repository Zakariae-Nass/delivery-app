import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import * as fs from 'fs';
import { diskStorage, FileFilterCallback } from 'multer';
import * as path from 'path';
import { User } from '../users/entities/user.entity';

/**
 * Multer config that stores files under ./uploads/documents/{userId}/
 * Falls back to ./uploads/documents/tmp/ if user is not yet available.
 */
export const multerDocumentsStorageConfig = diskStorage({
  destination: (
    req: Request & { user?: User },
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    const userId = req.user?.id ?? 'tmp';
    const uploadPath = `./uploads/documents/${userId}`;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

export const multerDocumentsFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Only JPG, PNG, and PDF files are allowed'));
  }
};

export const multerDocumentsLimits = { fileSize: 5 * 1024 * 1024 };
