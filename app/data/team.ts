export interface TeamMember {
  name: string;
  role: string;
  department: 'Leadership' | 'Research' | 'Engineering' | 'Advisory';
  bio: string;
  avatar: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: 'Dr. Elena Vasquez',
    role: 'Chief Executive Officer & Co-Founder',
    department: 'Leadership',
    bio: 'Elena brings over 18 years of experience at the intersection of data science and organizational leadership. Before founding Data Lab, she served as VP of Data Strategy at Palantir Technologies and led the machine learning infrastructure team at Google DeepMind. She holds a PhD in Statistical Learning from Stanford University and has published extensively on scalable data governance frameworks. Under her leadership, Data Lab has grown from a research prototype to a platform trusted by over 4,000 organizations worldwide.',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Elena',
    twitter: 'https://twitter.com/elenavasquez',
    linkedin: 'https://linkedin.com/in/elenavasquez',
  },
  {
    name: 'Marcus Chen',
    role: 'Chief Technology Officer & Co-Founder',
    department: 'Leadership',
    bio: 'Marcus is a distributed systems engineer turned data infrastructure architect with a deep commitment to building reliable, high-throughput data platforms. He previously held senior engineering positions at Databricks and Snowflake, where he contributed to the design of petabyte-scale query engines. He holds an MS in Computer Science from Carnegie Mellon University and is a frequent keynote speaker at conferences including KDD, NeurIPS, and Strata Data. Marcus oversees all platform engineering, security, and infrastructure operations at Data Lab.',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Marcus',
    twitter: 'https://twitter.com/marcuschen',
    linkedin: 'https://linkedin.com/in/marcuschen',
    github: 'https://github.com/marcuschen',
  },
  {
    name: 'Dr. Amara Okonkwo',
    role: 'Head of Research — NLP & Multilingual Systems',
    department: 'Research',
    bio: 'Amara leads the Natural Language Processing research group at Data Lab, where her team focuses on multilingual model evaluation, low-resource language representation, and instruction tuning methodologies. She earned her PhD in Computational Linguistics from the University of Edinburgh and completed a postdoctoral fellowship at the Allen Institute for AI. Her work on cross-lingual transfer learning has been cited over 3,200 times, and she has co-authored benchmark datasets now used by major AI labs for multilingual model assessment.',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Amara',
    twitter: 'https://twitter.com/amaraokonkwo',
    linkedin: 'https://linkedin.com/in/amaraokonkwo',
    github: 'https://github.com/amaraokonkwo',
  },
  {
    name: 'Dr. Julian Reeves',
    role: 'Senior Research Scientist — Computer Vision',
    department: 'Research',
    bio: "Julian specializes in multimodal perception systems, with particular expertise in 3D object detection, semantic segmentation, and the fusion of camera and LiDAR data for autonomous driving applications. Prior to joining Data Lab, he spent five years at Waymo's perception research division, where he led the development of real-time 3D detection models deployed on the Waymo Driver. Julian holds a PhD in Computer Vision from ETH Zurich and maintains active collaborations with the MIT Computer Science and Artificial Intelligence Laboratory.",
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Julian',
    linkedin: 'https://linkedin.com/in/julianreeves',
    github: 'https://github.com/julianreeves',
  },
  {
    name: 'Dr. Priya Sharma',
    role: 'Research Scientist — Climate & Geospatial Analytics',
    department: 'Research',
    bio: "Priya drives Data Lab's climate and earth observation research initiatives, building machine learning pipelines that transform petabytes of satellite imagery and reanalysis data into actionable climate intelligence. She holds a PhD in Atmospheric Science from MIT and previously worked at NASA's Goddard Space Flight Center, where she contributed to the MERRA-2 reanalysis project. Her current research focuses on physics-informed neural networks for sub-seasonal weather forecasting and satellite-derived crop yield estimation in data-sparse regions.",
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Priya',
    twitter: 'https://twitter.com/priyasharma',
    linkedin: 'https://linkedin.com/in/priyasharmacliml',
  },
  {
    name: 'Tomás Ferreira',
    role: 'Principal Platform Engineer',
    department: 'Engineering',
    bio: 'Tomás is responsible for the core data ingestion, storage, and API infrastructure that powers the Data Lab platform. With over a decade of experience building large-scale data systems, he previously served as a Staff Engineer at Netflix, where he designed the real-time data pipeline processing over 8 million events per second. He is an active contributor to Apache Arrow, Apache Parquet, and the Substrait query plan specification. Tomás holds a BS in Computer Engineering from the University of São Paulo.',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Tomas',
    linkedin: 'https://linkedin.com/in/tomasferreira',
    github: 'https://github.com/tomasferreira',
  },
  {
    name: 'Sarah Kim',
    role: 'Senior Frontend & Data Visualization Engineer',
    department: 'Engineering',
    bio: "Sarah designs and builds the interactive data exploration and visualization interfaces that make Data Lab's datasets accessible to researchers and practitioners. She has deep expertise in WebGL-based geospatial rendering, large-dataset virtualization in the browser, and accessible design systems. Before joining Data Lab, she led the visualization engineering team at Observable and contributed to the D3.js ecosystem. Sarah holds an MFA in Design and Technology from Parsons School of Design and an MS in Information Science from the University of Michigan.",
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Sarah',
    twitter: 'https://twitter.com/sarahkimviz',
    github: 'https://github.com/sarahkimviz',
  },
  {
    name: 'Prof. David Müller',
    role: 'Strategic Advisor — Data Ethics & Policy',
    department: 'Advisory',
    bio: "David serves as Data Lab's strategic advisor on data ethics, privacy regulation, and responsible AI policy. He is a tenured Professor of Information Ethics at the Technical University of Munich and serves on the European Commission's High-Level Expert Group on Artificial Intelligence. His advisory work ensures that Data Lab's data collection, anonymization, and licensing practices meet the highest ethical standards and comply with evolving global regulations including the EU AI Act and emerging frameworks in North America and Asia-Pacific. David has authored three books on algorithmic accountability.",
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=David',
    twitter: 'https://twitter.com/davidmueller',
    linkedin: 'https://linkedin.com/in/davidmuellerethics',
  },
];
