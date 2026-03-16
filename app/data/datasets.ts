export type DatasetAccessType = 'Public' | 'Private';

export type AudienceType =
  | 'Non-Profit'
  | 'Company'
  | 'Student'
  | 'Public'
  | 'Government'
  | 'Academic';

export interface Dataset {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  formats: string[];
  size: string;
  rows: string;
  columns: number;
  lastUpdated: string;
  license: string;
  downloads: number;
  apiCalls: number;
  version: string;
  tags: string[];
  sampleFields: { name: string; type: string; description: string }[];
  price: number | null; // null = free
  accessType: DatasetAccessType;
  author: string;
  rating: number;
  reviews: number;
  availableTo: AudienceType[];
}

export const datasets: Dataset[] = [
  {
    slug: 'global-patient-health-records',
    name: 'Global Patient Health Records',
    description:
      'Anonymized patient health records from 42 countries spanning primary care, emergency, and specialist visits.',
    longDescription:
      'This comprehensive dataset contains anonymized electronic health records collected from participating hospitals and clinics across 42 countries between 2015 and 2024. Each record includes demographic metadata, diagnostic codes mapped to ICD-11, prescribed treatments, lab results, and longitudinal follow-up outcomes. The data has been rigorously de-identified in compliance with HIPAA and GDPR standards and has undergone a multi-stage quality assurance pipeline to ensure consistency across disparate source systems. Researchers have used this dataset to train predictive models for early disease onset detection, hospital readmission risk scoring, and treatment efficacy analysis.',
    category: 'Health',
    formats: ['CSV', 'Parquet', 'JSON'],
    size: '4.7 GB',
    rows: '12,400,000',
    columns: 87,
    lastUpdated: '2025-12-10',
    license: 'CC BY-NC 4.0',
    downloads: 34_820,
    apiCalls: 1_274_500,
    version: '3.2.0',
    tags: [
      'healthcare',
      'EHR',
      'clinical',
      'ICD-11',
      'longitudinal',
      'anonymized',
    ],
    sampleFields: [
      {
        name: 'patient_id',
        type: 'string',
        description: 'Unique anonymized patient identifier',
      },
      {
        name: 'diagnosis_code',
        type: 'string',
        description: 'ICD-11 primary diagnosis code',
      },
      {
        name: 'admission_date',
        type: 'date',
        description: 'Date of hospital or clinic admission',
      },
      {
        name: 'treatment_plan',
        type: 'string',
        description: 'Coded treatment protocol assigned to the patient',
      },
      {
        name: 'lab_glucose_mg_dl',
        type: 'float',
        description: 'Fasting blood glucose level in mg/dL',
      },
      {
        name: 'outcome_30d',
        type: 'string',
        description:
          'Patient outcome 30 days after discharge (recovered, readmitted, deceased)',
      },
    ],
    price: 0,
    accessType: 'Public',
    author: 'Dr. Amina Osei',
    rating: 4.6,
    reviews: 128,
    availableTo: ['Non-Profit', 'Company', 'Student', 'Public', 'Academic'],
  },
  {
    slug: 'high-frequency-equity-trades',
    name: 'High-Frequency Equity Trades',
    description:
      'Tick-level trade and quote data for 3,000+ equities across NYSE, NASDAQ, and LSE from 2018 to 2024.',
    longDescription:
      'This financial dataset captures tick-by-tick trade executions and best-bid-offer quotes for over 3,000 equities listed on the New York Stock Exchange, NASDAQ, and London Stock Exchange. The data spans from January 2018 through December 2024 and is timestamped at microsecond resolution. It includes pre-market and after-hours sessions, order types, trade conditions, and exchange-specific flags. The dataset is widely used for backtesting algorithmic trading strategies, studying market microstructure, modeling volatility at intraday horizons, and training reinforcement learning agents for optimal execution.',
    category: 'Finance',
    formats: ['Parquet', 'CSV', 'HDF5'],
    size: '18.2 GB',
    rows: '2,340,000,000',
    columns: 24,
    lastUpdated: '2025-11-28',
    license: 'Commercial – Research Use',
    downloads: 11_450,
    apiCalls: 892_300,
    version: '2.1.0',
    tags: [
      'finance',
      'equities',
      'tick-data',
      'HFT',
      'market-microstructure',
      'time-series',
    ],
    sampleFields: [
      {
        name: 'ticker',
        type: 'string',
        description: 'Stock ticker symbol',
      },
      {
        name: 'timestamp_us',
        type: 'int64',
        description: 'Trade timestamp in microseconds since epoch',
      },
      {
        name: 'price',
        type: 'float64',
        description: 'Executed trade price in local currency',
      },
      {
        name: 'volume',
        type: 'int32',
        description: 'Number of shares in the executed trade',
      },
      {
        name: 'bid_price',
        type: 'float64',
        description: 'National best bid price at time of trade',
      },
      {
        name: 'exchange_code',
        type: 'string',
        description: 'Exchange where the trade was executed',
      },
    ],
    price: 150,
    accessType: 'Private',
    author: 'QuantData Labs',
    rating: 4.3,
    reviews: 47,
    availableTo: ['Company', 'Academic'],
  },
  {
    slug: 'era6-climate-reanalysis',
    name: 'ERA6 Climate Reanalysis',
    description:
      'Global gridded climate reanalysis data at 0.25° resolution covering temperature, precipitation, wind, and humidity from 1979 to 2024.',
    longDescription:
      'The ERA6 Climate Reanalysis dataset provides a spatially and temporally consistent record of global atmospheric, land-surface, and ocean-wave conditions from 1979 to 2024. Produced through advanced data assimilation techniques that combine observational records with numerical weather prediction models, the dataset is gridded at 0.25-degree horizontal resolution with 137 vertical pressure levels and hourly temporal granularity. Variables include 2-meter temperature, total precipitation, 10-meter wind components, specific humidity, soil moisture, and sea surface temperature. This dataset serves as a foundational resource for climate trend analysis, extreme weather event attribution, and training physics-informed neural networks for weather forecasting.',
    category: 'Climate',
    formats: ['NetCDF', 'GRIB2', 'Zarr'],
    size: '62.5 GB',
    rows: '8,500,000,000',
    columns: 42,
    lastUpdated: '2025-10-15',
    license: 'CC BY 4.0',
    downloads: 28_900,
    apiCalls: 2_150_000,
    version: '6.0.1',
    tags: [
      'climate',
      'reanalysis',
      'meteorology',
      'gridded',
      'atmosphere',
      'geospatial',
    ],
    sampleFields: [
      {
        name: 'latitude',
        type: 'float32',
        description: 'Latitude of grid cell center in decimal degrees',
      },
      {
        name: 'longitude',
        type: 'float32',
        description: 'Longitude of grid cell center in decimal degrees',
      },
      {
        name: 't2m',
        type: 'float32',
        description: '2-meter air temperature in Kelvin',
      },
      {
        name: 'tp',
        type: 'float32',
        description: 'Total precipitation in meters accumulated over the hour',
      },
      {
        name: 'u10',
        type: 'float32',
        description: '10-meter U-component of wind in m/s',
      },
    ],
    price: 0,
    accessType: 'Public',
    author: 'Climate Analytics Group',
    rating: 4.8,
    reviews: 203,
    availableTo: [
      'Non-Profit',
      'Company',
      'Student',
      'Public',
      'Government',
      'Academic',
    ],
  },
  {
    slug: 'multilingual-instruction-corpus',
    name: 'Multilingual Instruction Corpus',
    description:
      'A curated collection of 8.5 million instruction-response pairs across 27 languages for fine-tuning large language models.',
    longDescription:
      'The Multilingual Instruction Corpus is a large-scale dataset designed for supervised fine-tuning and reinforcement learning from human feedback of large language models. It contains 8.5 million instruction-response pairs spanning 27 languages, including low-resource languages such as Swahili, Bengali, and Tagalog. Each pair has been human-annotated for quality, safety, and factual accuracy using a three-reviewer consensus protocol. The dataset covers diverse task categories including summarization, question answering, creative writing, code generation, mathematical reasoning, and multi-turn dialogue. Metadata includes annotator agreement scores, language difficulty ratings, and task taxonomy labels.',
    category: 'NLP',
    formats: ['JSONL', 'Parquet', 'Arrow'],
    size: '7.8 GB',
    rows: '8,500,000',
    columns: 18,
    lastUpdated: '2025-12-01',
    license: 'Apache 2.0',
    downloads: 67_200,
    apiCalls: 3_400_000,
    version: '2.4.0',
    tags: [
      'NLP',
      'instruction-tuning',
      'multilingual',
      'RLHF',
      'LLM',
      'fine-tuning',
    ],
    sampleFields: [
      {
        name: 'instruction',
        type: 'string',
        description: 'The user instruction or prompt text',
      },
      {
        name: 'response',
        type: 'string',
        description: 'The reference response generated by human annotators',
      },
      {
        name: 'language',
        type: 'string',
        description: 'ISO 639-1 language code of the pair',
      },
      {
        name: 'task_category',
        type: 'string',
        description: 'Task taxonomy label (e.g., summarization, QA, code_gen)',
      },
      {
        name: 'quality_score',
        type: 'float32',
        description: 'Mean annotator quality rating on a 1-5 Likert scale',
      },
    ],
    price: 0,
    accessType: 'Public',
    author: 'LingualAI Research',
    rating: 4.5,
    reviews: 89,
    availableTo: ['Non-Profit', 'Company', 'Student', 'Public', 'Academic'],
  },
  {
    slug: 'urban-object-detection-benchmark',
    name: 'Urban Object Detection Benchmark',
    description:
      'High-resolution annotated images and LiDAR point clouds of urban street scenes for training perception models.',
    longDescription:
      'The Urban Object Detection Benchmark is a multimodal dataset designed for training and evaluating object detection, semantic segmentation, and 3D scene understanding models. It contains 1.2 million high-resolution RGB images paired with synchronized LiDAR point clouds captured across 85 cities on six continents under diverse weather and lighting conditions. Annotations include 2D bounding boxes, instance segmentation masks, 3D cuboids, and per-point semantic labels covering 34 object classes such as vehicles, pedestrians, cyclists, traffic signs, and road surfaces. The dataset follows a standardized train-validation-test split and includes benchmark leaderboards for mAP, mIoU, and 3D detection metrics.',
    category: 'Computer Vision',
    formats: ['COCO JSON', 'KITTI', 'PNG', 'PCD'],
    size: '148.0 GB',
    rows: '1,200,000',
    columns: 34,
    lastUpdated: '2025-09-22',
    license: 'CC BY-SA 4.0',
    downloads: 19_300,
    apiCalls: 640_000,
    version: '4.0.0',
    tags: [
      'computer-vision',
      'object-detection',
      'LiDAR',
      'segmentation',
      'autonomous-driving',
      '3D',
    ],
    sampleFields: [
      {
        name: 'image_id',
        type: 'string',
        description: 'Unique identifier for the captured image frame',
      },
      {
        name: 'bbox',
        type: 'array<float32>',
        description: '2D bounding box coordinates [x_min, y_min, x_max, y_max]',
      },
      {
        name: 'class_label',
        type: 'string',
        description: 'Object class label from the 34-class taxonomy',
      },
      {
        name: 'lidar_points',
        type: 'array<float32>',
        description:
          'Associated LiDAR point cloud in [x, y, z, intensity] format',
      },
      {
        name: 'weather_condition',
        type: 'string',
        description: 'Weather at capture time (clear, rain, fog, snow)',
      },
      {
        name: 'city',
        type: 'string',
        description: 'City where the scene was captured',
      },
    ],
    price: 75,
    accessType: 'Private',
    author: 'UrbanSense Consortium',
    rating: 4.4,
    reviews: 62,
    availableTo: ['Company', 'Academic', 'Government'],
  },
  {
    slug: 'smart-building-sensor-streams',
    name: 'Smart Building Sensor Streams',
    description:
      'Time-series telemetry from 15,000 IoT sensors deployed across 120 commercial buildings, covering HVAC, occupancy, and energy metrics.',
    longDescription:
      'This IoT dataset aggregates time-series telemetry from 15,000 sensors deployed across 120 commercial buildings in North America and Europe. Sensor modalities include temperature, humidity, CO2 concentration, occupancy counts from passive infrared detectors, HVAC system states, lighting levels, and sub-metered energy consumption at 15-second intervals. The data spans 18 months of continuous collection and includes building metadata such as floor area, construction year, HVAC system type, and climate zone. Researchers have used this dataset to develop predictive maintenance models, optimize energy consumption through reinforcement learning, and study occupancy-driven demand response strategies.',
    category: 'IoT',
    formats: ['Parquet', 'CSV', 'InfluxDB Line Protocol'],
    size: '23.1 GB',
    rows: '4,800,000,000',
    columns: 31,
    lastUpdated: '2025-11-05',
    license: 'ODC-By 1.0',
    downloads: 8_740,
    apiCalls: 512_000,
    version: '1.8.0',
    tags: [
      'IoT',
      'smart-buildings',
      'time-series',
      'energy',
      'HVAC',
      'sensor-data',
    ],
    sampleFields: [
      {
        name: 'sensor_id',
        type: 'string',
        description: 'Unique sensor identifier within the building network',
      },
      {
        name: 'timestamp',
        type: 'datetime',
        description: 'UTC timestamp of the sensor reading',
      },
      {
        name: 'temperature_c',
        type: 'float32',
        description: 'Ambient temperature reading in degrees Celsius',
      },
      {
        name: 'co2_ppm',
        type: 'int32',
        description: 'CO2 concentration in parts per million',
      },
      {
        name: 'energy_kwh',
        type: 'float32',
        description: 'Cumulative energy consumption in kilowatt-hours',
      },
      {
        name: 'occupancy_count',
        type: 'int32',
        description: 'Number of detected occupants in the sensor zone',
      },
    ],
    price: 50,
    accessType: 'Private',
    author: 'BuildingIQ Inc.',
    rating: 4.1,
    reviews: 34,
    availableTo: ['Company', 'Academic'],
  },
  {
    slug: 'global-census-demographics',
    name: 'Global Census Demographics',
    description:
      'Harmonized census microdata from 68 countries covering population structure, education, employment, and household composition.',
    longDescription:
      'The Global Census Demographics dataset harmonizes publicly available census microdata from 68 countries into a unified schema, enabling cross-national comparative research on population dynamics. Variables cover age, sex, marital status, educational attainment, employment status, occupation, income brackets, household size, housing type, and migration status. The harmonization methodology aligns disparate national classification systems to international standards including ISCED for education and ISCO for occupations. Temporal coverage varies by country but generally spans census rounds from 2000 to 2023. This dataset supports research in demography, labor economics, urban planning, and the training of generative models for synthetic population creation.',
    category: 'Demographics',
    formats: ['CSV', 'Parquet', 'Stata DTA'],
    size: '2.3 GB',
    rows: '54,000,000',
    columns: 62,
    lastUpdated: '2025-08-14',
    license: 'CC BY 4.0',
    downloads: 22_100,
    apiCalls: 780_000,
    version: '5.1.0',
    tags: [
      'demographics',
      'census',
      'population',
      'socioeconomic',
      'cross-national',
      'harmonized',
    ],
    sampleFields: [
      {
        name: 'person_weight',
        type: 'float64',
        description: 'Survey sampling weight for population-level estimation',
      },
      {
        name: 'age',
        type: 'int32',
        description: 'Age of the individual in completed years',
      },
      {
        name: 'education_isced',
        type: 'string',
        description: 'Highest education level attained mapped to ISCED 2011',
      },
      {
        name: 'employment_status',
        type: 'string',
        description:
          'Employment status (employed, unemployed, inactive, student)',
      },
      {
        name: 'country_iso3',
        type: 'string',
        description: 'ISO 3166-1 alpha-3 country code',
      },
    ],
    price: 0,
    accessType: 'Public',
    author: 'Global Demographics Initiative',
    rating: 4.7,
    reviews: 156,
    availableTo: [
      'Non-Profit',
      'Company',
      'Student',
      'Public',
      'Government',
      'Academic',
    ],
  },
  {
    slug: 'metropolitan-transit-flows',
    name: 'Metropolitan Transit Flows',
    description:
      'Origin-destination trip records and real-time vehicle positions for public transit systems in 35 major metropolitan areas.',
    longDescription:
      'This transportation dataset consolidates origin-destination trip records, real-time vehicle positions, and passenger count estimates for public transit systems across 35 major metropolitan areas worldwide. Data sources include automated fare collection systems, GPS-based automatic vehicle location feeds, and automated passenger counters. The dataset covers bus, metro, light rail, and ferry modes with records dating from 2019 to 2024. Each trip record includes boarding and alighting stops, timestamps, inferred transfer events, and fare type. The dataset is invaluable for transit demand modeling, service equity analysis, network optimization, and training graph neural networks on urban mobility patterns.',
    category: 'Transportation',
    formats: ['Parquet', 'GTFS', 'GeoJSON'],
    size: '9.6 GB',
    rows: '680,000,000',
    columns: 28,
    lastUpdated: '2025-11-18',
    license: 'ODbL 1.0',
    downloads: 14_600,
    apiCalls: 920_000,
    version: '3.0.2',
    tags: [
      'transportation',
      'transit',
      'mobility',
      'origin-destination',
      'GTFS',
      'urban',
    ],
    sampleFields: [
      {
        name: 'trip_id',
        type: 'string',
        description: 'Unique identifier for the passenger trip',
      },
      {
        name: 'boarding_stop_id',
        type: 'string',
        description: 'GTFS stop ID where the passenger boarded',
      },
      {
        name: 'alighting_stop_id',
        type: 'string',
        description: 'GTFS stop ID where the passenger alighted',
      },
      {
        name: 'departure_time',
        type: 'datetime',
        description: 'Scheduled departure time at the boarding stop',
      },
      {
        name: 'mode',
        type: 'string',
        description: 'Transit mode (bus, metro, light_rail, ferry)',
      },
    ],
    price: 25,
    accessType: 'Private',
    author: 'Dr. Sarah Kimani',
    rating: 4.2,
    reviews: 16,
    availableTo: ['Non-Profit', 'Company', 'Student', 'Public'],
  },
  {
    slug: 'precision-agriculture-yields',
    name: 'Precision Agriculture Yields',
    description:
      'Field-level crop yield measurements paired with satellite imagery, soil profiles, and weather histories for 200,000 farms globally.',
    longDescription:
      'The Precision Agriculture Yields dataset brings together field-level crop yield measurements from 200,000 farms across 45 countries with co-located remote sensing imagery, soil profile analyses, and daily weather histories. Yield records cover 18 major crop types including wheat, maize, rice, soybeans, and cotton, with data spanning the 2016 to 2024 growing seasons. Satellite imagery is sourced from Sentinel-2 and Landsat-8 at 10-meter and 30-meter resolution respectively, providing multispectral vegetation indices such as NDVI and EVI at biweekly intervals. Soil data includes texture classification, organic carbon content, pH, and nutrient concentrations. This dataset enables research in yield prediction, precision fertilization, climate adaptation strategies, and the development of foundation models for agricultural remote sensing.',
    category: 'Agriculture',
    formats: ['GeoTIFF', 'Parquet', 'CSV', 'NetCDF'],
    size: '34.8 GB',
    rows: '200,000',
    columns: 96,
    lastUpdated: '2025-10-30',
    license: 'CC BY 4.0',
    downloads: 12_350,
    apiCalls: 445_000,
    version: '2.0.0',
    tags: [
      'agriculture',
      'remote-sensing',
      'crop-yield',
      'satellite',
      'soil',
      'precision-farming',
    ],
    sampleFields: [
      {
        name: 'farm_id',
        type: 'string',
        description: 'Unique anonymized identifier for the farm plot',
      },
      {
        name: 'crop_type',
        type: 'string',
        description: 'Crop type grown during the season (e.g., wheat, maize)',
      },
      {
        name: 'yield_tonnes_ha',
        type: 'float32',
        description: 'Measured crop yield in metric tonnes per hectare',
      },
      {
        name: 'ndvi_mean',
        type: 'float32',
        description: 'Mean NDVI value over the growing season from Sentinel-2',
      },
      {
        name: 'soil_organic_carbon_pct',
        type: 'float32',
        description:
          'Soil organic carbon content as a percentage of dry weight',
      },
      {
        name: 'total_precipitation_mm',
        type: 'float32',
        description:
          'Cumulative precipitation over the growing season in millimeters',
      },
    ],
    price: 0,
    accessType: 'Public',
    author: 'AgriData Alliance',
    rating: 4.3,
    reviews: 71,
    availableTo: ['Non-Profit', 'Company', 'Student', 'Public', 'Academic'],
  },
];
