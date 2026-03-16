import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useEffectEvent,
} from 'react';
import type { Route } from './+types/workspace';
import { datasets } from '~/data/datasets';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { cn } from '~/lib/utils';
import {
  Play,
  Square,
  Database,
  FileCode,
  Terminal,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  File,
  FilePlus,
  Plus,
  X,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Settings,
  Trash2,
  Clock,
  ArrowLeft,
  Search,
} from 'lucide-react';
import { generateSEOTags } from '~/lib/utils/seo';

// ─── Meta ──────────────────────────────────────────────────────
export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Workspace',
    description: 'Developer workspace with project-based organization',
  });
}

// ─── ID Generator ──────────────────────────────────────────────
const genId = () => Math.random().toString(36).slice(2, 10);

// ─── Types ─────────────────────────────────────────────────────
interface ProjectFile {
  id: string;
  name: string;
  code: string;
  language: 'python' | 'text';
}

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  files: ProjectFile[];
  connectedDatasets: string[];
}

interface ConsoleEntry {
  type: 'output' | 'error' | 'info';
  text: string;
  timestamp: string;
}

// ─── Template Code Strings ─────────────────────────────────────
const QUICK_START_CODE = `import pandas as pd
import numpy as np

# Quick Start Template
# Load your dataset and begin exploring

df = pd.read_csv("dataset.csv")
print(f"Dataset shape: {df.shape}")
print(f"Columns: {list(df.columns)}")
print()
print(df.head(10))
print()
print(df.describe())
`;

const DATA_ANALYSIS_CODE = `import pandas as pd
import numpy as np
from scipy import stats

# Data Analysis Template
# Statistical analysis and data profiling

df = pd.read_csv("dataset.csv")

# Basic statistics
print("=== Dataset Overview ===")
print(f"Shape: {df.shape}")
print(f"Memory usage: {df.memory_usage(deep=True).sum() / 1024**2:.1f} MB")
print()

# Missing value analysis
missing = df.isnull().sum()
missing_pct = (missing / len(df) * 100).round(2)
print("=== Missing Values ===")
for col in df.columns:
    if missing[col] > 0:
        print(f"  {col}: {missing[col]} ({missing_pct[col]}%)")
print()

# Numeric column distributions
numeric_cols = df.select_dtypes(include=[np.number]).columns
print("=== Numeric Distributions ===")
for col in numeric_cols[:5]:
    skew = df[col].skew()
    kurt = df[col].kurtosis()
    print(f"  {col}: mean={df[col].mean():.2f}, std={df[col].std():.2f}, skew={skew:.2f}")

# Correlation analysis
print()
print("=== Top Correlations ===")
corr_matrix = df[numeric_cols].corr()
pairs = []
for i in range(len(numeric_cols)):
    for j in range(i+1, len(numeric_cols)):
        pairs.append((numeric_cols[i], numeric_cols[j], corr_matrix.iloc[i, j]))
pairs.sort(key=lambda x: abs(x[2]), reverse=True)
for c1, c2, r in pairs[:5]:
    print(f"  {c1} <-> {c2}: {r:.3f}")
`;

const VISUALIZATION_CODE = `import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

# Visualization Template
# Generate publication-quality charts

df = pd.read_csv("dataset.csv")

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle("Dataset Exploration Dashboard", fontsize=16, fontweight="bold")

# Distribution plot
numeric_cols = df.select_dtypes(include=[np.number]).columns
if len(numeric_cols) > 0:
    axes[0, 0].hist(df[numeric_cols[0]].dropna(), bins=40, color="#16a34a", alpha=0.7)
    axes[0, 0].set_title(f"Distribution of {numeric_cols[0]}")
    axes[0, 0].set_xlabel(numeric_cols[0])
    axes[0, 0].set_ylabel("Frequency")

# Correlation heatmap
if len(numeric_cols) > 1:
    corr = df[numeric_cols[:8]].corr()
    sns.heatmap(corr, ax=axes[0, 1], cmap="RdYlGn", center=0, annot=True, fmt=".2f")
    axes[0, 1].set_title("Correlation Matrix")

# Box plot
if len(numeric_cols) > 0:
    axes[1, 0].boxplot([df[c].dropna() for c in numeric_cols[:4]],
                        labels=numeric_cols[:4])
    axes[1, 0].set_title("Value Distributions")

# Time series or scatter
if len(numeric_cols) > 1:
    axes[1, 1].scatter(df[numeric_cols[0]], df[numeric_cols[1]],
                        alpha=0.3, s=10, color="#16a34a")
    axes[1, 1].set_title(f"{numeric_cols[0]} vs {numeric_cols[1]}")

plt.tight_layout()
plt.savefig("dashboard.png", dpi=150)
print("Dashboard saved to dashboard.png")
`;

const ML_PIPELINE_CODE = `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import classification_report, accuracy_score
import warnings
warnings.filterwarnings("ignore")

# ML Pipeline Template
# End-to-end machine learning workflow

df = pd.read_csv("dataset.csv")
print(f"Dataset: {df.shape[0]} samples, {df.shape[1]} features")

# Preprocessing
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
target_col = numeric_cols[-1]  # Use last numeric column as target
feature_cols = numeric_cols[:-1]

X = df[feature_cols].fillna(df[feature_cols].median())
y = (df[target_col] > df[target_col].median()).astype(int)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Model training
models = {
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
    "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, random_state=42),
}

print()
for name, model in models.items():
    model.fit(X_train_scaled, y_train)
    y_pred = model.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5)
    print(f"=== {name} ===")
    print(f"  Test Accuracy:  {acc:.4f}")
    print(f"  CV Mean:        {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    print()

# Feature importance
best = models["Random Forest"]
importances = sorted(zip(feature_cols, best.feature_importances_), key=lambda x: x[1], reverse=True)
print("=== Top Features ===")
for feat, imp in importances[:10]:
    print(f"  {feat}: {imp:.4f}")
`;

const datasetTemplate = (ds: {
  slug: string;
  name: string;
}) => `import pandas as pd
import numpy as np

# Dataset: ${ds.name}
# Auto-generated exploration script

print("Loading dataset: ${ds.name}...")
df = pd.read_csv("${ds.slug}.csv")

print(f"Loaded {len(df):,} rows and {len(df.columns)} columns")
print()
print("=== Column Info ===")
for col in df.columns:
    dtype = df[col].dtype
    nulls = df[col].isnull().sum()
    print(f"  {col} ({dtype}) - {nulls} missing")

print()
print("=== Sample Data ===")
print(df.head())
print()
print("=== Statistics ===")
print(df.describe())
`;

// ─── Default Projects ──────────────────────────────────────────
const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Health Data Analysis',
    description: 'Analyzing patient health records for predictive outcomes',
    createdAt: 'Jan 15, 2026',
    updatedAt: 'Jan 20, 2026',
    files: [
      {
        id: 'file-1',
        name: 'main.py',
        language: 'python',
        code: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# Health Data Analysis — Main Pipeline
# Predicting patient readmission risk from EHR records

df = pd.read_csv("global-patient-health-records.csv")
print(f"Loaded {len(df):,} patient records")

# Feature engineering
df["age_group"] = pd.cut(df["age"], bins=[0, 18, 35, 55, 75, 120],
                          labels=["pediatric", "young_adult", "adult", "senior", "elderly"])
df["visit_frequency"] = df.groupby("patient_id")["visit_date"].transform("count")
df["has_chronic"] = df["diagnosis_code"].str.startswith("E11").astype(int)

# Prepare features
features = ["age", "visit_frequency", "has_chronic", "lab_result_1", "lab_result_2"]
X = df[features].fillna(df[features].median())
y = df["readmission_30d"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print()
print("=== Readmission Prediction Results ===")
print(classification_report(y_test, y_pred))
print(f"Feature importances:")
for feat, imp in sorted(zip(features, model.feature_importances_), key=lambda x: -x[1]):
    print(f"  {feat}: {imp:.4f}")
`,
      },
      {
        id: 'file-2',
        name: 'explore.py',
        language: 'python',
        code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Exploratory Data Analysis for Patient Records

df = pd.read_csv("global-patient-health-records.csv")

print("=== Dataset Shape ===")
print(f"Rows: {len(df):,}")
print(f"Columns: {len(df.columns)}")
print()

# Demographics breakdown
print("=== Age Distribution ===")
print(df["age"].describe())
print()

# Diagnosis frequency
print("=== Top 10 Diagnoses ===")
top_dx = df["diagnosis_code"].value_counts().head(10)
for code, count in top_dx.items():
    print(f"  {code}: {count:,} ({count/len(df)*100:.1f}%)")
print()

# Missing data analysis
print("=== Missing Values ===")
missing = df.isnull().sum()
for col in df.columns:
    if missing[col] > 0:
        pct = missing[col] / len(df) * 100
        print(f"  {col}: {missing[col]:,} ({pct:.1f}%)")
`,
      },
      {
        id: 'file-3',
        name: 'utils.py',
        language: 'python',
        code: `import pandas as pd
import numpy as np
from datetime import datetime

# Utility functions for Health Data Analysis

def clean_diagnosis_codes(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize ICD-11 codes to 3-character base codes."""
    df = df.copy()
    df["dx_base"] = df["diagnosis_code"].str[:3]
    df["dx_category"] = df["dx_base"].map(get_icd_categories())
    return df

def calculate_comorbidity_index(patient_df: pd.DataFrame) -> float:
    """Compute Charlson Comorbidity Index approximation."""
    conditions = {
        "E11": 1, "I10": 1, "I25": 1, "J44": 1,
        "N18": 2, "C34": 2, "B20": 6,
    }
    score = 0
    codes = patient_df["diagnosis_code"].str[:3].unique()
    for code, weight in conditions.items():
        if code in codes:
            score += weight
    return score

def get_icd_categories() -> dict:
    """Map ICD base codes to human-readable categories."""
    return {
        "E11": "Type 2 Diabetes",
        "I10": "Hypertension",
        "I25": "Coronary Heart Disease",
        "J44": "COPD",
        "N18": "Chronic Kidney Disease",
        "C34": "Lung Cancer",
        "F32": "Major Depression",
    }

def time_between_visits(df: pd.DataFrame) -> pd.Series:
    """Calculate average days between consecutive visits per patient."""
    df = df.sort_values(["patient_id", "visit_date"])
    df["visit_dt"] = pd.to_datetime(df["visit_date"])
    df["days_since_last"] = df.groupby("patient_id")["visit_dt"].diff().dt.days
    return df.groupby("patient_id")["days_since_last"].mean()
`,
      },
    ],
    connectedDatasets: ['global-patient-health-records'],
  },
  {
    id: 'proj-2',
    name: 'Financial Modeling',
    description: 'High-frequency trading signal detection models',
    createdAt: 'Jan 20, 2026',
    updatedAt: 'Jan 28, 2026',
    files: [
      {
        id: 'file-4',
        name: 'model.py',
        language: 'python',
        code: `import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import precision_score, recall_score, f1_score

# HFT Signal Detection Model
# Identify short-term price movement signals from tick data

df = pd.read_csv("high-frequency-equity-trades.csv")
print(f"Loaded {len(df):,} trade records")

# Feature engineering
df["price_momentum"] = df["price"].pct_change(periods=10)
df["volume_surge"] = df["volume"] / df["volume"].rolling(50).mean()
df["spread_ratio"] = (df["ask"] - df["bid"]) / df["mid_price"]
df["vwap_deviation"] = (df["price"] - df["vwap"]) / df["vwap"]
df["order_imbalance"] = (df["buy_volume"] - df["sell_volume"]) / df["total_volume"]

# Target: price moves up >0.1% in next 5 ticks
df["future_return"] = df["price"].pct_change(periods=-5)
df["signal"] = (df["future_return"] > 0.001).astype(int)
df = df.dropna()

features = ["price_momentum", "volume_surge", "spread_ratio",
            "vwap_deviation", "order_imbalance"]
X = df[features]
y = df["signal"]

# Time-based split (no lookahead)
split_idx = int(len(df) * 0.8)
X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

model = GradientBoostingClassifier(n_estimators=300, max_depth=5, learning_rate=0.05)
model.fit(X_train_s, y_train)
y_pred = model.predict(X_test_s)

print()
print("=== Signal Detection Results ===")
print(f"Precision: {precision_score(y_test, y_pred):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred):.4f}")
print(f"F1 Score:  {f1_score(y_test, y_pred):.4f}")
`,
      },
      {
        id: 'file-5',
        name: 'backtest.py',
        language: 'python',
        code: `import pandas as pd
import numpy as np

# Backtesting Framework for Trading Signals
# Simulate strategy performance with transaction costs

class Backtester:
    def __init__(self, initial_capital=100_000, commission=0.001):
        self.initial_capital = initial_capital
        self.commission = commission

    def run(self, prices, signals):
        capital = self.initial_capital
        position = 0
        trades = []

        for i in range(len(prices)):
            if signals[i] == 1 and position == 0:
                shares = int(capital * 0.95 / prices[i])
                cost = shares * prices[i] * (1 + self.commission)
                if cost <= capital:
                    capital -= cost
                    position = shares
                    trades.append(("BUY", i, prices[i], shares))

            elif signals[i] == 0 and position > 0:
                revenue = position * prices[i] * (1 - self.commission)
                capital += revenue
                trades.append(("SELL", i, prices[i], position))
                position = 0

        # Close any open position
        if position > 0:
            capital += position * prices.iloc[-1] * (1 - self.commission)

        total_return = (capital - self.initial_capital) / self.initial_capital
        return {
            "final_capital": capital,
            "total_return": total_return,
            "num_trades": len(trades),
            "trades": trades,
        }

# Run backtest
df = pd.read_csv("high-frequency-equity-trades.csv")
prices = df["price"].iloc[-10000:]
signals = np.random.choice([0, 1], size=len(prices), p=[0.7, 0.3])

bt = Backtester(initial_capital=100_000)
results = bt.run(prices, pd.Series(signals))

print("=== Backtest Results ===")
print(f"Initial Capital: \${bt.initial_capital:,.2f}")
print(f"Final Capital:   \${results['final_capital']:,.2f}")
print(f"Total Return:    {results['total_return']*100:.2f}%")
print(f"Total Trades:    {results['num_trades']}")
`,
      },
    ],
    connectedDatasets: ['high-frequency-equity-trades'],
  },
  {
    id: 'proj-3',
    name: 'Climate Research',
    description: 'ERA6 climate reanalysis visualization project',
    createdAt: 'Feb 1, 2026',
    updatedAt: 'Feb 3, 2026',
    files: [
      {
        id: 'file-6',
        name: 'analysis.py',
        language: 'python',
        code: `import pandas as pd
import numpy as np
from scipy import stats

# ERA6 Climate Reanalysis — Trend Analysis
# Analyzing temperature and precipitation anomalies

df = pd.read_csv("era6-climate-reanalysis.csv")
print(f"Loaded {len(df):,} climate observations")

# Temperature trend analysis
df["date"] = pd.to_datetime(df["date"])
df["year"] = df["date"].dt.year
df["month"] = df["date"].dt.month

annual_temp = df.groupby("year")["temperature_2m"].mean()
slope, intercept, r, p, se = stats.linregress(annual_temp.index, annual_temp.values)

print()
print("=== Global Temperature Trend ===")
print(f"Warming rate: {slope*10:.3f} °C per decade")
print(f"R-squared: {r**2:.4f}")
print(f"P-value: {p:.2e}")
print()

# Seasonal analysis
seasonal = df.groupby("month")["temperature_2m"].agg(["mean", "std"])
print("=== Seasonal Averages ===")
months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
for i, row in seasonal.iterrows():
    print(f"  {months[i-1]}: {row['mean']:.1f}°C (±{row['std']:.1f})")

# Extreme events
print()
p95 = df["temperature_2m"].quantile(0.95)
p05 = df["temperature_2m"].quantile(0.05)
print(f"=== Extreme Thresholds ===")
print(f"95th percentile: {p95:.1f}°C")
print(f"5th percentile:  {p05:.1f}°C")
extreme_hot = df[df["temperature_2m"] > p95]
print(f"Hot extremes: {len(extreme_hot):,} observations")
`,
      },
      {
        id: 'file-7',
        name: 'visualize.py',
        language: 'python',
        code: `import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import cartopy.crs as ccrs

# ERA6 Climate Visualization
# Generate publication-quality climate charts

df = pd.read_csv("era6-climate-reanalysis.csv")
df["date"] = pd.to_datetime(df["date"])

fig = plt.figure(figsize=(16, 12))
fig.suptitle("ERA6 Climate Reanalysis Dashboard", fontsize=18, fontweight="bold")

# 1. Global temperature anomaly time series
ax1 = fig.add_subplot(2, 2, 1)
monthly = df.set_index("date").resample("M")["temperature_2m"].mean()
baseline = monthly.loc["1981":"2010"].mean()
anomaly = monthly - baseline
colors = ["#dc2626" if v > 0 else "#2563eb" for v in anomaly]
ax1.bar(anomaly.index, anomaly.values, color=colors, width=25, alpha=0.7)
ax1.set_title("Temperature Anomaly (vs 1981-2010 baseline)")
ax1.set_ylabel("Anomaly (°C)")
ax1.axhline(y=0, color="black", linewidth=0.5)

# 2. Precipitation distribution
ax2 = fig.add_subplot(2, 2, 2)
ax2.hist(df["precipitation"].dropna(), bins=50, color="#16a34a", alpha=0.7)
ax2.set_title("Precipitation Distribution")
ax2.set_xlabel("Precipitation (mm)")
ax2.set_ylabel("Frequency")

# 3. Seasonal cycle
ax3 = fig.add_subplot(2, 2, 3)
monthly_cycle = df.groupby(df["date"].dt.month)["temperature_2m"].mean()
ax3.plot(range(1, 13), monthly_cycle.values, "o-", color="#16a34a", linewidth=2)
ax3.set_title("Mean Annual Temperature Cycle")
ax3.set_xlabel("Month")
ax3.set_ylabel("Temperature (°C)")
ax3.set_xticks(range(1, 13))

# 4. Wind rose / distribution
ax4 = fig.add_subplot(2, 2, 4)
ax4.scatter(df["wind_speed"], df["temperature_2m"], alpha=0.1, s=5, color="#16a34a")
ax4.set_title("Wind Speed vs Temperature")
ax4.set_xlabel("Wind Speed (m/s)")
ax4.set_ylabel("Temperature (°C)")

plt.tight_layout()
plt.savefig("climate_dashboard.png", dpi=200)
print("Climate dashboard saved to climate_dashboard.png")
`,
      },
    ],
    connectedDatasets: ['era6-climate-reanalysis'],
  },
];

// ─── Main Component ────────────────────────────────────────────
export default function Workspace() {
  // ── Top-level state ──
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // ── IDE state ──
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [consoleHistory, setConsoleHistory] = useState<ConsoleEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [datasetsExpanded, setDatasetsExpanded] = useState(true);
  const [filesExpanded, setFilesExpanded] = useState(true);
  const [templatesExpanded, setTemplatesExpanded] = useState(false);
  const [showAddDataset, setShowAddDataset] = useState(false);

  const consoleEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Derived ──
  const activeProject = projects.find((p) => p.id === activeProjectId) ?? null;
  const activeFile =
    activeProject?.files.find((f) => f.id === activeFileId) ?? null;

  // ── Auto-select first file when entering a project ──
  const watchActiveProjectEffect = useEffectEvent((activeProjectId: string) => {
    if (activeProjectId) {
      const proj = projects.find((p) => p.id === activeProjectId);
      if (proj && proj.files.length > 0) {
        setActiveFileId(proj.files[0].id);
      } else {
        setActiveFileId(null);
      }
      setConsoleHistory([]);
    }
  });
  useEffect(() => {
    watchActiveProjectEffect(activeProjectId!);
  }, [activeProjectId]);

  // ── Auto-scroll console ──
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleHistory]);

  // ── Collapse sidebar on mobile ──
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  // ── Project mutations ──
  const addFileToProject = useCallback(
    (projectId: string, file: ProjectFile) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                files: [...p.files, file],
                updatedAt: new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }),
              }
            : p
        )
      );
    },
    []
  );

  const updateFileCode = useCallback(
    (projectId: string, fileId: string, code: string) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                files: p.files.map((f) =>
                  f.id === fileId ? { ...f, code } : f
                ),
                updatedAt: new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }),
              }
            : p
        )
      );
    },
    []
  );

  const removeFileFromProject = useCallback(
    (projectId: string, fileId: string) => {
      if (!window.confirm('Delete this file? This cannot be undone.')) return;
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? { ...p, files: p.files.filter((f) => f.id !== fileId) }
            : p
        )
      );
      setActiveFileId((prev) => (prev === fileId ? null : prev));
    },
    []
  );

  const connectDataset = useCallback((projectId: string, slug: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId && !p.connectedDatasets.includes(slug)
          ? { ...p, connectedDatasets: [...p.connectedDatasets, slug] }
          : p
      )
    );
    setShowAddDataset(false);
  }, []);

  const disconnectDataset = useCallback((projectId: string, slug: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              connectedDatasets: p.connectedDatasets.filter((s) => s !== slug),
            }
          : p
      )
    );
  }, []);

  const deleteProject = useCallback(
    (projectId: string) => {
      if (
        !window.confirm(
          'Delete this project and all its files? This cannot be undone.'
        )
      )
        return;
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (activeProjectId === projectId) {
        setActiveProjectId(null);
      }
    },
    [activeProjectId]
  );

  const renameProject = useCallback((projectId: string, name: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, name } : p))
    );
  }, []);

  // ── Create project ──
  const handleCreateProject = useCallback(
    (templateCode?: string) => {
      const name = newProjectName.trim() || 'Untitled Project';
      const files: ProjectFile[] = templateCode
        ? [
            {
              id: genId(),
              name: 'main.py',
              code: templateCode,
              language: 'python',
            },
          ]
        : [];
      const project: Project = {
        id: 'proj-' + Date.now(),
        name,
        description: newProjectDesc.trim(),
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        updatedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        files,
        connectedDatasets: [],
      };
      setProjects((prev) => [project, ...prev]);
      setActiveProjectId(project.id);
      setShowCreateModal(false);
      setNewProjectName('');
      setNewProjectDesc('');
    },
    [newProjectName, newProjectDesc]
  );

  // ── Create file ──
  const handleNewFile = useCallback(() => {
    if (!activeProject) return;
    const existingCount = activeProject.files.filter((f) =>
      f.name.startsWith('untitled_')
    ).length;
    const file: ProjectFile = {
      id: genId(),
      name: `untitled_${existingCount + 1}.py`,
      code: '# New file\n',
      language: 'python',
    };
    addFileToProject(activeProject.id, file);
    setActiveFileId(file.id);
  }, [activeProject, addFileToProject]);

  // ── Run handler ──
  const handleRun = useCallback(() => {
    if (!activeProject || !activeFile || isRunning) return;
    setIsRunning(true);
    setConsoleOpen(true);

    const now = () =>
      new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

    const addEntry = (entry: ConsoleEntry) =>
      setConsoleHistory((prev) => [...prev, entry]);

    addEntry({
      type: 'info',
      text: `Executing ${activeFile.name} in project ${activeProject.name}...`,
      timestamp: now(),
    });

    const dsNames = activeProject.connectedDatasets
      .map((slug) => datasets.find((d) => d.slug === slug)?.name)
      .filter(Boolean);

    setTimeout(() => {
      if (dsNames.length > 0) {
        dsNames.forEach((name) => {
          addEntry({
            type: 'info',
            text: `Loading dataset: ${name}...`,
            timestamp: now(),
          });
        });
      }
    }, 600);

    setTimeout(() => {
      const code = activeFile.code;

      if (code.includes('import') && code.includes('error')) {
        addEntry({
          type: 'error',
          text: "ModuleNotFoundError: No module named 'nonexistent'",
          timestamp: now(),
        });
      } else {
        // Mock realistic output
        const lines: string[] = [];
        if (code.includes('shape')) lines.push('Dataset shape: (12400000, 87)');
        if (code.includes('print') && code.includes('Loaded'))
          lines.push('Loaded 12,400,000 records');
        if (code.includes('accuracy') || code.includes('Accuracy'))
          lines.push('Test Accuracy:  0.8734');
        if (code.includes('precision') || code.includes('Precision'))
          lines.push('Precision: 0.8291');
        if (code.includes('recall') || code.includes('Recall'))
          lines.push('Recall:    0.7845');
        if (code.includes('f1') || code.includes('F1'))
          lines.push('F1 Score:  0.8062');
        if (code.includes('describe'))
          lines.push(
            '       count       mean       std        min        25%        50%        75%        max\n' +
              'age    12.4M      47.3      18.2       0.0       33.0       47.0       61.0      119.0'
          );
        if (code.includes('corr'))
          lines.push('Top correlation: lab_result_1 <-> lab_result_2: 0.847');
        if (code.includes('hist') || code.includes('plot'))
          lines.push('Chart rendered successfully');
        if (code.includes('savefig') || code.includes('saved'))
          lines.push('Figure saved to output.png');
        if (code.includes('slope') || code.includes('warming'))
          lines.push('Warming rate: 0.218 °C per decade');
        if (code.includes('backtest') || code.includes('Backtest'))
          lines.push(
            'Backtest Results:\n  Initial Capital: $100,000.00\n  Final Capital:   $112,847.33\n  Total Return:    12.85%'
          );

        if (lines.length === 0) {
          lines.push('Script executed successfully (no output)');
        }

        lines.forEach((line) => {
          addEntry({ type: 'output', text: line, timestamp: now() });
        });
      }
    }, 1400);

    setTimeout(() => {
      const elapsed = (1.2 + Math.random() * 2.8).toFixed(2);
      addEntry({
        type: 'info',
        text: `Script completed in ${elapsed}s`,
        timestamp: now(),
      });
      setIsRunning(false);
    }, 2200);
  }, [activeProject, activeFile, isRunning]);

  // ─── PROJECT DASHBOARD ─────────────────────────────────────
  if (!activeProjectId) {
    const filteredProjects = projects.filter(
      (p) =>
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-muted/30">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">My Projects</h1>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {projects.length}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>

        {/* Project Grid */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="relative cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
                  onClick={() => setActiveProjectId(project.id)}
                >
                  {/* Delete button */}
                  <button
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-destructive z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(project.id);
                    }}
                    title="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/5 rounded-lg">
                        <FolderOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <CardTitle className="text-base font-semibold leading-tight">
                          {project.name}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {project.description || 'No description'}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1.5">
                        <File className="h-3.5 w-3.5" />
                        {project.files.length} file
                        {project.files.length !== 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Database className="h-3.5 w-3.5" />
                        {project.connectedDatasets.length} dataset
                        {project.connectedDatasets.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      Last updated: {project.updatedAt}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="p-4 bg-muted rounded-full mb-4">
                <FolderOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No projects yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Create your first project to get started
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          )}
        </div>

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <Card className="max-w-md w-full mx-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Create New Project</CardTitle>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewProjectName('');
                    setNewProjectDesc('');
                  }}
                  className="p-1 rounded hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Project Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="My awesome project"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newProjectName.trim()) {
                        handleCreateProject();
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Description
                  </label>
                  <Input
                    placeholder="Optional description..."
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => handleCreateProject()}
                  disabled={!newProjectName.trim()}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  Create Project
                </Button>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    Start from template
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        label: 'Quick Start',
                        icon: Play,
                        code: QUICK_START_CODE,
                      },
                      {
                        label: 'Data Analysis',
                        icon: FileCode,
                        code: DATA_ANALYSIS_CODE,
                      },
                      {
                        label: 'Visualization',
                        icon: Database,
                        code: VISUALIZATION_CODE,
                      },
                      {
                        label: 'ML Pipeline',
                        icon: Terminal,
                        code: ML_PIPELINE_CODE,
                      },
                    ].map((tmpl) => (
                      <button
                        key={tmpl.label}
                        onClick={() => {
                          if (!newProjectName.trim()) {
                            setNewProjectName(tmpl.label + ' Project');
                          }
                          handleCreateProject(tmpl.code);
                        }}
                        className="flex items-center gap-2 p-2.5 rounded-lg border hover:bg-primary/5 hover:border-primary/20 text-sm text-left transition-colors"
                      >
                        <tmpl.icon className="h-4 w-4 text-primary shrink-0" />
                        {tmpl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // ─── IDE VIEW ──────────────────────────────────────────────
  if (!activeProject) return null;

  const availableDatasets = datasets.filter(
    (d) => !activeProject.connectedDatasets.includes(d.slug)
  );

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
      {/* ── Top Bar ── */}
      <div className="h-12 border-b bg-white flex items-center px-4 gap-3 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveProjectId(null)}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Projects
        </Button>
        <div className="h-6 w-px bg-border" />
        <span className="font-semibold text-sm">{activeProject.name}</span>
        <span className="text-sm text-muted-foreground hidden lg:inline truncate max-w-xs">
          {activeProject.description}
        </span>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            onClick={handleRun}
            disabled={isRunning || !activeFile}
            className="bg-primary hover:bg-primary/90 text-white gap-1.5"
          >
            {isRunning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            Run
          </Button>
          {isRunning && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsRunning(false)}
              className="text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
            >
              <Square className="h-3.5 w-3.5" />
              Stop
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setConsoleHistory([])}
            title="Clear console"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" title="Settings">
            <Settings className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Main Area ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Left Sidebar ── */}
        {sidebarOpen ? (
          <div className="w-64 border-r bg-muted/20 flex flex-col shrink-0">
            {/* Sidebar header */}
            <div className="h-9 border-b flex items-center justify-between px-3">
              <span className="text-xs font-semibold text-muted-foreground tracking-wider">
                EXPLORER
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded hover:bg-muted"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* FILES Section */}
              <div>
                <button
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/50 text-xs font-semibold text-muted-foreground tracking-wider"
                  onClick={() => setFilesExpanded((v) => !v)}
                >
                  <span className="flex items-center gap-1.5">
                    {filesExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                    FILES
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNewFile();
                    }}
                    className="p-0.5 rounded hover:bg-muted"
                    title="New file"
                  >
                    <FilePlus className="h-3.5 w-3.5" />
                  </button>
                </button>
                {filesExpanded && (
                  <div className="pb-1">
                    {activeProject.files.map((file) => (
                      <div
                        key={file.id}
                        className={cn(
                          'group flex items-center gap-2 px-4 py-1.5 cursor-pointer text-sm hover:bg-muted/50',
                          activeFileId === file.id &&
                            'bg-primary/5 text-primary'
                        )}
                        onClick={() => setActiveFileId(file.id)}
                      >
                        <FileCode
                          className={cn(
                            'h-3.5 w-3.5 shrink-0',
                            activeFileId === file.id
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          )}
                        />
                        <span className="truncate flex-1">{file.name}</span>
                        <button
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-100 hover:text-destructive transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFileFromProject(activeProject.id, file.id);
                          }}
                          title="Delete file"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleNewFile}
                      className="flex items-center gap-2 px-4 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 w-full"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      New File
                    </button>
                  </div>
                )}
              </div>

              {/* DATASETS Section */}
              <div className="border-t">
                <button
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/50 text-xs font-semibold text-muted-foreground tracking-wider"
                  onClick={() => setDatasetsExpanded((v) => !v)}
                >
                  <span className="flex items-center gap-1.5">
                    {datasetsExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                    DATASETS
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAddDataset((v) => !v);
                    }}
                    className="p-0.5 rounded hover:bg-muted"
                    title="Connect dataset"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </button>
                {datasetsExpanded && (
                  <div className="pb-1">
                    {activeProject.connectedDatasets.map((slug) => {
                      const ds = datasets.find((d) => d.slug === slug);
                      return (
                        <div
                          key={slug}
                          className="group flex items-center gap-2 px-4 py-1.5 cursor-pointer text-sm hover:bg-muted/50"
                          onClick={() => {
                            if (ds) {
                              const file: ProjectFile = {
                                id: genId(),
                                name: `${slug.slice(0, 20)}_explore.py`,
                                code: datasetTemplate(ds),
                                language: 'python',
                              };
                              addFileToProject(activeProject.id, file);
                              setActiveFileId(file.id);
                            }
                          }}
                        >
                          <Database className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="truncate flex-1 text-xs">
                            {ds?.name ?? slug}
                          </span>
                          <button
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-100 hover:text-destructive transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              disconnectDataset(activeProject.id, slug);
                            }}
                            title="Disconnect dataset"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}

                    {/* Add dataset dropdown */}
                    {showAddDataset && (
                      <div className="mx-2 mt-1 mb-1 border rounded-lg bg-white shadow-sm max-h-48 overflow-y-auto">
                        {availableDatasets.length > 0 ? (
                          availableDatasets.map((ds) => (
                            <button
                              key={ds.slug}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-primary/5 text-left"
                              onClick={() =>
                                connectDataset(activeProject.id, ds.slug)
                              }
                            >
                              <Database className="h-3 w-3 text-muted-foreground shrink-0" />
                              <span className="truncate">{ds.name}</span>
                            </button>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground p-3 text-center">
                            All datasets connected
                          </p>
                        )}
                      </div>
                    )}

                    {activeProject.connectedDatasets.length === 0 &&
                      !showAddDataset && (
                        <p className="text-xs text-muted-foreground px-4 py-2">
                          No datasets connected
                        </p>
                      )}
                  </div>
                )}
              </div>

              {/* TEMPLATES Section */}
              <div className="border-t">
                <button
                  className="w-full flex items-center gap-1.5 px-3 py-2 hover:bg-muted/50 text-xs font-semibold text-muted-foreground tracking-wider"
                  onClick={() => setTemplatesExpanded((v) => !v)}
                >
                  {templatesExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                  TEMPLATES
                </button>
                {templatesExpanded && (
                  <div className="pb-1">
                    {[
                      {
                        label: 'Quick Start',
                        icon: Play,
                        code: QUICK_START_CODE,
                        filename: 'quickstart.py',
                      },
                      {
                        label: 'Data Analysis',
                        icon: FileCode,
                        code: DATA_ANALYSIS_CODE,
                        filename: 'analysis.py',
                      },
                      {
                        label: 'Visualization',
                        icon: Database,
                        code: VISUALIZATION_CODE,
                        filename: 'visualization.py',
                      },
                      {
                        label: 'ML Pipeline',
                        icon: Terminal,
                        code: ML_PIPELINE_CODE,
                        filename: 'ml_pipeline.py',
                      },
                    ].map((tmpl) => (
                      <button
                        key={tmpl.label}
                        className="w-full flex items-center gap-2 px-4 py-1.5 text-sm hover:bg-muted/50 text-left"
                        onClick={() => {
                          const file: ProjectFile = {
                            id: genId(),
                            name: tmpl.filename,
                            code: tmpl.code,
                            language: 'python',
                          };
                          addFileToProject(activeProject.id, file);
                          setActiveFileId(file.id);
                        }}
                      >
                        <tmpl.icon className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="text-xs">{tmpl.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-12 border-r bg-muted/20 flex flex-col items-center py-2 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded hover:bg-muted"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        )}

        {/* ── Editor + Console Column ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* File Tabs */}
          <div className="h-9 border-b bg-muted/10 flex items-center shrink-0 overflow-x-auto">
            {activeProject.files.map((file) => (
              <button
                key={file.id}
                className={cn(
                  'flex items-center gap-1.5 px-3 h-full text-xs border-r hover:bg-white whitespace-nowrap shrink-0 group',
                  activeFileId === file.id
                    ? 'bg-white border-b-2 border-b-primary text-foreground'
                    : 'text-muted-foreground'
                )}
                onClick={() => setActiveFileId(file.id)}
              >
                <FileCode className="h-3 w-3 shrink-0" />
                {file.name}
                <span
                  className="ml-1 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFileFromProject(activeProject.id, file.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </span>
              </button>
            ))}
            <button
              onClick={handleNewFile}
              className="flex items-center justify-center px-2 h-full hover:bg-muted/50"
              title="New file"
            >
              <Plus className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-hidden relative bg-slate-950">
            {activeFile ? (
              <div className="h-full flex">
                {/* Line numbers */}
                <div className="w-12 bg-slate-900 text-slate-600 text-xs font-mono pt-4 pr-2 text-right select-none overflow-hidden shrink-0">
                  {activeFile.code.split('\n').map((_, i) => (
                    <div key={i} className="leading-6 px-2">
                      {i + 1}
                    </div>
                  ))}
                </div>
                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={activeFile.code}
                  onChange={(e) =>
                    updateFileCode(
                      activeProject.id,
                      activeFile.id,
                      e.target.value
                    )
                  }
                  className="flex-1 bg-transparent text-primary font-mono text-sm p-4 resize-none focus:outline-none leading-6 overflow-auto"
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <FileCode className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">
                    Select or create a file to begin
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Console */}
          {consoleOpen && (
            <div className="h-52 border-t bg-slate-950 flex flex-col shrink-0">
              <div className="h-8 flex items-center justify-between px-3 bg-slate-900 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs text-slate-400 font-medium">
                    CONSOLE
                  </span>
                  {isRunning && (
                    <Loader2 className="h-3 w-3 text-primary animate-spin" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setConsoleHistory([])}
                    className="p-1 rounded hover:bg-slate-800"
                    title="Clear console"
                  >
                    <Trash2 className="h-3 w-3 text-slate-500" />
                  </button>
                  <button
                    onClick={() => setConsoleOpen(false)}
                    className="p-1 rounded hover:bg-slate-800"
                    title="Close console"
                  >
                    <X className="h-3 w-3 text-slate-500" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-0.5">
                {consoleHistory.length === 0 ? (
                  <p className="text-slate-600 italic">
                    Console output will appear here...
                  </p>
                ) : (
                  consoleHistory.map((entry, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-slate-600 shrink-0">
                        [{entry.timestamp}]
                      </span>
                      <span
                        className={cn(
                          entry.type === 'error' && 'text-red-400',
                          entry.type === 'info' && 'text-blue-400',
                          entry.type === 'output' && 'text-primary'
                        )}
                      >
                        {entry.text}
                      </span>
                    </div>
                  ))
                )}
                <div ref={consoleEndRef} />
              </div>
            </div>
          )}

          {/* Console toggle when closed */}
          {!consoleOpen && (
            <button
              className="h-7 border-t bg-slate-900 flex items-center justify-center hover:bg-slate-800 shrink-0"
              onClick={() => setConsoleOpen(true)}
            >
              <Terminal className="h-3 w-3 text-slate-500 mr-1.5" />
              <span className="text-xs text-slate-500">Show Console</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
