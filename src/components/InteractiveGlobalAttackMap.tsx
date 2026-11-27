import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import worldAtlasData from 'world-atlas/countries-110m.json';
import {
  Globe,
  Crosshair,
  ShieldAlert,
  Activity,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Radio,
  ArrowUpRight,
  Layers,
  Filter,
  Server,
  Flame,
} from 'lucide-react';
import { ThreatItem } from '../types/threat';

export interface CountryAttackSpread {
  isoNumeric: string;
  isoAlpha2: string;
  nameNL: string;
  flag: string;
  category: 'STATE_APT_ORIGIN' | 'RANSOMWARE_HUB' | 'C2_RELAY_BOTNET' | 'TARGET_HUB';
  categoryLabel: string;
  coordinates: [number, number]; // [lon, lat]
  activeAttacks: number;
  livePacketsPerSec: number;
  c2Nodes: number;
  severity: 'KRITIEK' | 'HOOG' | 'MIDDEL' | 'LAAG';
  dominantActors: string[];
  primaryVectors: string[];
  targetedDutchSectors: string[];
  originFilterKey?: 'RUSLAND' | 'CHINA' | 'NOORD_KOREA' | 'IRAN' | 'OOST_EUROPA' | ' WESTERSE_CYBERCRIME';
}

const INITIAL_GLOBAL_SPREAD: CountryAttackSpread[] = [
  {
    isoNumeric: '643',
    isoAlpha2: 'RU',
    nameNL: 'Rusland',
    flag: '🇷🇺',
    category: 'STATE_APT_ORIGIN',
    categoryLabel: 'Statelijke APT & RaaS Syndicaat',
    coordinates: [37.6173, 55.7558],
    activeAttacks: 342,
    livePacketsPerSec: 48200,
    c2Nodes: 164,
    severity: 'KRITIEK',
    dominantActors: ['Sandworm (GRU 74455)', 'APT28 (Fancy Bear)', 'LockBit 3.0', 'Black Basta'],
    primaryVectors: ['OT/SCADA IEC-104 Exploitatie', 'Citrix Bleed Session Hijack', 'WMS Ransomware'],
    targetedDutchSectors: ['Energie (TenneT)', 'Voedselketen (Albert Heijn)', 'Rijksoverheid & Defensie'],
    originFilterKey: 'RUSLAND',
  },
  {
    isoNumeric: '156',
    isoAlpha2: 'CN',
    nameNL: 'China',
    flag: '🇨🇳',
    category: 'STATE_APT_ORIGIN',
    categoryLabel: 'Statelijke Spionage & LotL APT',
    coordinates: [104.1954, 35.8617],
    activeAttacks: 298,
    livePacketsPerSec: 41900,
    c2Nodes: 142,
    severity: 'KRITIEK',
    dominantActors: ['Volt Typhoon (MSS)', 'Salt Typhoon', 'APT41 (Winnti)', 'Mustang Panda'],
    primaryVectors: ['FortiOS SSL-VPN Zero-Day', 'Cisco IOS XE BGP Implant', 'Living-off-the-Land'],
    targetedDutchSectors: ['Haven van Rotterdam', 'ASML & High-Tech', 'AMS-IX Telecom Core'],
    originFilterKey: 'CHINA',
  },
  {
    isoNumeric: '408',
    isoAlpha2: 'KP',
    nameNL: 'Noord-Korea',
    flag: '🇰🇵',
    category: 'STATE_APT_ORIGIN',
    categoryLabel: 'Financiële & Crypto Exfiltratie APT',
    coordinates: [125.7625, 39.0392],
    activeAttacks: 136,
    livePacketsPerSec: 18400,
    c2Nodes: 58,
    severity: 'KRITIEK',
    dominantActors: ['Lazarus Group (RGB 121)', 'Kimsuky', 'Andariel'],
    primaryVectors: ['NPM/PyPI Supply-Chain Poisoning', 'BLINDINGCAN RAT', 'Swift/Crypto API Exploit'],
    targetedDutchSectors: ['Financiële Instellingen (Zuidas)', 'Semiconductor Toeleveranciers'],
    originFilterKey: 'NOORD_KOREA',
  },
  {
    isoNumeric: '364',
    isoAlpha2: 'IR',
    nameNL: 'Iran',
    flag: '🇮🇷',
    category: 'STATE_APT_ORIGIN',
    categoryLabel: 'IRGC Cyber & ICS Sabotage',
    coordinates: [51.389, 35.6892],
    activeAttacks: 114,
    livePacketsPerSec: 15600,
    c2Nodes: 49,
    severity: 'HOOG',
    dominantActors: ['Charming Kitten (APT35)', 'MuddyWater (MOIS)', 'CyberAv3ngers'],
    primaryVectors: ['Unitronics PLC Exploit', 'BellaCiao Web Shell', 'Password Spraying'],
    targetedDutchSectors: ['Drinkwaterbedrijven', 'Petrochemie (Pernis / Botlek)', 'Maritieme Logistiek'],
    originFilterKey: 'IRAN',
  },
  {
    isoNumeric: '112',
    isoAlpha2: 'BY',
    nameNL: 'Wit-Rusland (Belarus)',
    flag: '🇧🇾',
    category: 'RANSOMWARE_HUB',
    categoryLabel: 'Geallieerde APT & Proxy Hub',
    coordinates: [27.5615, 53.9045],
    activeAttacks: 78,
    livePacketsPerSec: 11200,
    c2Nodes: 37,
    severity: 'HOOG',
    dominantActors: ['Ghostwriter (UNC1151)', 'Akira Affiliates'],
    primaryVectors: ['Spear-Phishing Credential Harvesting', 'BGP Route Leaking'],
    targetedDutchSectors: ['Defensie Logistiek', 'Spoorwegen & Transport'],
    originFilterKey: 'OOST_EUROPA',
  },
  {
    isoNumeric: '840',
    isoAlpha2: 'US',
    nameNL: 'Verenigde Staten (C2 Cloud Relais)',
    flag: '🇺🇸',
    category: 'C2_RELAY_BOTNET',
    categoryLabel: 'Gehackte VPS & C2 Hop-Infrastructuur',
    coordinates: [-95.7129, 37.0902],
    activeAttacks: 64,
    livePacketsPerSec: 14300,
    c2Nodes: 92,
    severity: 'MIDDEL',
    dominantActors: ['Scattered Spider (0ktapus)', 'ALPHV/BlackCat Relais'],
    primaryVectors: ['SIM-Swapping & Helpdesk Social Engineering', 'Cloud Tenant Persistence'],
    targetedDutchSectors: ['Cloud & Datacenters (Schiphol-Rijk)', 'Telecom Providers'],
  },
  {
    isoNumeric: '398',
    isoAlpha2: 'KZ',
    nameNL: 'Kazachstan',
    flag: '🇰🇿',
    category: 'C2_RELAY_BOTNET',
    categoryLabel: 'Euraziatische C2 Transit Corridor',
    coordinates: [66.9237, 48.0196],
    activeAttacks: 52,
    livePacketsPerSec: 7800,
    c2Nodes: 31,
    severity: 'MIDDEL',
    dominantActors: ['Turla (FSB Relais)', 'Sandworm Transit Nodes'],
    primaryVectors: ['DNS Tunneling Relais', 'Encrypted SOCKS5 Proxies'],
    targetedDutchSectors: ['Energie Transport', 'Overheidsnetwerken'],
    originFilterKey: 'OOST_EUROPA',
  },
  {
    isoNumeric: '704',
    isoAlpha2: 'VN',
    nameNL: 'Vietnam',
    flag: '🇻🇳',
    category: 'C2_RELAY_BOTNET',
    categoryLabel: 'IoT Botnet & ORB-Netwerk Knooppunt',
    coordinates: [108.2772, 14.0583],
    activeAttacks: 49,
    livePacketsPerSec: 9400,
    c2Nodes: 64,
    severity: 'MIDDEL',
    dominantActors: ['OceanLotus (APT32)', 'Volt Typhoon ORB Routers'],
    primaryVectors: ['SOHO Router Botnet Hijacking', 'HTTPS Beaconing'],
    targetedDutchSectors: ['High-Tech Maakindustrie', 'Maritieme Toeleveranciers'],
  },
  {
    isoNumeric: '076',
    isoAlpha2: 'BR',
    nameNL: 'Brazilië',
    flag: '🇧🇷',
    category: 'C2_RELAY_BOTNET',
    categoryLabel: 'DDoS Botnet & Banking Malware Cluster',
    coordinates: [-51.9253, -14.235],
    activeAttacks: 43,
    livePacketsPerSec: 12800,
    c2Nodes: 73,
    severity: 'MIDDEL',
    dominantActors: ['Mirai/HailBot DDoS Clusters', 'Grandoreiro Banking Affiliates'],
    primaryVectors: ['UDP/SYN Flood Amplificatie', 'Infostealer Distributie'],
    targetedDutchSectors: ['Financiële Portalen', 'E-commerce & Publieke Diensten'],
  },
  {
    isoNumeric: '792',
    isoAlpha2: 'TR',
    nameNL: 'Turkije',
    flag: '🇹🇷',
    category: 'C2_RELAY_BOTNET',
    categoryLabel: 'Bulletproof Hosting & C2 Proxy',
    coordinates: [35.2433, 38.9637],
    activeAttacks: 38,
    livePacketsPerSec: 6900,
    c2Nodes: 29,
    severity: 'MIDDEL',
    dominantActors: ['Sea Turtle', 'Initial Access Brokers (IAB)'],
    primaryVectors: ['RDP Brute-Force Waves', 'DNS Hijacking'],
    targetedDutchSectors: ['Logistiek & Douane', 'MKB Toeleveranciers'],
  },
  {
    isoNumeric: '642',
    isoAlpha2: 'RO',
    nameNL: 'Roemenië',
    flag: '🇷🇴',
    category: 'RANSOMWARE_HUB',
    categoryLabel: 'Oost-Europese IAB & Bulletproof Servers',
    coordinates: [24.9668, 45.9432],
    activeAttacks: 35,
    livePacketsPerSec: 6100,
    c2Nodes: 41,
    severity: 'MIDDEL',
    dominantActors: ['Initial Access Brokers', 'Lumma Stealer C2'],
    primaryVectors: ['Infostealer Log Exfiltratie', 'VPN Credential Stuffing'],
    targetedDutchSectors: ['Retail & Distributie', 'Zorginstellingen'],
    originFilterKey: 'OOST_EUROPA',
  },
  {
    isoNumeric: '356',
    isoAlpha2: 'IN',
    nameNL: 'India',
    flag: '🇮🇳',
    category: 'C2_RELAY_BOTNET',
    categoryLabel: 'Gecompromitteerde Cloud & Proxy Nodes',
    coordinates: [78.9629, 20.5937],
    activeAttacks: 31,
    livePacketsPerSec: 5400,
    c2Nodes: 48,
    severity: 'LAAG',
    dominantActors: ['Globale Botnet Relais', 'Phishing Kit Hosting'],
    primaryVectors: ['Geautomatiseerde CVE-Scanners', 'SMTP Phishing Relais'],
    targetedDutchSectors: ['Zakelijke Dienstverlening', 'Telecom'],
  },
  {
    isoNumeric: '276',
    isoAlpha2: 'DE',
    nameNL: 'Duitsland (Frankfurt Hop-Nodes)',
    flag: '🇩🇪',
    category: 'C2_RELAY_BOTNET',
    categoryLabel: 'Europese Low-Latency C2 Proxy',
    coordinates: [10.4515, 51.1657],
    activeAttacks: 29,
    livePacketsPerSec: 8900,
    c2Nodes: 54,
    severity: 'MIDDEL',
    dominantActors: ['Cobalt Strike Teamserver Relais', 'APT29 Hop-VPS'],
    primaryVectors: ['TLS 1.3 Geëncrypteerde C2 Tunnels naar NL', 'Fast-Flux DNS'],
    targetedDutchSectors: ['AMS-IX Peering', 'Rijksoverheid API Gateways'],
  },
  {
    isoNumeric: '528',
    isoAlpha2: 'NL',
    nameNL: 'Nederland (Doelwit & Binnenlandse Relais)',
    flag: '🇳🇱',
    category: 'TARGET_HUB',
    categoryLabel: 'Primair Doelwit (NCSC-NL / NIS2 Vitaal)',
    coordinates: [5.2913, 52.1326],
    activeAttacks: 912,
    livePacketsPerSec: 124500,
    c2Nodes: 19,
    severity: 'KRITIEK',
    dominantActors: ['NCSC-NL / CSIRT Verdedigingslinie', 'Binnenlandse Bulletproof VPS Doelwitten'],
    primaryVectors: ['Alle inkomende APT-, Ransomware- & DDoS-vectoren'],
    targetedDutchSectors: ['Haven Rotterdam', 'Schiphol', 'TenneT 380kV', 'Albert Heijn WMS', 'ASML'],
  },
];

interface InteractiveGlobalAttackMapProps {
  threats: ThreatItem[];
  onSelectThreat?: (threat: ThreatItem) => void;
  onNavigateToLiveFeed?: () => void;
}

type MapRegionPreset = 'WORLD' | 'EURASIA' | 'EUROPE' | 'EAST_ASIA' | 'MIDDLE_EAST';
type MapLayerView = 'CHOROPLETH_SPREAD' | 'ATTACK_ARCS' | 'C2_BOTNET_NODES';

export const InteractiveGlobalAttackMap: React.FC<InteractiveGlobalAttackMapProps> = ({
  threats,
  onSelectThreat,
  onNavigateToLiveFeed,
}) => {
  const [countriesData, setCountriesData] = useState<CountryAttackSpread[]>(INITIAL_GLOBAL_SPREAD);
  const [selectedIso, setSelectedIso] = useState<string>('643'); // Default Russia selected
  const [hoveredCountry, setHoveredCountry] = useState<{
    isoNumeric: string;
    name: string;
    data?: CountryAttackSpread;
    x: number;
    y: number;
  } | null>(null);
  const [regionPreset, setRegionPreset] = useState<MapRegionPreset>('WORLD');
  const [layerView, setLayerView] = useState<MapLayerView>('CHOROPLETH_SPREAD');
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<[number, number]>([0, 0]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<[number, number] | null>(null);
  const svgContainerRef = useRef<HTMLDivElement | null>(null);

  // Convert TopoJSON world-atlas countries-110m to GeoJSON features (react-simple-maps style Geographies)
  const worldGeographies = useMemo(() => {
    const rawTopo = worldAtlasData as any;
    const geoCollection = feature(rawTopo, rawTopo.objects.countries) as unknown as GeoJSON.FeatureCollection;
    return geoCollection.features;
  }, []);

  // Dynamically update country attack spread counts in real time and factor in live `threats` prop
  useEffect(() => {
    const interval = setInterval(() => {
      setCountriesData((prev) =>
        prev.map((c) => {
          if (c.isoNumeric === '528') {
            // Netherlands total incoming sum
            return c;
          }
          const deltaAttacks = Math.floor((Math.random() - 0.44) * 9);
          const deltaPackets = Math.floor((Math.random() - 0.45) * 850);
          const nextAttacks = Math.max(12, c.activeAttacks + deltaAttacks);
          const nextPackets = Math.max(1800, c.livePacketsPerSec + deltaPackets);
          return {
            ...c,
            activeAttacks: nextAttacks,
            livePacketsPerSec: nextPackets,
          };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Enrich countries with real-time counts from `threats` prop
  const enrichedCountries = useMemo(() => {
    return countriesData.map((country) => {
      if (country.isoNumeric === '528') return country;
      const matchingThreats = threats.filter((t) => {
        if (country.originFilterKey && t.origin === country.originFilterKey) return true;
        return t.originCountry.toLowerCase().includes(country.nameNL.toLowerCase());
      });
      return {
        ...country,
        activeAttacks: country.activeAttacks + matchingThreats.length * 4,
      };
    });
  }, [countriesData, threats]);

  const countryByIsoMap = useMemo(() => {
    const map = new Map<string, CountryAttackSpread>();
    enrichedCountries.forEach((c) => map.set(c.isoNumeric, c));
    return map;
  }, [enrichedCountries]);

  const totalGlobalAttacks = useMemo(() => {
    return enrichedCountries
      .filter((c) => c.isoNumeric !== '528')
      .reduce((acc, item) => acc + item.activeAttacks, 0);
  }, [enrichedCountries]);

  const totalGlobalPackets = useMemo(() => {
    return enrichedCountries
      .filter((c) => c.isoNumeric !== '528')
      .reduce((acc, item) => acc + item.livePacketsPerSec, 0);
  }, [enrichedCountries]);

  const selectedCountry = useMemo(() => {
    return enrichedCountries.find((c) => c.isoNumeric === selectedIso) || enrichedCountries[0];
  }, [enrichedCountries, selectedIso]);

  // Match active ThreatItems from App.tsx for the selected country
  const matchingCountryThreats = useMemo(() => {
    if (!selectedCountry) return [];
    if (selectedCountry.isoNumeric === '528') {
      return threats.filter((t) => t.isDutchVitalInfra).slice(0, 4);
    }
    return threats
      .filter((t) => {
        if (selectedCountry.originFilterKey && t.origin === selectedCountry.originFilterKey) return true;
        return t.originCountry.toLowerCase().includes(selectedCountry.nameNL.toLowerCase());
      })
      .slice(0, 4);
  }, [threats, selectedCountry]);

  // Configure D3 NaturalEarth1 projection based on region preset & zoom
  const projectionConfig = useMemo(() => {
    switch (regionPreset) {
      case 'EUROPE':
        return { center: [15, 52] as [number, number], scale: 520 };
      case 'EURASIA':
        return { center: [58, 46] as [number, number], scale: 255 };
      case 'EAST_ASIA':
        return { center: [114, 34] as [number, number], scale: 380 };
      case 'MIDDLE_EAST':
        return { center: [48, 31] as [number, number], scale: 460 };
      case 'WORLD':
      default:
        return { center: [18, 22] as [number, number], scale: 162 };
    }
  }, [regionPreset]);

  const projection = useMemo(() => {
    return d3
      .geoNaturalEarth1()
      .center(projectionConfig.center)
      .scale(projectionConfig.scale * zoomScale)
      .translate([440 + panOffset[0], 235 + panOffset[1]]);
  }, [projectionConfig, zoomScale, panOffset]);

  const geoPathGenerator = useMemo(() => {
    return d3.geoPath().projection(projection);
  }, [projection]);

  const graticulePath = useMemo(() => {
    const graticule = d3.geoGraticule10();
    return geoPathGenerator(graticule) || '';
  }, [geoPathGenerator]);

  // Choropleth color scale for active attack count per country
  const getCountryFill = (isoId: string, isSelected: boolean, isHovered: boolean) => {
    if (isoId === '528') {
      return isSelected || isHovered ? '#0284c7' : '#0ea5e9';
    }
    const data = countryByIsoMap.get(isoId);
    if (!data) {
      return isHovered ? '#cbd5e1' : '#e2e8f0';
    }
    const normalized = Math.min(1, Math.max(0.18, data.activeAttacks / 360));
    const baseColor = d3.interpolateYlOrRd(normalized);
    if (isSelected) return '#e11d48';
    if (isHovered) return d3.color(baseColor)?.darker(0.25)?.formatHex() || baseColor;
    return baseColor;
  };

  const handleSelectRegion = (preset: MapRegionPreset) => {
    setRegionPreset(preset);
    setZoomScale(1);
    setPanOffset([0, 0]);
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    dragStartRef.current = [e.clientX - panOffset[0], e.clientY - panOffset[1]];
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    setPanOffset([e.clientX - dragStartRef.current[0], e.clientY - dragStartRef.current[1]]);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const nlProjected = projection([5.2913, 52.1326]);

  const sortedOriginCountries = useMemo(() => {
    return [...enrichedCountries]
      .filter((c) => c.isoNumeric !== '528')
      .sort((a, b) => b.activeAttacks - a.activeAttacks);
  }, [enrichedCountries]);

  return (
    <section
      aria-label="Interactieve Wereldkaart Geografische Spreiding van Aanvallen"
      className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4"
    >
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-slate-200">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 shrink-0">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Interactieve Wereldkaart: Geografische Spreiding van Actieve Aanvallen per Land
              </h2>
              <span className="text-xs font-mono-code font-semibold text-rose-700">
                · {sortedOriginCountries.length} Actieve Herkomst- & Relaislanden
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
              Realtime wereldwijde choropleth-spreiding van statelijke APT-aanvallen, ransomware-clusters en C2-botnetrelais gericht op Nederland.
            </p>
          </div>
        </div>

        {/* Layer & Region Quick Switchers */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Layer Mode Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 font-mono-code text-xs overflow-x-auto max-w-full">
            <button
              onClick={() => setLayerView('CHOROPLETH_SPREAD')}
              className={`px-3 py-1.5 min-h-[36px] rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                layerView === 'CHOROPLETH_SPREAD'
                  ? 'bg-rose-600 text-white font-bold shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              Landen Spreiding
            </button>
            <button
              onClick={() => setLayerView('ATTACK_ARCS')}
              className={`px-3 py-1.5 min-h-[36px] rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                layerView === 'ATTACK_ARCS'
                  ? 'bg-rose-600 text-white font-bold shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              Aanvalsvectoren
            </button>
            <button
              onClick={() => setLayerView('C2_BOTNET_NODES')}
              className={`px-3 py-1.5 min-h-[36px] rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                layerView === 'C2_BOTNET_NODES'
                  ? 'bg-rose-600 text-white font-bold shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              C2 Knooppunten
            </button>
          </div>

          {/* Region Camera Presets */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto max-w-full">
            {(
              [
                { id: 'WORLD', label: 'Wereld' },
                { id: 'EURASIA', label: 'Eurazië' },
                { id: 'EUROPE', label: 'Europa' },
                { id: 'EAST_ASIA', label: 'Oost-Azië' },
                { id: 'MIDDLE_EAST', label: 'Midden-Oosten' },
              ] as Array<{ id: MapRegionPreset; label: string }>
            ).map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectRegion(preset.id)}
                className={`px-2.5 py-1.5 min-h-[36px] rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  regionPreset === preset.id
                    ? 'bg-white text-slate-900 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Composable Interactive World Map (8 cols) + Live Country Ranking & Dossier (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left 8 Cols: Interactive SVG World Map Canvas */}
        <div
          ref={svgContainerRef}
          className="lg:col-span-8 bg-sky-50/70 rounded-xl border border-slate-200 relative overflow-hidden flex flex-col justify-between min-h-[360px] sm:min-h-[440px]"
        >
          {/* Top-left Live Telemetry Overlay */}
          <div className="p-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white/95 z-10 text-xs font-mono-code">
            <div className="flex items-center flex-wrap gap-3">
              <span className="flex items-center gap-1.5 text-rose-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                ACTIEVE AANVALLEN: {totalGlobalAttacks.toLocaleString('nl-NL')}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-sky-800 font-semibold">
                TELEMETRIE: {(totalGlobalPackets / 1000).toFixed(1)}k pkts/sec
              </span>
            </div>
            <span className="text-xs text-slate-600 font-sans">
              Klik op een land om herkomstdata te inspecteren · Sleep om te pannen
            </span>
          </div>

          {/* Floating Zoom Controls (Top Right inside map) */}
          <div className="absolute top-16 right-3 z-20 flex flex-col gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-md">
            <button
              onClick={() => setZoomScale((z) => Math.min(4.5, +(z * 1.3).toFixed(2)))}
              className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Zoom in op kaart"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomScale((z) => Math.max(0.85, +(z / 1.3).toFixed(2)))}
              className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Zoom uit op kaart"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoomScale(1);
                setPanOffset([0, 0]);
              }}
              className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Reset kaartweergave"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Declarative ComposableMap SVG */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            <svg
              viewBox="0 0 880 450"
              className={`w-full h-full select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => {
                handleMouseUp();
                setHoveredCountry(null);
              }}
            >
              <defs>
                <radialGradient id="nl-shield-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Graticule Lat/Lon Grid */}
              <path
                d={graticulePath}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="0.5"
                strokeDasharray="2 2"
                opacity="0.7"
              />

              {/* Geographies Layer (All World Countries) */}
              <g className="rsm-geographies">
                {worldGeographies.map((geo: any, idx: number) => {
                  const rawId = String(geo.id || '').padStart(3, '0');
                  const countrySpread = countryByIsoMap.get(rawId);
                  const isSelected = selectedIso === rawId;
                  const isHovered = hoveredCountry?.isoNumeric === rawId;
                  const dPath = geoPathGenerator(geo) || '';

                  return (
                    <path
                      key={geo.id || idx}
                      d={dPath}
                      fill={getCountryFill(rawId, isSelected, isHovered)}
                      stroke={
                        isSelected
                          ? '#0f172a'
                          : isHovered
                          ? '#ea580c'
                          : countrySpread
                          ? '#64748b'
                          : '#cbd5e1'
                      }
                      strokeWidth={isSelected ? 1.5 : isHovered ? 1.1 : countrySpread ? 0.7 : 0.45}
                      className="transition-colors duration-200 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (countrySpread) {
                          setSelectedIso(rawId);
                        }
                      }}
                      onMouseEnter={(e) => {
                        const rect = svgContainerRef.current?.getBoundingClientRect();
                        const relX = rect ? e.clientX - rect.left : 160;
                        const relY = rect ? e.clientY - rect.top : 100;
                        setHoveredCountry({
                          isoNumeric: rawId,
                          name: countrySpread?.nameNL || geo.properties?.name || 'Onbekend regio',
                          data: countrySpread,
                          x: relX,
                          y: relY,
                        });
                      }}
                    />
                  );
                })}
              </g>

              {/* Live Attack Trajectory Arcs from Active Countries to Netherlands */}
              {(layerView === 'CHOROPLETH_SPREAD' || layerView === 'ATTACK_ARCS') &&
                nlProjected &&
                sortedOriginCountries.map((origin) => {
                  const startPt = projection(origin.coordinates);
                  if (!startPt) return null;

                  const isSelected = selectedIso === origin.isoNumeric;
                  const dx = nlProjected[0] - startPt[0];
                  const dy = nlProjected[1] - startPt[1];
                  const cx = (startPt[0] + nlProjected[0]) / 2 - dy * 0.2;
                  const cy = (startPt[1] + nlProjected[1]) / 2 - Math.abs(dx) * 0.14;
                  const arcPath = `M ${startPt[0]} ${startPt[1]} Q ${cx} ${cy} ${nlProjected[0]} ${nlProjected[1]}`;

                  const strokeColor =
                    origin.severity === 'KRITIEK'
                      ? '#e11d48'
                      : origin.severity === 'HOOG'
                      ? '#d97706'
                      : '#0284c7';

                  return (
                    <g key={`arc-${origin.isoNumeric}`} style={{ pointerEvents: 'none' }}>
                      <path
                        d={arcPath}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={isSelected ? 2.2 : layerView === 'ATTACK_ARCS' ? 1.5 : 1.0}
                        strokeDasharray={isSelected ? '4 2' : '3 3'}
                        opacity={isSelected ? 0.95 : layerView === 'ATTACK_ARCS' ? 0.75 : 0.45}
                      />
                    </g>
                  );
                })}

              {/* Country Markers & Active Attack Counters */}
              {enrichedCountries.map((country) => {
                const pt = projection(country.coordinates);
                if (!pt) return null;

                const isSelected = selectedIso === country.isoNumeric;
                const isNL = country.isoNumeric === '528';
                const markerRadius = isNL
                  ? 7
                  : layerView === 'C2_BOTNET_NODES'
                  ? Math.max(4, Math.min(11, Math.sqrt(country.c2Nodes) * 0.9))
                  : Math.max(3.5, Math.min(10, Math.sqrt(country.activeAttacks) * 0.52));

                const markerColor = isNL
                  ? '#0284c7'
                  : country.severity === 'KRITIEK'
                  ? '#e11d48'
                  : country.severity === 'HOOG'
                  ? '#d97706'
                  : '#ca8a04';

                return (
                  <g
                    key={`marker-${country.isoNumeric}`}
                    transform={`translate(${pt[0]}, ${pt[1]})`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIso(country.isoNumeric);
                    }}
                  >
                    {/* Outer Pulse Ring */}
                    <circle
                      r={markerRadius + (isSelected ? 6 : 3.5)}
                      fill="none"
                      stroke={markerColor}
                      strokeWidth={isSelected ? 1.6 : 1.0}
                      opacity={isSelected ? 0.9 : 0.6}
                    >
                      <animate
                        attributeName="r"
                        values={`${markerRadius + 1};${markerRadius + 8};${markerRadius + 1}`}
                        dur={country.severity === 'KRITIEK' ? '1.8s' : '2.8s'}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.85;0.15;0.85"
                        dur={country.severity === 'KRITIEK' ? '1.8s' : '2.8s'}
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Core Marker Circle */}
                    <circle
                      r={markerRadius}
                      fill={markerColor}
                      stroke="#ffffff"
                      strokeWidth="1.4"
                    />

                    {/* Country Code & Attack Count Badge */}
                    {(isSelected || country.activeAttacks >= 45 || isNL) && (
                      <g transform="translate(0, -11)">
                        <rect
                          x="-29"
                          y="-9.5"
                          width="58"
                          height="13"
                          rx="3.5"
                          fill="#ffffff"
                          fillOpacity="0.95"
                          stroke={isSelected ? '#0f172a' : markerColor}
                          strokeWidth="0.9"
                        />
                        <text
                          x="0"
                          y="-0.8"
                          textAnchor="middle"
                          fill="#0f172a"
                          fontSize="7.5"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {isNL
                            ? '🇳🇱 NL DOEL'
                            : layerView === 'C2_BOTNET_NODES'
                            ? `${country.isoAlpha2}: ${country.c2Nodes} C2`
                            : `${country.isoAlpha2}: ${country.activeAttacks}`}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Floating Hover Tooltip */}
            {hoveredCountry && (
              <div
                style={{
                  left: Math.min(Math.max(12, hoveredCountry.x + 14), 480),
                  top: Math.max(12, hoveredCountry.y - 18),
                }}
                className="pointer-events-none absolute z-30 bg-white border border-slate-300 rounded-xl p-2.5 shadow-xl text-xs max-w-[240px]"
              >
                <div className="flex items-center justify-between gap-2 font-bold text-slate-900">
                  <span>
                    {hoveredCountry.data?.flag || '🌐'} {hoveredCountry.name}
                  </span>
                  {hoveredCountry.data && (
                    <span className="text-xs font-mono-code text-rose-700 font-bold">
                      {hoveredCountry.data.severity}
                    </span>
                  )}
                </div>
                {hoveredCountry.data ? (
                  <div className="mt-1 space-y-0.5 text-xs font-mono-code text-slate-700">
                    <div>
                      Actieve aanvallen:{' '}
                      <strong className="text-slate-900">{hoveredCountry.data.activeAttacks}</strong>
                    </div>
                    <div>
                      C2 / Botnet nodes:{' '}
                      <strong className="text-amber-800">{hoveredCountry.data.c2Nodes} servers</strong>
                    </div>
                    <div className="text-xs text-slate-600 font-sans truncate">
                      {hoveredCountry.data.categoryLabel}
                    </div>
                  </div>
                ) : (
                  <div className="mt-0.5 text-xs text-slate-600">
                    Geen verhoogde APT-oorsprong gedetecteerd
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Choropleth Scale Legend */}
          <div className="p-3 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-sans font-medium text-slate-700">Aanvalsintensiteit:</span>
              <span className="text-slate-500">Laag</span>
              <div
                className="w-24 h-2.5 rounded-sm border border-slate-300"
                style={{
                  background:
                    'linear-gradient(90deg, #ffffcc 0%, #fed976 25%, #fd8d3c 55%, #e31a1c 80%, #800026 100%)',
                }}
              />
              <span className="text-rose-700 font-bold">Kritiek (&gt;250)</span>
            </div>

            <div className="flex items-center flex-wrap gap-3 font-sans font-semibold">
              <span className="flex items-center gap-1 text-sky-800">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                🇳🇱 NL Vitale Sectoren
              </span>
              <span className="flex items-center gap-1 text-rose-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                APT / RaaS Oorsprong
              </span>
              <span className="flex items-center gap-1 text-amber-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                C2 Relais / Botnet
              </span>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Selected Country Intelligence Dossier & Top Countries Leaderboard */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-3">
          {/* Selected Country Detail Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-rose-700 block">
                  Geselecteerd Land Dossier
                </span>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mt-0.5">
                  <span className="text-lg">{selectedCountry.flag}</span>
                  <span>{selectedCountry.nameNL}</span>
                </h3>
                <span className="text-xs text-slate-600">{selectedCountry.categoryLabel}</span>
              </div>

              <span className="text-xs font-mono-code font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                {selectedCountry.severity}
              </span>
            </div>

            {/* Key Live Country Metrics */}
            <div className="grid grid-cols-3 gap-2 font-mono-code text-center">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-xs text-slate-600 block font-sans">Aanvallen</span>
                <span className="text-sm font-extrabold text-slate-900">
                  {selectedCountry.activeAttacks}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-xs text-slate-600 block font-sans">Volume</span>
                <span className="text-sm font-extrabold text-sky-800">
                  {(selectedCountry.livePacketsPerSec / 1000).toFixed(1)}k/s
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-xs text-slate-600 block font-sans">C2 Nodes</span>
                <span className="text-sm font-extrabold text-amber-800">
                  {selectedCountry.c2Nodes}
                </span>
              </div>
            </div>

            {/* Dominant Threat Actors & Targeted NL Sectors */}
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Actieve Dreigingsactoren:</span>
                <div className="font-semibold text-amber-900">
                  {selectedCountry.dominantActors.join(' · ')}
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Geobserveerde Aanvalsvectoren:</span>
                <div className="font-mono-code text-xs text-rose-800">
                  {selectedCountry.primaryVectors.join(' • ')}
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Getroffen Nederlandse Sectoren:</span>
                <div className="text-sky-900 font-semibold">
                  {selectedCountry.targetedDutchSectors.join(', ')}
                </div>
              </div>
            </div>

            {/* Linked Live Incidents from this country */}
            {matchingCountryThreats.length > 0 && (
              <div className="pt-2.5 border-t border-slate-200 space-y-1.5">
                <span className="text-xs font-mono-code font-bold uppercase text-slate-600 block">
                  Gekoppelde Live Incidenten ({matchingCountryThreats.length}):
                </span>
                {matchingCountryThreats.slice(0, 2).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectThreat && onSelectThreat(item)}
                    className="w-full text-left p-2.5 min-h-[42px] rounded-lg bg-white hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{item.title}</div>
                      <div className="text-xs text-slate-600 truncate">
                        🎯 {item.targetVictim} · {item.threatActor}
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-rose-600 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Global Country Ranking List (Click to inspect & highlight on map) */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono-code font-bold uppercase text-slate-800">
                Ranglijst Actieve Aanvallen per Land
              </span>
              <span className="text-xs font-mono-code text-slate-500">Klik voor focus</span>
            </div>

            <div className="space-y-1.5 max-h-[210px] overflow-y-auto pr-1 scrollbar-thin">
              {sortedOriginCountries.map((country, index) => {
                const sharePct =
                  totalGlobalAttacks > 0
                    ? Math.round((country.activeAttacks / totalGlobalAttacks) * 100)
                    : 0;
                const isSelected = selectedIso === country.isoNumeric;

                return (
                  <button
                    key={country.isoNumeric}
                    onClick={() => setSelectedIso(country.isoNumeric)}
                    className={`w-full p-2.5 min-h-[40px] rounded-lg border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 border-rose-400 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-mono-code text-slate-500 w-5 font-semibold">
                        #{index + 1}
                      </span>
                      <span>{country.flag}</span>
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {country.nameNL}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 font-mono-code text-xs">
                      <span className="font-bold text-rose-700">{country.activeAttacks}</span>
                      <span className="text-xs text-slate-500 w-9 text-right">{sharePct}%</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {onNavigateToLiveFeed && (
              <button
                onClick={onNavigateToLiveFeed}
                className="mt-3 w-full py-2 px-3 min-h-[40px] rounded-xl bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Radio className="w-4 h-4" />
                <span>Open volledige internationale incidenten-feed</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
