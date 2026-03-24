import { Injectable } from '@nestjs/common';
import { PeerEducatorsRepository } from './repositories/peer-educators.repository';

@Injectable()
export class PeerEducatorsService {
  constructor(private readonly repo: PeerEducatorsRepository) {}

  async getPeerEducators() {
    const peers = await this.repo.listActive();
    return Promise.all(
        peers.map(async (p) => {
            const specs = await this.repo.getSpecializations(p.id);
            return {
                id: p.id,
                name: p.name || 'Anonymous Peer',
                focus: specs.map(s => s.tag),
                rating: (p.rating || 500) / 100, // Assuming divide by 100 if stored in int
                available: p.available
            };
        })
    );
  }
}
