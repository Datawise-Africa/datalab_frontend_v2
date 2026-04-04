export interface Dashboard {
  slug: string;
  title: string;
  description: string;
  platform: 'Power BI' | 'Tableau' | 'Looker Studio' | 'Metabase' | 'Custom';
  category: string;
  embedUrl: string;
  thumbnailColor: string;
  author: string;
  publishedDate: string;
  lastUpdated: string;
  views: number;
  tags: string[];
  isLive: boolean;
  /** Internal route path — if set, "View Dashboard" links here instead of embedUrl */
  internalRoute?: string;
}

export const dashboards: Dashboard[] = [
  {
    slug: 'afyaken',
    title: 'AfyaKen Health Dashboard',
    description:
      'Interactive health dashboard powered by Power BI, showcasing healthcare insights and epidemiological data across Kenyan counties. Includes vaccination coverage, disease surveillance, and facility metrics.',
    platform: 'Power BI',
    category: 'Health',
    embedUrl:
      'https://app.powerbi.com/view?r=eyJrIjoiZjBmZDFiMWEtZjEyOS00ODcwLThkNzMtNmJjMTQ1YjUzZmY5IiwidCI6IjRlYjE1NDIwLTNmOWItNDY1NS05MGM0LTZiNmMyYTdkMjFkOCJ9',
    thumbnailColor: 'bg-teal-500',
    author: 'Datalab Africa',
    publishedDate: 'March 01, 2024',
    lastUpdated: 'January 15, 2025',
    views: 15420,
    tags: ['health', 'Kenya', 'Power BI', 'epidemiology'],
    isLive: true,
    internalRoute: '/dashboards/afyaken',
  },
  {
    slug: 'eduken',
    title: 'EduKen Education Dashboard',
    description:
      'Custom interactive education dashboard with a Leaflet map of Kenya, county-level drill-downs for qualifications (CRAFT, DEGREE, DIPLOMA), institution types (Private/Public), and category breakdowns (College/University).',
    platform: 'Custom',
    category: 'Education',
    embedUrl: '',
    thumbnailColor: 'bg-primary',
    author: 'Datalab Africa',
    publishedDate: 'March 01, 2024',
    lastUpdated: 'January 15, 2025',
    views: 12300,
    tags: ['education', 'Kenya', 'map', 'counties', 'qualifications'],
    isLive: true,
    internalRoute: '/dashboards/eduken',
  },
  {
    slug: 'global-climate-trends-2025',
    title: 'Global Climate Trends 2025',
    description:
      'An interactive visualization of worldwide temperature anomalies, sea-level rise projections, and carbon emission trajectories. This dashboard aggregates satellite imagery data and ground-station readings from over 12,000 monitoring points. Updated monthly with the latest IPCC-aligned datasets.',
    platform: 'Power BI',
    category: 'Climate',
    embedUrl: 'https://app.powerbi.com/view?r=PLACEHOLDER_CLIMATE_2025',
    thumbnailColor: 'bg-primary',
    author: 'Dr. Amara Okonkwo',
    publishedDate: 'January 15, 2025',
    lastUpdated: 'January 30, 2025',
    views: 42370,
    tags: ['climate', 'temperature', 'emissions', 'IPCC', 'satellite'],
    isLive: true,
  },
  {
    slug: 'healthcare-outcomes-tracker',
    title: 'Healthcare Outcomes Tracker',
    description:
      'Tracks patient outcomes across 200+ hospitals in 15 countries, including readmission rates, treatment efficacy, and mortality benchmarks. The dashboard provides drill-down capabilities by region, specialty, and demographic cohort. Designed to support evidence-based policy decisions in public health.',
    platform: 'Tableau',
    category: 'Health',
    embedUrl: 'https://public.tableau.com/views/PLACEHOLDER_HEALTH_OUTCOMES',
    thumbnailColor: 'bg-teal-500',
    author: 'Dr. Priya Sharma',
    publishedDate: 'March 08, 2024',
    lastUpdated: 'January 22, 2025',
    views: 28915,
    tags: ['healthcare', 'patient outcomes', 'hospitals', 'public health'],
    isLive: true,
  },
  {
    slug: 'financial-markets-real-time',
    title: 'Financial Markets Real-Time',
    description:
      'A live-streaming dashboard covering equity indices, foreign exchange pairs, and commodity futures across major global exchanges. Includes volatility indicators, moving averages, and AI-generated sentiment scores derived from news feeds. Refreshes every 60 seconds during trading hours.',
    platform: 'Power BI',
    category: 'Finance',
    embedUrl: 'https://app.powerbi.com/view?r=PLACEHOLDER_FINANCE_RT',
    thumbnailColor: 'bg-blue-600',
    author: 'Marcus Chen',
    publishedDate: 'November 01, 2024',
    lastUpdated: 'February 04, 2025',
    views: 49120,
    tags: ['finance', 'real-time', 'equities', 'forex', 'sentiment'],
    isLive: true,
  },
  {
    slug: 'nlp-model-performance-benchmarks',
    title: 'NLP Model Performance Benchmarks',
    description:
      'Compares accuracy, latency, and resource consumption across leading NLP models on standardized benchmark suites including GLUE, SuperGLUE, and SQuAD. Interactive filters allow researchers to isolate performance by task type, model size, and training dataset. Contributed by the Open ML Benchmarking Consortium.',
    platform: 'Looker Studio',
    category: 'AI/ML',
    embedUrl: 'https://lookerstudio.google.com/reporting/PLACEHOLDER_NLP_BENCH',
    thumbnailColor: 'bg-emerald-500',
    author: 'Dr. Julian Reeves',
    publishedDate: 'June 20, 2024',
    lastUpdated: 'December 15, 2024',
    views: 18430,
    tags: ['NLP', 'benchmarks', 'machine learning', 'transformers'],
    isLive: true,
  },
  {
    slug: 'urban-transportation-flows',
    title: 'Urban Transportation Flows',
    description:
      'Maps real-time and historical transit ridership, bike-share usage, and vehicular traffic density for 30 metropolitan areas. Heatmaps and animated flow diagrams reveal peak congestion patterns and the impact of infrastructure changes. Data sourced from municipal open-data portals and GPS aggregators.',
    platform: 'Metabase',
    category: 'Transportation',
    embedUrl:
      'https://metabase.example.com/public/dashboard/PLACEHOLDER_TRANSPORT',
    thumbnailColor: 'bg-teal-600',
    author: 'Sarah Kim',
    publishedDate: 'September 12, 2024',
    lastUpdated: 'January 18, 2025',
    views: 12740,
    tags: ['transportation', 'urban planning', 'traffic', 'transit'],
    isLive: true,
  },
  {
    slug: 'agricultural-yield-forecasting',
    title: 'Agricultural Yield Forecasting',
    description:
      'Presents crop yield predictions for wheat, maize, rice, and soybean across key producing regions using ensemble machine-learning models. Incorporates soil moisture indices, precipitation forecasts, and historical harvest data spanning 40 years. Designed for agribusiness analysts and food-security researchers.',
    platform: 'Power BI',
    category: 'Agriculture',
    embedUrl: 'https://app.powerbi.com/view?r=PLACEHOLDER_AGRI_YIELD',
    thumbnailColor: 'bg-primary/50',
    author: 'Dr. Elena Vasquez',
    publishedDate: 'April 05, 2024',
    lastUpdated: 'November 28, 2024',
    views: 8650,
    tags: ['agriculture', 'forecasting', 'crop yield', 'food security', 'ML'],
    isLive: false,
  },
  {
    slug: 'iot-sensor-network-monitor',
    title: 'IoT Sensor Network Monitor',
    description:
      'Provides a centralized operational view of over 50,000 IoT sensors deployed across smart-city pilot programs in Europe and Southeast Asia. Tracks device health, data throughput, battery levels, and anomaly detection alerts in near real-time. Essential for network operations teams managing large-scale sensor deployments.',
    platform: 'Tableau',
    category: 'IoT',
    embedUrl: 'https://public.tableau.com/views/PLACEHOLDER_IOT_MONITOR',
    thumbnailColor: 'bg-emerald-600',
    author: 'Tomas Ferreira',
    publishedDate: 'July 22, 2024',
    lastUpdated: 'January 10, 2025',
    views: 6280,
    tags: ['IoT', 'sensors', 'smart city', 'monitoring'],
    isLive: true,
  },
  {
    slug: 'demographic-trends-explorer',
    title: 'Demographic Trends Explorer',
    description:
      'An interactive explorer of global population dynamics including birth rates, migration patterns, urbanization rates, and age-distribution shifts from 1960 to 2025. Users can compare up to five countries side-by-side with animated timelines. Built on UN Population Division and World Bank open datasets.',
    platform: 'Looker Studio',
    category: 'Demographics',
    embedUrl:
      'https://lookerstudio.google.com/reporting/PLACEHOLDER_DEMO_TRENDS',
    thumbnailColor: 'bg-blue-500',
    author: 'Prof. David Muller',
    publishedDate: 'February 14, 2024',
    lastUpdated: 'October 30, 2024',
    views: 21560,
    tags: ['demographics', 'population', 'migration', 'urbanization', 'UN'],
    isLive: false,
  },
];
