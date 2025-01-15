import { inject, Injectable } from '@angular/core';
import { LocalFile } from '../interfaces/files';
import { Photo } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { Filesystem } from '@capacitor/filesystem';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor() {}

  private plt = inject(Platform);
  private httpClient = inject(HttpClient);

  private apiEndpoint = `${environment.apiBaseUrl}/file`;

  async convertFileToBlob(file: LocalFile) {
    const response = await fetch(file.data);
    return await response.blob();
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  async readAsBase64(photo: Photo) {
    if (this.plt.is('hybrid')) {
      if (!photo.path) {
        throw new Error('Photo path is undefined');
      }
      const file = await Filesystem.readFile({
        path: photo.path,
      });

      return file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      if (!photo.webPath) {
        throw new Error('Photo webPath is undefined');
      }
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  getFileFromServer(relativeUrl: string) {
    const url = `${this.apiEndpoint}${relativeUrl}`;
    return this.httpClient.get(url, { responseType: 'blob' });
  }
}
