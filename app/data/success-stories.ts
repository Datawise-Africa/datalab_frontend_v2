export interface SuccessStory {
  slug: string;
  company: string;
  title: string;
  industry: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  quote: string;
  quotePerson: string;
  quoteRole: string;
  datasetsUsed: string[];
}

export const successStories: SuccessStory[] = [
  {
    slug: 'meridian-health-early-sepsis-detection',
    company: 'Meridian Health Systems',
    title: 'Reducing Sepsis Mortality with Predictive Early Warning Models',
    industry: 'Healthcare',
    summary:
      "Meridian Health Systems deployed a real-time sepsis risk prediction model trained on Data Lab's Global Patient Health Records dataset, enabling clinicians to intervene an average of 4.2 hours earlier and reducing in-hospital sepsis mortality by 23%.",
    challenge:
      "Sepsis remains one of the leading causes of in-hospital mortality, and early detection is notoriously difficult because initial symptoms overlap with many benign conditions. Meridian's legacy clinical decision support system relied on static SIRS criteria, which produced excessive false alarms and missed atypical presentations. The clinical informatics team needed a large, diverse training corpus of longitudinal patient records with confirmed sepsis outcomes to build a more sensitive and specific predictive model, but assembling such a dataset from their own electronic health records alone would have taken years of curation and regulatory approvals.",
    solution:
      "Meridian's data science team used Data Lab's Global Patient Health Records dataset to pre-train a temporal convolutional network on 12.4 million anonymized patient trajectories spanning 42 countries. The model was then fine-tuned on Meridian's internal data using federated learning techniques to preserve patient privacy. The resulting model ingests real-time vitals, lab orders, and nursing notes from the EHR and outputs a sepsis probability score every 15 minutes for each admitted patient. Scores above a validated threshold trigger an automated alert to the rapid response team with an explanation of the contributing risk factors.",
    results: [
      '23% reduction in in-hospital sepsis mortality within the first 12 months of deployment',
      'Average early intervention time improved from 1.8 hours to 6.0 hours before onset of organ dysfunction',
      'False alert rate reduced by 41% compared to the legacy SIRS-based system',
      'Model deployed across 14 hospitals serving 2.3 million patients annually',
    ],
    quote:
      "Data Lab's dataset gave us the statistical power we could never achieve with our own records alone. The diversity of clinical presentations across 42 countries made our model robust to the demographic variation we see in our patient population every day.",
    quotePerson: 'Dr. Rachel Nguyen',
    quoteRole: 'Chief Medical Informatics Officer, Meridian Health Systems',
    datasetsUsed: ['global-patient-health-records'],
  },
  {
    slug: 'quantedge-volatility-forecasting',
    company: 'QuantEdge Capital',
    title:
      'Achieving Superior Risk-Adjusted Returns Through Microsecond Volatility Forecasting',
    industry: 'Fintech',
    summary:
      "QuantEdge Capital built a transformer-based volatility forecasting model using Data Lab's High-Frequency Equity Trades dataset, improving their Sharpe ratio by 0.34 and reducing maximum drawdown by 18% across their systematic equity strategies.",
    challenge:
      "QuantEdge Capital operates systematic equity strategies that rely on accurate intraday volatility forecasts for dynamic position sizing and risk management. Their existing GARCH-family models were calibrated on daily data and failed to capture the rapid regime shifts observable at the microstructure level. Acquiring clean, exchange-normalized tick data across multiple venues was prohibitively expensive through traditional market data vendors, and the engineering burden of parsing, deduplicating, and aligning raw exchange feeds consumed over 40% of their quantitative research team's capacity.",
    solution:
      "QuantEdge replaced their internal data pipeline with Data Lab's pre-harmonized High-Frequency Equity Trades dataset, which provided microsecond-resolution trade and quote data already normalized across NYSE, NASDAQ, and LSE. Their research team trained a temporal fusion transformer on realized volatility signatures computed from the tick data, conditioning on order flow imbalance, trade arrival rates, and spread dynamics. The model generates one-minute-ahead volatility forecasts that feed directly into the portfolio optimizer's risk budget allocation module.",
    results: [
      'Sharpe ratio improved by 0.34 across the flagship equity market-neutral strategy',
      'Maximum drawdown reduced by 18% during the Q3 2024 volatility spike',
      'Research team reclaimed 40% of engineering time previously spent on data wrangling',
      'Model inference latency of 2.1 milliseconds enables real-time integration with execution systems',
    ],
    quote:
      "The quality of Data Lab's tick data is indistinguishable from what we were getting from tier-one market data vendors at a fraction of the cost. More importantly, the data is research-ready — no deduplication headaches, no timestamp alignment issues, just clean data.",
    quotePerson: 'James Whitfield',
    quoteRole: 'Head of Quantitative Research, QuantEdge Capital',
    datasetsUsed: ['high-frequency-equity-trades'],
  },
  {
    slug: 'terraverde-wildfire-prediction',
    company: 'TerraVerde Analytics',
    title: 'Building a Continental-Scale Wildfire Risk Prediction System',
    industry: 'Climate Tech',
    summary:
      "TerraVerde Analytics combined Data Lab's ERA6 Climate Reanalysis and Precision Agriculture Yields datasets to develop a wildfire risk prediction platform that provides 72-hour advance warnings with 89% accuracy across North America and Southern Europe.",
    challenge:
      "Wildfire risk prediction requires integrating atmospheric conditions, vegetation state, soil moisture, and topographic features at high spatial and temporal resolution. TerraVerde's previous system relied on coarse-resolution weather forecasts and static fuel maps, limiting prediction accuracy to 67% at the 72-hour horizon. The team needed dense, consistent historical climate data to train their deep learning models and real-time vegetation condition indicators to capture the dynamic drying of fuel loads, but assembling these heterogeneous data sources from disparate government agencies involved months of reformatting and gap-filling.",
    solution:
      "TerraVerde leveraged Data Lab's ERA6 Climate Reanalysis dataset for hourly atmospheric variables at 0.25-degree resolution and augmented it with vegetation health indices from the Precision Agriculture Yields dataset's Sentinel-2 satellite imagery. Their team trained a spatio-temporal graph neural network that models fire weather dynamics on a hexagonal grid, with edges encoding terrain connectivity and wind-driven fire spread potential. The model outputs pixel-level ignition probability and fire spread rate forecasts updated every six hours.",
    results: [
      '72-hour wildfire prediction accuracy improved from 67% to 89%',
      'System deployed operationally across 12 US states and 4 Southern European countries',
      'Average evacuation lead time increased by 31 hours for communities in predicted fire paths',
      'Platform processes 2.4 TB of climate and satellite data daily in near-real-time',
    ],
    quote:
      "Combining Data Lab's climate reanalysis with their satellite-derived vegetation indices gave us a unified picture of fire weather that would have taken us two years to assemble independently. The data quality is exceptional — we found fewer gaps in a decade of ERA6 data than in a single year of our previous sources.",
    quotePerson: 'Dr. Sofia Antoniou',
    quoteRole: 'Co-Founder & Chief Science Officer, TerraVerde Analytics',
    datasetsUsed: ['era6-climate-reanalysis', 'precision-agriculture-yields'],
  },
  {
    slug: 'novaretail-demand-forecasting',
    company: 'NovaRetail Group',
    title:
      'Transforming Inventory Management with Demographic-Aware Demand Forecasting',
    industry: 'Retail',
    summary:
      "NovaRetail Group integrated Data Lab's Global Census Demographics dataset into their demand forecasting pipeline, reducing overstock waste by 28% and improving product availability scores by 15% across 2,200 stores in 14 countries.",
    challenge:
      'NovaRetail operates 2,200 retail locations across 14 countries with vastly different consumer demographics, purchasing patterns, and seasonal behaviors. Their centralized demand forecasting model treated all markets with the same feature set, leading to systematic overstock in some regions and stockouts in others. The merchandising analytics team recognized that incorporating local demographic context — population age structure, income distribution, household composition — could dramatically improve forecast accuracy, but sourcing harmonized demographic data across all their operating countries proved to be a significant barrier.',
    solution:
      "NovaRetail enriched their store-level demand features with demographic variables from Data Lab's Global Census Demographics dataset, mapping each store's catchment area to census tract-level indicators including median age, household size distribution, educational attainment mix, and income deciles. These features were fed into a hierarchical Bayesian forecasting model that learns country-specific and store-cluster-specific demand patterns. The model also incorporates temporal demographic shifts to capture migration-driven changes in local consumer profiles over time.",
    results: [
      '28% reduction in overstock waste, translating to $47M in annual savings',
      'Product availability score improved from 91.2% to 96.8% across all markets',
      'Forecast accuracy (weighted MAPE) improved by 19% at the store-SKU-week level',
      'Demographic features ranked among the top 5 most important predictors in 11 of 14 countries',
    ],
    quote:
      'We always knew demographics mattered for demand forecasting, but harmonizing census data across 14 countries with different classification systems seemed impossible. Data Lab solved that problem for us with a single download. The impact on our bottom line was immediate and substantial.',
    quotePerson: 'Henrik Johansson',
    quoteRole: 'VP of Merchandising Analytics, NovaRetail Group',
    datasetsUsed: ['global-census-demographics'],
  },
  {
    slug: 'autonomix-perception-breakthrough',
    company: 'Autonomix',
    title:
      'Achieving State-of-the-Art 3D Perception for Level 4 Autonomous Vehicles',
    industry: 'Autonomous Vehicles',
    summary:
      "Autonomix used Data Lab's Urban Object Detection Benchmark to pre-train their multi-sensor perception stack, achieving a 12% improvement in 3D detection mAP and enabling safe deployment in 6 new metropolitan areas without city-specific data collection campaigns.",
    challenge:
      'Autonomix is developing Level 4 autonomous vehicles for urban ride-hailing operations. Expanding to new cities traditionally required months of local data collection, annotation, and model retraining to handle city-specific road geometries, traffic patterns, and object appearances. Each new city launch cost approximately $2.8M in data operations alone. The perception engineering team needed a diverse, globally representative training set that would allow their models to generalize across urban environments without extensive per-city fine-tuning.',
    solution:
      "Autonomix adopted Data Lab's Urban Object Detection Benchmark as the primary pre-training dataset for their 3D perception stack. The benchmark's coverage of 85 cities across six continents under diverse weather conditions provided the visual and geometric diversity needed for robust generalization. The team implemented a domain randomization strategy during pre-training, leveraging the dataset's weather condition and city metadata to create balanced training batches. The pre-trained backbone was then lightly fine-tuned on a small sample of city-specific data for each new deployment, reducing the per-city data requirement by 85%.",
    results: [
      '3D detection mAP improved by 12% on their internal evaluation benchmark',
      'Per-city launch data collection cost reduced from $2.8M to $420K (85% reduction)',
      'Successfully deployed in 6 new metropolitan areas within a single quarter',
      'Pedestrian detection recall in adverse weather improved by 34%',
    ],
    quote:
      "The geographic and environmental diversity in Data Lab's benchmark dataset is unmatched. Our models trained on this data generalize to new cities with minimal fine-tuning, fundamentally changing the economics of our expansion strategy.",
    quotePerson: 'Dr. Kai Nakamura',
    quoteRole: 'VP of Perception Engineering, Autonomix',
    datasetsUsed: ['urban-object-detection-benchmark'],
  },
  {
    slug: 'agrisync-precision-fertilization',
    company: 'AgriSync Technologies',
    title:
      'Optimizing Fertilizer Application to Boost Yields and Reduce Environmental Impact',
    industry: 'AgriTech',
    summary:
      "AgriSync Technologies built a variable-rate fertilization recommendation engine using Data Lab's Precision Agriculture Yields dataset, increasing average crop yields by 11% while reducing nitrogen fertilizer usage by 22% across 8,000 farms in Sub-Saharan Africa and South Asia.",
    challenge:
      'Smallholder farmers in Sub-Saharan Africa and South Asia face a dual challenge: improving crop yields to support food security while minimizing environmental damage from excessive fertilizer application. Blanket fertilizer recommendations ignore spatial variability in soil conditions and crop response, leading to both under-fertilization in nutrient-poor zones and over-fertilization in areas with adequate soil fertility. AgriSync needed field-level data linking soil profiles, satellite vegetation indices, weather patterns, and actual yield outcomes to build spatially-explicit fertilization models, but collecting this data across their target geographies was logistically and financially prohibitive.',
    solution:
      "AgriSync used Data Lab's Precision Agriculture Yields dataset to train a gradient-boosted ensemble model that predicts yield response curves as a function of soil organic carbon, pH, existing nutrient levels, cumulative precipitation, growing degree days, and NDVI trajectories. The model outputs field-zone-level nitrogen, phosphorus, and potassium application rates that maximize expected yield subject to a per-hectare fertilizer budget constraint. Recommendations are delivered to farmers via a mobile application that integrates with local input suppliers for just-in-time fertilizer procurement.",
    results: [
      'Average crop yield increased by 11% across 8,000 participating farms',
      'Nitrogen fertilizer usage reduced by 22%, preventing an estimated 14,000 tonnes of N2O-equivalent emissions',
      'Return on fertilizer investment improved by 38% for participating smallholder farmers',
      'Platform expanded from pilot in Kenya to full operations across 6 countries in 18 months',
    ],
    quote:
      "Data Lab's dataset was the missing link in our research. Having yield data paired with soil and satellite imagery across thousands of farms globally gave us the training signal we needed to build models that work for the smallholder farmers we serve, not just the large commercial operations that dominate most agricultural datasets.",
    quotePerson: 'Dr. Fatima Adeyemi',
    quoteRole: 'Chief Data Scientist, AgriSync Technologies',
    datasetsUsed: ['precision-agriculture-yields'],
  },
];
