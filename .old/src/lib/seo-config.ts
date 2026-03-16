export type SeoMetadata = {
  siteName: string;
  defaultTitle: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
  baseUrl: string;
  twitterHandle: string;
  image: string;
  themeColor: string;
};

export const seoMetadata: SeoMetadata = {
  siteName: 'Datalab Africa',
  defaultTitle: 'Datalab Africa | Transparent African Data Collaboration',
  titleTemplate: '%s | Datalab Africa',
  description:
    'Datalab Africa is the trusted marketplace for African datasets, helping teams discover verified data, collaborate securely, and reward dataset creators.',
  keywords: [
    'datalab',
    'africa',
    'datasets',
    'data marketplace',
    'open data',
    'data collaboration',
    'data sharing',
    'data governance',
  ],
  baseUrl: 'https://datalabafrica.com',
  twitterHandle: '@datawise_AFR',
  image: 'https://datalabafrica.com/assets/Datawise.png',
  themeColor: '#020817',
};
