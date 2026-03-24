import { Injectable } from '@nestjs/common';
import { ResourcesRepository } from './repositories/resources.repository';

@Injectable()
export class ResourcesService {
  constructor(private readonly resourcesRepository: ResourcesRepository) {}

  async getResources() {
    const list = await this.resourcesRepository.listPublished();
    return list.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      category: item.category || 'Support',
      tag: 'Quick read', // Stubbed for demo match
    }));
  }
}
