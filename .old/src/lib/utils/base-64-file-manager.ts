export class Base64FileManager {
  // Convert FileList to Base64 data URLs
  static async convertFilesToBase64(files: FileList): Promise<string[]> {
    const base64Promises = Array.from(files).map((file) =>
      this.convertFileToBase64(file),
    );
    return Promise.all(base64Promises);
  }

  // Convert single File to Base64 data URL
  static async convertFileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () =>
        reject(new Error(`Failed to read file: ${file.name}`));
      reader.readAsDataURL(file);
    });
  }

  // Convert Base64 data URL to File
  static async convertBase64ToFile(
    base64: string,
    fileName: string,
  ): Promise<File> {
    try {
      const response = await fetch(base64);
      const blob = await response.blob();
      return new File([blob], fileName, { type: blob.type });
    } catch (error) {
      throw new Error(`Failed to convert Base64 to File: ${error}`);
    }
  }

  // Convert Base64 data URLs to FileList
  static async convertBase64FilesToFileList(
    base64Files: string[],
  ): Promise<FileList> {
    const files = await Promise.all(
      base64Files.map((base64, index) =>
        this.convertBase64ToFile(
          base64,
          `file-${index}.${this.getFileExtension(base64)}`,
        ),
      ),
    );
    return this.createFileList(files);
  }

  // Convert FileList to raw Base64 strings (without data URL prefix)
  static async convertFileListToBase64String(
    fileList: FileList,
  ): Promise<string[]> {
    const base64Files = await this.convertFilesToBase64(fileList);
    return base64Files.map((base64) => this.extractBase64String(base64));
  }

  // Convert raw Base64 string to File
  static async convertBase64StringToFile(
    base64: string,
    fileName: string,
    mimeType = 'application/octet-stream',
  ): Promise<File> {
    const dataUrl = `data:${mimeType};base64,${base64}`;
    return this.convertBase64ToFile(dataUrl, fileName);
  }

  // Convert raw Base64 strings to FileList
  static async convertBase64StringsToFileList(
    base64Strings: string[],
    mimeType?: string,
  ): Promise<FileList> {
    const files = await Promise.all(
      base64Strings.map((base64, index) =>
        this.convertBase64StringToFile(base64, `file-${index}.txt`, mimeType),
      ),
    );
    return this.createFileList(files);
  }

  // Helper to create FileList from Files
  private static createFileList(files: File[]): FileList {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  }

  // Helper to extract base64 string from data URL
  private static extractBase64String(dataUrl: string): string {
    return dataUrl.split(',')[1];
  }

  // Helper to guess file extension from base64 data URL
  private static getFileExtension(dataUrl: string): string {
    const mimeType = dataUrl.match(/^data:(.*?);/)?.[1];
    if (!mimeType) return 'txt';

    const extensionMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'application/pdf': 'pdf',
      'text/plain': 'txt',
      // Add more MIME type mappings as needed
    };

    return extensionMap[mimeType] || mimeType.split('/')[1] || 'txt';
  }
}
