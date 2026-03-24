import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../../../database/database.service';
import { resources, resourceCategories } from '../../../database/schema';

@Injectable()
export class ResourcesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async listPublished() {
    return this.databaseService.db
      .select({
        id: resources.id,
        title: resources.title,
        summary: resources.summary,
        category: resourceCategories.name,
        // Using body as tag or something else for demo
      })
      .from(resources)
      .leftJoin(resourceCategories, eq(resources.categoryId, resourceCategories.id))
      .where(eq(resources.isPublished, true));
  }
}
