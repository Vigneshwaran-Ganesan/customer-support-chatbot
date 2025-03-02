export class DocumentStore {
  private docs: Map<string, string>;

  constructor() {
    this.docs = new Map();
    this.initializeDocs();
  }

  private initializeDocs() {
    // In a real implementation, this would fetch and index docs from the CDPs
    this.docs.set('segment', 'Segment documentation content');
    this.docs.set('mparticle', 'mParticle documentation content');
    this.docs.set('lytics', 'Lytics documentation content');
    this.docs.set('zeotap', 'Zeotap documentation content');
  }

  public getDocContent(platform: string): string | undefined {
    return this.docs.get(platform.toLowerCase());
  }
}

export const documentStore = new DocumentStore();
