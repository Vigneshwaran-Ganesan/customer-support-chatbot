export class DocumentStore {
  private docs: Map<string, Record<string, string>>;

  constructor() {
    this.docs = new Map();
    this.initializeDocs();
  }

  private initializeDocs() {
    // Segment documentation
    this.docs.set('segment', {
      'source_setup': `To set up a new source in Segment:
1. Log in to your Segment workspace
2. Click on "Add Source" in the Sources section
3. Choose your source type from the catalog
4. Follow the source-specific setup instructions
5. Configure the settings and obtain your write key
For more details, visit: https://segment.com/docs/connections/sources/`,
      'user_profiles': `To create a user profile in Segment:
1. Implement identify() calls in your code
2. Include relevant user traits
3. Use userId or anonymousId
4. Verify in the Segment debugger
For details: https://segment.com/docs/connections/spec/identify/`,
      'tracking': `To implement event tracking in Segment:
1. Initialize the analytics object
2. Call track() with event name and properties
3. Verify events in the debugger
4. Set up destinations as needed
Learn more: https://segment.com/docs/connections/spec/track/`
    });

    // mParticle documentation
    this.docs.set('mparticle', {
      'source_setup': `To set up a data source in mParticle:
1. Navigate to Setup > Inputs
2. Select the platform (Web, iOS, Android, etc.)
3. Configure your input settings
4. Get your API credentials
5. Implement the SDK
Details at: https://docs.mparticle.com/developers/sdk/`,
      'user_profiles': `To manage user profiles in mParticle:
1. Use Identity API calls
2. Set user attributes
3. Configure identity strategy
4. Monitor identity dashboard
Learn more: https://docs.mparticle.com/guides/idsync/`,
      'audience_building': `To create audiences in mParticle:
1. Go to Audience Builder
2. Define audience criteria
3. Set update frequency
4. Choose output platforms
Visit: https://docs.mparticle.com/guides/audiences/`
    });

    // Lytics documentation
    this.docs.set('lytics', {
      'data_import': `To import data into Lytics:
1. Access Data Sources section
2. Choose import method (API, S3, etc.)
3. Configure connection settings
4. Map data fields
5. Schedule imports
Details: https://docs.lytics.com/product/import/`,
      'audience_creation': `To build an audience segment in Lytics:
1. Navigate to Audiences
2. Click "Create New Audience"
3. Define segment criteria
4. Set behavioral rules
5. Save and activate
Guide: https://docs.lytics.com/product/segments/`,
      'campaign_setup': `To set up a campaign in Lytics:
1. Go to Campaigns section
2. Select campaign type
3. Choose audience
4. Configure content
5. Set activation rules
More at: https://docs.lytics.com/product/campaigns/`
    });

    // Zeotap documentation
    this.docs.set('zeotap', {
      'integration': `To integrate data with Zeotap:
1. Access Data Onboarding
2. Select integration type
3. Configure data source
4. Map identifiers
5. Schedule syncs
Details: https://docs.zeotap.com/docs/data-onboarding`,
      'identity_resolution': `To set up identity resolution in Zeotap:
1. Configure identity spaces
2. Set matching rules
3. Define priority order
4. Enable cross-device mapping
Guide: https://docs.zeotap.com/docs/identity-resolution`,
      'segmentation': `To create customer segments in Zeotap:
1. Navigate to Segments
2. Define segment criteria
3. Set audience rules
4. Configure activation
5. Monitor performance
Learn at: https://docs.zeotap.com/docs/segmentation`
    });
  }

  public compareCDPs(feature: string): {
    content: string;
    platform: string;
    confidence: number;
  } {
    const comparisonMap = {
      'source': {
        title: 'Data Source Setup',
        aspects: ['Implementation', 'Configuration', 'Verification']
      },
      'user': {
        title: 'User Profile Management',
        aspects: ['Identity Resolution', 'Attribute Management', 'Profile Merging']
      },
      'audience': {
        title: 'Audience Segmentation',
        aspects: ['Segment Creation', 'Rules Engine', 'Activation']
      },
      'tracking': {
        title: 'Event Tracking',
        aspects: ['Implementation', 'Data Quality', 'Debugging']
      }
    };

    const comparison = comparisonMap[feature];
    if (!comparison) {
      return {
        content: this.getGenericResponse(),
        platform: 'multiple',
        confidence: 0.3
      };
    }

    let content = `# ${comparison.title} Comparison\n\n`;
    const platforms = ['segment', 'mparticle', 'lytics', 'zeotap'];

    for (const platform of platforms) {
      const docs = this.docs.get(platform);
      if (docs) {
        content += `## ${platform.charAt(0).toUpperCase() + platform.slice(1)}\n`;
        content += `${docs[feature + '_setup'] || docs[feature] || 'Documentation not available'}\n\n`;
      }
    }

    content += "\nKey Differences:\n";
    for (const aspect of comparison.aspects) {
      content += `\n### ${aspect}\n`;
      content += this.getAspectComparison(platforms, feature, aspect);
    }

    return {
      content,
      platform: 'multiple',
      confidence: 0.85
    };
  }

  private getAspectComparison(platforms: string[], feature: string, aspect: string): string {
    return platforms
      .map(p => `- ${p.charAt(0).toUpperCase() + p.slice(1)}: ${this.getFeatureHighlight(p, feature, aspect)}`)
      .join('\n');
  }

  private getFeatureHighlight(platform: string, feature: string, aspect: string): string {
    const highlights = {
      'segment': {
        'source': {
          'Implementation': 'Quick setup with pre-built integrations',
          'Configuration': 'Web-based UI with minimal coding',
          'Verification': 'Real-time debugger'
        },
        'user': {
          'Identity Resolution': 'Basic identity resolution',
          'Attribute Management': 'Flexible trait management',
          'Profile Merging': 'Automatic profile merging'
        }
      },
      'mparticle': {
        'source': {
          'Implementation': 'SDK-based implementation',
          'Configuration': 'Advanced data planning',
          'Verification': 'Data quality dashboard'
        },
        'user': {
          'Identity Resolution': 'Advanced cross-device matching',
          'Attribute Management': 'Structured data schemas',
          'Profile Merging': 'Rule-based profile unification'
        }
      }
      // Add similar highlights for other platforms
    };

    return highlights[platform]?.[feature]?.[aspect] || 'Standard functionality available';
  }

  public getDocContent(platform: string, topic?: string): string | undefined {
    const platformDocs = this.docs.get(platform.toLowerCase());
    if (!platformDocs) return undefined;

    if (topic) {
      return platformDocs[topic];
    }

    return Object.values(platformDocs).join('\n\n');
  }

  public findRelevantContent(question: string): {
    content: string;
    platform: string;
    confidence: number;
  } {
    const q = question.toLowerCase();
    const platforms = ['segment', 'mparticle', 'lytics', 'zeotap'];

    let platform = platforms.find(p => q.includes(p)) || 'multiple';

    const topics = {
      'source': ['source', 'setup', 'implement', 'configure', 'integration'],
      'user': ['user', 'profile', 'identity', 'customer'],
      'audience': ['audience', 'segment', 'targeting'],
      'tracking': ['track', 'event', 'data', 'collect'],
      'campaign': ['campaign', 'activation', 'engage']
    };

    let bestTopic = '';
    let maxMatches = 0;

    for (const [topic, keywords] of Object.entries(topics)) {
      const matches = keywords.filter(k => q.includes(k)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestTopic = topic;
      }
    }

    const platformDocs = this.docs.get(platform);
    if (!platformDocs) {
      return {
        content: this.getGenericResponse(),
        platform: 'multiple',
        confidence: 0.3
      };
    }

    let content = '';
    let confidence = 0.5;

    if (bestTopic === 'source') {
      content = platformDocs['source_setup'];
      confidence = 0.9;
    } else if (bestTopic === 'user') {
      content = platformDocs['user_profiles'] || platformDocs['identity_resolution'];
      confidence = 0.85;
    } else if (bestTopic === 'audience') {
      content = platformDocs['audience_creation'] || platformDocs['segmentation'];
      confidence = 0.85;
    } else if (bestTopic === 'tracking') {
      content = platformDocs['tracking'] || platformDocs['data_import'];
      confidence = 0.8;
    } else if (bestTopic === 'campaign') {
      content = platformDocs['campaign_setup'];
      confidence = 0.8;
    }

    if (!content) {
      content = Object.values(platformDocs)[0];
      confidence = 0.6;
    }

    return {
      content,
      platform,
      confidence
    };
  }

  private getGenericResponse(): string {
    return `To help you better, please specify:
1. Which CDP you're working with (Segment, mParticle, Lytics, or Zeotap)
2. What specific task you're trying to accomplish

You can find general documentation here:
- Segment: https://segment.com/docs/
- mParticle: https://docs.mparticle.com/
- Lytics: https://docs.lytics.com/
- Zeotap: https://docs.zeotap.com/`;
  }
}

export const documentStore = new DocumentStore();