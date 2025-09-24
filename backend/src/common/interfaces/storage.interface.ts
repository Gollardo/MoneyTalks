export interface UploadResult {
  filePath: string; // ключ/путь в хранилище (тот, что сохраняем в InvoiceFile.filePath)
  storageName: string; // реальное имя файла в хранилище (uuid + ext)
}

export interface IStorageService {
  // content - Buffer or stream, destinationKey - desired key/path (optional)
  upload(
    content: Buffer | NodeJS.ReadableStream,
    destinationKey?: string,
  ): Promise<UploadResult>;
  // returns Buffer or Readable (choose per implementation)
  download(filePath: string): Promise<Buffer | NodeJS.ReadableStream>;
  delete(filePath: string): Promise<void>;
}
