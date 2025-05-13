import { useState, useEffect, useRef } from 'react';
import { memo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
// import { REACT_PUBLIC_API_HOST } from '@/lib/constants';
import { Search } from 'lucide-react';
import { useEduData } from '@/hooks/use-edudata';

const EdukenDashboard = memo(() => {
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  // eslint-disable-next-line no-unused-vars
  const [map, setMap] = useState(null);
  const [geojsonLayer, setGeojsonLayer] = useState(null);
  // const [countyData, setCountyData] = useState(null);
  const { countyData } = useEduData();
  const [searchTerm, setSearchTerm] = useState('');
  const [counties, setCounties] = useState<string[]>([]);
  const mapContainer = useRef(null);
  const mapRef = useRef<any>(null);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  const INSTITUTION_COLORS = ['#8884d8', '#82ca9d'];



  // Get list of counties for search
  useEffect(() => {
    if (mapRef.current) {
      fetch('/kenya.geojson')
        .then((res) => res.json())
        .then((geojson:any) => {
          const countyList = geojson.features.map(
            (feature:any) => feature.properties.COUNTY_NAM,
          );
          console.log('County List geo :', geojson);

          setCounties(countyList);
        });
    }
  }, []);

  const handleSearch = (searchValue:string) => {
    setSearchTerm(searchValue);
    const searchedCounty = counties.find((county) =>
      county.toLowerCase().includes(searchValue.toLowerCase()),
    );

    if (searchedCounty) {
      setSelectedCounty(searchedCounty);

      // Find and zoom to the county on the map
      if (geojsonLayer) {
        geojsonLayer.eachLayer((layer) => {
          if (layer.feature.properties.COUNTY_NAM === searchedCounty) {
            mapRef.current.fitBounds(layer.getBounds());
            layer.setStyle({
              fillColor: 'green',
              fillOpacity: 0.7,
            });
          } else {
            layer.setStyle({
              fillColor: 'lightgray',
              fillOpacity: 0.3,
            });
          }
        });
      }
    }
  };

  const getQualificationsChartData = (countyName:string) => {
    if (
      !countyData ||
      !countyData.qualifications_per_county ||
      !countyData.qualifications_per_county[countyName]
    ) {
      return [];
    }

    const qualifications = countyData.qualifications_per_county[countyName];
    return [
      { name: 'CRAFT', value: qualifications.CRAFT },
      { name: 'DEGREE', value: qualifications.DEGREE },
      { name: 'DIPLOMA', value: qualifications.DIPLOMA },
    ];
  };

  const getInstitutionsChartData = (countyName:string) => {
    if (
      !countyData ||
      !countyData.institutions_per_county ||
      !countyData.institutions_per_county[countyName]
    ) {
      return [];
    }

    const institutions = countyData.institutions_per_county[countyName];
    return [
      { name: 'Private', value: institutions.Private },
      { name: 'Public', value: institutions.Public },
    ];
  };

  const getCategoriesChartData = (countyName) => {
    if (
      !countyData ||
      !countyData.categories_per_county ||
      !countyData.categories_per_county[countyName]
    ) {
      return [];
    }

    const categories = countyData.categories_per_county[countyName];
    return [
      { name: 'College', value: categories.College },
      { name: 'University', value: categories.University },
    ];
  };

  // Map initialization effect
  useEffect(() => {
    if (!mapRef.current && mapContainer.current) {
      mapRef.current = L.map(mapContainer.current).setView(
        [0.0236, 37.9062],
        6,
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);

      setMap(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMap(null);
        setGeojsonLayer(null);
      }
    };
  }, []);

  // GeoJSON handling
  useEffect(() => {
    if (mapRef.current && !geojsonLayer && countyData) {
      fetch('/kenya.geojson')
        .then((res) => res.json())
        .then((geojson) => {

          const newGeojsonLayer = L.geoJSON(geojson, {
            style: (feature) => ({
              fillColor:
                selectedCounty === feature.properties.COUNTY_NAM
                  ? 'green'
                  : 'lightgray',
              fillOpacity:
                selectedCounty === feature.properties.COUNTY_NAM ? 0.7 : 0.3,
              weight: 2,
              color: '#333',
            }),
            onEachFeature: (feature, layer) => {
              const countyName = feature.properties.COUNTY_NAM;
              layer.bindTooltip(countyName);
              layer.on('click', () => {
                setSelectedCounty(
                  countyName === selectedCounty ? null : countyName,
                );
                if (countyName !== selectedCounty) {
                  mapRef.current.fitBounds(layer.getBounds());
                }
              });
            },
          }).addTo(mapRef.current);
          setGeojsonLayer(newGeojsonLayer);
        });
    }
  }, [geojsonLayer, countyData, selectedCounty]);

  return (
    <div className="bg-gray-900 p-4 mt-8">
      <h1 className="text-white text-2xl font-bold mb-4">
        EDUKEN DATA DASHBOARD
      </h1>
      <div className="grid grid-cols-4 gap-4">
        {/* Left Sidebar */}
        <div className="col-span-1 bg-gray-800 p-4 rounded-lg">
          <div className="mb-4">
            <h2 className="text-white text-lg mb-2">Institutions per County</h2>
            {selectedCounty && countyData ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getInstitutionsChartData(selectedCounty)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {getInstitutionsChartData(selectedCounty).map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            INSTITUTION_COLORS[
                              index % INSTITUTION_COLORS.length
                            ]
                          }
                        />
                      ),
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-white">
                Select a county to view institutions data
              </p>
            )}
          </div>

          <div>
            <h2 className="text-white text-lg mb-2">Categories per County</h2>
            {selectedCounty && countyData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getCategoriesChartData(selectedCounty)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fff" />
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-white">
                Select a county to view categories data
              </p>
            )}
          </div>
        </div>

        {/* Center: Kenya Map */}
        <div className="col-span-2 bg-gray-700 p-4 rounded-lg">
          <h2 className="text-white text-lg mb-2">Kenya Map</h2>
          {/* Search Input */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for a county..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div
            ref={mapContainer}
            className="kenya-map"
            style={{ height: '500px', width: '100%' }}
          />
        </div>

        {/* Right Sidebar */}
        <div className="col-span-1 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-white text-xl mb-2">
            {selectedCounty || 'Select a county'}
          </h2>
          <h3 className="text-white text-lg mb-2">QUALIFICATIONS PIE CHART</h3>
          {countyData && selectedCounty ? (
            <ResponsiveContainer width="100%" height={500}>
              <PieChart>
                <Pie
                  data={getQualificationsChartData(selectedCounty)}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={180}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {getQualificationsChartData(selectedCounty).map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ),
                  )}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-white">
              Select a county to view qualifications.
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

EdukenDashboard.displayName = 'EdukenDashboard';

export default EdukenDashboard;
