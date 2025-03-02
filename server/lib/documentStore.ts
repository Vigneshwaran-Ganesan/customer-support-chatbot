export class DocumentStore {
  private docs: Map<string, Record<string, string>>;

  constructor() {
    this.docs = new Map();
    this.initializeDocs();
  }

  private initializeDocs() {
    // Basic documentation snippets for common CDP tasks
    this.docs.set('segment', {
      'source_setup': `To set up a new source in Segment:
1. Log in to your Segment workspace
2. Click on "Add Source" in the Sources section
3. Choose your source type from the catalog
4. Follow the source-specific setup instructions
5. Configure the settings and obtain your write key
For more details, visit: https://segment.com/docs/connections/sources/`,
      'basic_tracking': 'Implementation guide for basic event tracking...',
      'debugging': 'Steps for debugging tracking implementation...'
    });

    this.docs.set('mparticle', {
      'source_setup': 'Guide for setting up data sources in mParticle...',
      'user_profiles': 'Steps for managing user profiles...',
      'data_planning': 'Best practices for data planning...'
    });

    this.docs.set('lytics', {
      'audience_creation': 'Instructions for creating audiences...',
      'data_import': 'Steps for importing data...',
      'campaign_setup': 'Guide for setting up campaigns...'
    });

    this.docs.set('zeotap', {
      'integration': 'Steps for data integration...',
      'identity_resolution': 'Guide for identity resolution...',
      'segmentation': 'Instructions for customer segmentation...'
    });
  }

  public getDocContent(platform: string, topic?: string): string | undefined {
    const platformDocs = this.docs.get(platform.toLowerCase());
    if (!platformDocs) return undefined;

    if (topic) {
      return platformDocs[topic];
    }

    // Return all docs for the platform concatenated
    return Object.values(platformDocs).join('\n\n');
  }

  public findRelevantContent(question: string): {
    content: string;
    platform: string;
    confidence: number;
  } {
    // Simple keyword matching for now
    const keywords = question.toLowerCase().split(' ');
    const platforms = ['segment', 'mparticle', 'lytics', 'zeotap'];

    for (const platform of platforms) {
      if (keywords.includes(platform)) {
        const platformDocs = this.docs.get(platform);
        if (platformDocs) {
          // Basic topic matching
          if (keywords.includes('source') || keywords.includes('setup')) {
            return {
              content: platformDocs['source_setup'] || Object.values(platformDocs)[0],
              platform,
              confidence: 0.8
            };
          }

          // Return first available content as fallback
          return {
            content: Object.values(platformDocs)[0],
            platform,
            confidence: 0.6
          };
        }
      }
    }

    // Default fallback
    return {
      content: this.docs.get('segment')?.['source_setup'] || 'Please check the official documentation.',
      platform: 'multiple',
      confidence: 0.3
    };
  }
}

export const documentStore = new DocumentStore();