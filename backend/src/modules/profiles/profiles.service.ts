import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfilesRepository } from './repositories/profiles.repository';

@Injectable()
export class ProfilesService {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  async getProfile(userId: string) {
    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const counts = await this.profilesRepository.getCounts(userId);

    return {
      id: profile.id,
      name: profile.fullName || 'Anonymous User',
      checkInsCount: counts.checkIns,
      sessionsCount: counts.sessions,
      resourcesCount: counts.resources,
      notificationsEnabled: (profile.preferences as any)?.notificationsEnabled ?? true,
      anonymousMode: profile.prefersAnonymity,
    };
  }

  async updateProfile(userId: string, data: any) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.fullName = data.name;
    if (data.anonymousMode !== undefined) updateData.prefersAnonymity = data.anonymousMode;
    
    // Update JSON preferences if needed
    const currentProfile = await this.profilesRepository.findByUserId(userId);
    const prefs = (currentProfile?.preferences as any) || {};
    if (data.notificationsEnabled !== undefined) {
        prefs.notificationsEnabled = data.notificationsEnabled;
        updateData.preferences = prefs;
    }

    await this.profilesRepository.update(userId, updateData);
    return this.getProfile(userId);
  }
}
