/**
 * cloudinary.service.ts
 * 이미지 업로드 서비스. Multer로 받은 파일 버퍼를 스트림으로 변환해
 * Cloudinary의 shopping-mall/products 폴더에 업로드하고 URL을 반환한다.
 */
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  // 파일 버퍼를 Cloudinary에 업로드하고 URL을 반환
  uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      // Cloudinary의 upload_stream: 파일을 스트림으로 업로드
      // 디스크에 저장하지 않고 메모리(버퍼)에서 바로 Cloudinary로 전송
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'shopping-mall/products', // Cloudinary 내 저장 경로
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!);
        },
      );

      // Buffer → Readable Stream 변환 후 Cloudinary로 파이프
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
