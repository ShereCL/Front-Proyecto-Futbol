import { Injectable } from '@angular/core';

export type AvatarStyle =
  | 'adventurer'
  | 'adventurer-neutral'
  | 'avataaars'
  | 'avataaars-neutral'
  | 'big-ears'
  | 'big-ears-neutral'
  | 'big-smile'
  | 'bottts'
  | 'bottts-neutral'
  | 'croodles'
  | 'croodles-neutral'
  | 'fun-emoji'
  | 'icons'
  | 'identicon'
  | 'initials'
  | 'lorelei'
  | 'lorelei-neutral'
  | 'micah'
  | 'miniavs'
  | 'open-peeps'
  | 'personas'
  | 'pixel-art'
  | 'pixel-art-neutral'
  | 'thumbs';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private readonly dicebearApiUrl = 'https://api.dicebear.com/7.x';

  generateAvatarUrl(
    seed: string,
    style: AvatarStyle = 'bottts',
    options?: {
      backgroundColor?: string[];
      size?: number;
      radius?: number;
      flip?: boolean;
      rotate?: number;
    },
  ): string {
    const params = new URLSearchParams();

    params.append('seed', encodeURIComponent(seed));

    if (options?.backgroundColor) {
      params.append('backgroundColor', options.backgroundColor.join(','));
    }

    if (options?.size) {
      params.append('size', options.size.toString());
    }

    if (options?.radius) {
      params.append('radius', options.radius.toString());
    }

    if (options?.flip) {
      params.append('flip', 'true');
    }

    if (options?.rotate) {
      params.append('rotate', options.rotate.toString());
    }

    return `${this.dicebearApiUrl}/${style}/svg?${params.toString()}`;
  }

  generateUserAvatar(username: string, email: string): string {
    const seed = username || email;
    return this.generateAvatarUrl(seed, 'bottts', {
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
    });
  }
  getUserAvatar(userId: string, style: AvatarStyle = 'bottts'): string {
    return this.generateAvatarUrl(userId, style);
  }

  generateRandomAvatars(
    count: number = 5,
    style: AvatarStyle = 'bottts',
  ): string[] {
    const avatars: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomSeed = Math.random().toString(36).substring(7);
      avatars.push(this.generateAvatarUrl(randomSeed, style));
    }
    return avatars;
  }

  async downloadAvatarAsBase64(avatarUrl: string): Promise<string> {
    try {
      const response = await fetch(avatarUrl);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error downloading avatar:', error);
      throw error;
    }
  }
}
