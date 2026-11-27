import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import {
  Radar,
  Crosshair,
  MapPin,
  ShieldCheck,
  Globe2,
  Flame,
  Clock,
} from 'lucide-react';
import { D3ThreatWorldMap, HeatmapTimeRange, TIME_RANGE_PATTERNS } from './D3ThreatWorldMap';

type OriginCountryKey = 'RUSLAND' | 'CHINA' | 'NOORD_KOREA' | 'IRAN';

interface TacticalTarget {
  id: string;
  name: string;
  type: string;
  location: string;
  coords: { x: number; y: number }; // Percentage in SVG (0-100)
  originCountry: OriginCountryKey | 'DARKWEB_SYNDICAAT';
  originCity: string;
  threatActor: string;
  attackVector: string;
  status: 'AANVAL_AFGEWEERD' | 'ONDER_AANVAL' | 'MONITORING';
  blockedAttempts: number;
  attacksPerMin: number;
}

interface OriginCountryHeatmapStat {
  country: OriginCountryKey;
  label: string;
  flag: string;
  entryCoords: { x: number; y: number };
  attacksPerMin: number;
  baseAttacksPerMin: number;
  totalBlocked: number;
  heatScore: number; // 0-100
}

const ENTRY_COORDS_BY_COUNTRY: Record<OriginCountryKey, { x: number; y: number }> = {
  RUSLAND: { x: 92, y: 18 },
  CHINA: { x: 92, y: 86 },
  NOORD_KOREA: { x: 94, y: 52 },
  IRAN: { x: 86, y: 92 },
};

const buildOriginStatsForRange = (range: HeatmapTimeRange): Record<OriginCountryKey, OriginCountryHeatmapStat> => {
  const cfg = TIME_RANGE_PATTERNS[range].countries;
  return {
    RUSLAND: {
      country: 'RUSLAND',
      label: 'Rusland (GRU / LockBit)',
      flag: '🇷🇺',
      entryCoords: ENTRY_COORDS_BY_COUNTRY.RUSLAND,
      attacksPerMin: cfg.RUSLAND.attacksPerMin,
      baseAttacksPerMin: cfg.RUSLAND.baseAttacksPerMin,
      totalBlocked: cfg.RUSLAND.totalBlocked,
      heatScore: cfg.RUSLAND.frequencyScore,
    },
    CHINA: {
      country: 'CHINA',
      label: 'China (MSS / Volt Typhoon)',
      flag: '🇨🇳',
      entryCoords: ENTRY_COORDS_BY_COUNTRY.CHINA,
      attacksPerMin: cfg.CHINA.attacksPerMin,
      baseAttacksPerMin: cfg.CHINA.baseAttacksPerMin,
      totalBlocked: cfg.CHINA.totalBlocked,
      heatScore: cfg.CHINA.frequencyScore,
    },
    NOORD_KOREA: {
      country: 'NOORD_KOREA',
      label: 'Noord-Korea (Lazarus RGB)',
      flag: '🇰🇵',
      entryCoords: ENTRY_COORDS_BY_COUNTRY.NOORD_KOREA,
      attacksPerMin: cfg.NOORD_KOREA.attacksPerMin,
      baseAttacksPerMin: cfg.NOORD_KOREA.baseAttacksPerMin,
      totalBlocked: cfg.NOORD_KOREA.totalBlocked,
      heatScore: cfg.NOORD_KOREA.frequencyScore,
    },
    IRAN: {
      country: 'IRAN',
      label: 'Iran (IRGC Charming Kitten)',
      flag: '🇮🇷',
      entryCoords: ENTRY_COORDS_BY_COUNTRY.IRAN,
      attacksPerMin: cfg.IRAN.attacksPerMin,
      baseAttacksPerMin: cfg.IRAN.baseAttacksPerMin,
      totalBlocked: cfg.IRAN.totalBlocked,
      heatScore: cfg.IRAN.frequencyScore,
    },
  };
};

const TACTICAL_TARGETS: TacticalTarget[] = [
  {
    id: 'target-rotterdam',
    name: 'Haven van Rotterdam (ECT Maasvlakte II)',
    type: 'SCADA / Container Dispatch',
    location: 'Rotterdam, NL',
    coords: { x: 42, y: 55 },
    originCountry: 'CHINA',
    originCity: 'Chengdu (APT41 / Volt Typhoon)',
    threatActor: 'Volt Typhoon',
    attackVector: 'FortiOS Zero-Day & Living-off-the-land',
    status: 'ONDER_AANVAL',
    blockedAttempts: 14280,
    attacksPerMin: 68,
  },
  {
    id: 'target-schiphol',
    name: 'Luchthaven Schiphol IT Infrastructure',
    type: 'Bagage & Vluchtroutering',
    location: 'Haarlemmermeer, NL',
    coords: { x: 46, y: 44 },
    originCountry: 'RUSLAND',
    originCity: 'Sint-Petersburg (GRU / LockBit)',
    threatActor: 'Black Basta Syndicate',
    attackVector: 'Ivanti Connect Secure Exploit',
    status: 'ONDER_AANVAL',
    blockedAttempts: 8940,
    attacksPerMin: 42,
  },
  {
    id: 'target-tennet',
    name: 'TenneT TSO Hoogspanningsnetwerk 380kV',
    type: 'EMS / Dispatch Netbeheer',
    location: 'Arnhem, NL',
    coords: { x: 57, y: 52 },
    originCountry: 'RUSLAND',
    originCity: 'Moskou (Sandworm Eenheid 74455)',
    threatActor: 'Sandworm & LockBit 3.0',
    attackVector: 'Citrix Bleed & IEC 60870-5-104 Probe',
    status: 'ONDER_AANVAL',
    blockedAttempts: 21300,
    attacksPerMin: 56,
  },
  {
    id: 'target-amsix',
    name: 'Amsterdam Internet Exchange (AMS-IX)',
    type: 'Core Telecom & BGP Peering',
    location: 'Science Park Amsterdam, NL',
    coords: { x: 48, y: 41 },
    originCountry: 'CHINA',
    originCity: 'Beijing (MSS Salt Typhoon)',
    threatActor: 'Salt Typhoon',
    attackVector: 'Cisco IOS XE Web UI Backdoor',
    status: 'ONDER_AANVAL',
    blockedAttempts: 32150,
    attacksPerMin: 79,
  },
  {
    id: 'target-maeslant',
    name: 'Rijkswaterstaat Maeslantkering',
    type: 'Stormvloedkering SCADA Sluizen',
    location: 'Hoek van Holland, NL',
    coords: { x: 39, y: 56 },
    originCountry: 'RUSLAND',
    originCity: 'Moskou (GRU Sandworm)',
    threatActor: 'Sandworm',
    attackVector: 'Spear-phishing & PLC Macro Injectie',
    status: 'AANVAL_AFGEWEERD',
    blockedAttempts: 6420,
    attacksPerMin: 28,
  },
  {
    id: 'target-denhaag',
    name: 'Ministerie van Justitie & Defensie MIVD',
    type: 'Regeringsnetwerk & C4I',
    location: 'Den Haag, NL',
    coords: { x: 41, y: 49 },
    originCountry: 'RUSLAND',
    originCity: 'Moskou (APT28 Fancy Bear)',
    threatActor: 'APT28 (Fancy Bear)',
    attackVector: 'Outlook NTLM Hash lekgate',
    status: 'MONITORING',
    blockedAttempts: 18760,
    attacksPerMin: 47,
  },
  {
    id: 'target-albertheijn',
    name: 'Albert Heijn Distributiecentra (Zaandam, Tilburg & Zwolle)',
    type: 'Supermarkt Logistiek & WMS Magazijnautomatisering',
    location: 'Zaandam / Tilburg, NL',
    coords: { x: 47, y: 46 },
    originCountry: 'RUSLAND',
    originCity: 'Sint-Petersburg (Akira / LockBit Syndicate)',
    threatActor: 'Akira & LockBit 3.0',
    attackVector: 'WMS Warehouse Zero-Day & Citrix NetScaler RCE',
    status: 'ONDER_AANVAL',
    blockedAttempts: 38450,
    attacksPerMin: 64,
  },
  {
    id: 'target-asml',
    name: 'ASML Veldhoven & Brainport High Tech Campus',
    type: 'High-Tech EUV Lithografie & Chipmachines',
    location: 'Veldhoven (Eindhoven), NL',
    coords: { x: 53, y: 72 },
    originCountry: 'CHINA',
    originCity: 'Chengdu (APT41 / Salt Typhoon)',
    threatActor: 'APT41 & Salt Typhoon',
    attackVector: 'CI/CD Pipeline Infiltratie & DNS Covert C2',
    status: 'ONDER_AANVAL',
    blockedAttempts: 41200,
    attacksPerMin: 91,
  },
  {
    id: 'target-chemelot',
    name: 'Chemelot Industriepark Geleen & Shell Pernis',
    type: 'Chemische Procesbesturing & Petrochemie DCS',
    location: 'Geleen (Limburg), NL',
    coords: { x: 58, y: 84 },
    originCountry: 'RUSLAND',
    originCity: 'Moskou (Black Basta Syndicate)',
    threatActor: 'Black Basta Syndicate',
    attackVector: 'Modbus TCP Scanner & Ivanti Edge Zero-Day',
    status: 'ONDER_AANVAL',
    blockedAttempts: 24700,
    attacksPerMin: 49,
  },
  {
    id: 'target-amsterdam-crypto',
    name: 'Amsterdam Fintech & Crypto Exchange Hub',
    type: 'Financieel & Blockchain Gateways',
    location: 'Amsterdam Zuidas, NL',
    coords: { x: 49, y: 43 },
    originCountry: 'NOORD_KOREA',
    originCity: 'Pyongyang (Lazarus RGB Bureau 121)',
    threatActor: 'Lazarus Group (RGB)',
    attackVector: 'Supply-Chain NPM Poisoning & BLINDINGCAN Trojan',
    status: 'ONDER_AANVAL',
    blockedAttempts: 31200,
    attacksPerMin: 112,
  },
  {
    id: 'target-rotterdam-pernis',
    name: 'Haven Rotterdam Bunkering & Pernis Olieopslag',
    type: 'Petrochemie & Bunkering SCADA',
    location: 'Pernis / Botlek, NL',
    coords: { x: 40, y: 58 },
    originCountry: 'IRAN',
    originCity: 'Teheran (Charming Kitten IRGC)',
    threatActor: 'Charming Kitten & MuddyWater',
    attackVector: 'BellaCiao Web Shell & Modbus Probes',
    status: 'ONDER_AANVAL',
    blockedAttempts: 19800,
    attacksPerMin: 89,
  },
];

export const GeoThreatRadar: React.FC = () => {
  const [radarMode, setRadarMode] = useState<'D3_WORLD' | 'TACTICAL_GRID'>('D3_WORLD');
  const [timeRange, setTimeRange] = useState<HeatmapTimeRange>('1H');
  const [targets, setTargets] = useState<TacticalTarget[]>(TACTICAL_TARGETS);
  const [selectedTarget, setSelectedTarget] = useState<TacticalTarget>(TACTICAL_TARGETS[0]);
  const [viewFilter, setViewFilter] = useState<'ALL' | OriginCountryKey>('ALL');
  const [showTacticalHeatmap, setShowTacticalHeatmap] = useState<boolean>(true);
  const [originStats, setOriginStats] = useState<Record<OriginCountryKey, OriginCountryHeatmapStat>>(() =>
    buildOriginStatsForRange('1H')
  );

  const heatmapGroupRef = useRef<SVGGElement | null>(null);

  // Sync originStats when timeRange changes
  useEffect(() => {
    setOriginStats(buildOriginStatsForRange(timeRange));
  }, [timeRange]);

  // Dynamically update attack frequencies by origin country in real time
  useEffect(() => {
    const interval = setInterval(() => {
      setOriginStats((prev) => {
        const next = { ...prev };
        (Object.keys(next) as OriginCountryKey[]).forEach((key) => {
          const item = next[key];
          const delta = Math.floor((Math.random() - 0.45) * 14);
          const minRate = Math.floor(item.baseAttacksPerMin * 0.82);
          const maxRate = Math.floor(item.baseAttacksPerMin * 1.25);
          const updatedRate = Math.max(minRate, Math.min(maxRate, item.attacksPerMin + delta));
          const heatScore = Math.min(100, Math.max(25, Math.round((updatedRate / 340) * 100)));
          next[key] = {
            ...item,
            attacksPerMin: updatedRate,
            totalBlocked: item.totalBlocked + Math.floor(updatedRate / 12),
            heatScore,
          };
        });
        return next;
      });

      setTargets((prevTargets) =>
        prevTargets.map((t) => {
          const jitter = Math.floor((Math.random() - 0.42) * 5);
          const nextAttempts = t.blockedAttempts + Math.max(1, Math.floor(t.attacksPerMin / 15));
          const nextRate = Math.max(18, t.attacksPerMin + jitter);
          return {
            ...t,
            blockedAttempts: nextAttempts,
            attacksPerMin: nextRate,
          };
        })
      );
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  // Keep selectedTarget synced with live updates
  const activeSelectedTarget = useMemo(() => {
    return targets.find((t) => t.id === selectedTarget.id) || targets[0];
  }, [targets, selectedTarget.id]);

  const filteredTargets = useMemo(() => {
    return targets.filter((t) => {
      if (viewFilter === 'ALL') return true;
      return t.originCountry === viewFilter;
    });
  }, [targets, viewFilter]);

  const totalOriginAttacksPerMin = useMemo(() => {
    return (Object.values(originStats) as OriginCountryHeatmapStat[]).reduce(
      (sum, s) => sum + s.attacksPerMin,
      0
    );
  }, [originStats]);

  const currentRangeConfig = TIME_RANGE_PATTERNS[timeRange];

  // D3 Sequential Thermal Scale for origin country frequency
  const d3ThermalColor = (score: number) =>
    d3.scaleSequential(d3.interpolateYlOrRd).domain([10, 105])(score);

  // Render D3 Contour Density Heatmap onto the Tactical Grid SVG when active
  useEffect(() => {
    if (radarMode !== 'TACTICAL_GRID' || !heatmapGroupRef.current) return;

    const g = d3.select(heatmapGroupRef.current);
    g.selectAll('*').remove();

    if (!showTacticalHeatmap) return;

    const densityPoints: Array<[number, number, number]> = [];
    const spread = currentRangeConfig.spreadFactor;

    // 1. Add weighted points for each filtered Dutch target node based on origin country frequency
    filteredTargets.forEach((target) => {
      const originKey = target.originCountry as OriginCountryKey;
      const countryStat = originStats[originKey];
      const weight = ((countryStat?.heatScore || 65) * target.attacksPerMin) / 45;

      const offsets = [
        [0, 0, weight * 1.5],
        [-3 * spread, -2 * spread, weight],
        [3 * spread, 2 * spread, weight],
        [-2 * spread, 3 * spread, weight * 0.85],
        [2 * spread, -3 * spread, weight * 0.85],
      ];
      offsets.forEach(([dx, dy, w]) => {
        densityPoints.push([target.coords.x + dx, target.coords.y + dy, w]);
      });
    });

    // 2. Add weighted points at each origin country entry vector on the radar perimeter
    (Object.values(originStats) as OriginCountryHeatmapStat[]).forEach((stat) => {
      if (viewFilter !== 'ALL' && stat.country !== viewFilter) return;
      const w = stat.heatScore * 1.35 * spread;
      densityPoints.push([stat.entryCoords.x, stat.entryCoords.y, w]);
      densityPoints.push([stat.entryCoords.x - 4 * spread, stat.entryCoords.y, w * 0.85]);
      densityPoints.push([stat.entryCoords.x - 2 * spread, stat.entryCoords.y + 3 * spread, w * 0.75]);
    });

    if (densityPoints.length === 0) return;

    const tacticalBandwidth = timeRange === '1H' ? 6.5 : timeRange === '6H' ? 7.5 : timeRange === '24H' ? 8.5 : 9.5;
    const tacticalThresholds = timeRange === '1H' ? 8 : timeRange === '6H' ? 9 : timeRange === '24H' ? 10 : 12;

    const contourGen = d3
      .contourDensity<[number, number, number]>()
      .x((d) => d[0])
      .y((d) => d[1])
      .weight((d) => d[2])
      .size([100, 100])
      .bandwidth(tacticalBandwidth)
      .thresholds(tacticalThresholds);

    const contours = contourGen(densityPoints);
    const geoPath = d3.geoPath();
    const colorScale = d3.scaleSequential(d3.interpolateInferno).domain([0, 0.35]);

    g.selectAll('path.tactical-d3-contour')
      .data(contours)
      .enter()
      .append('path')
      .attr('class', 'tactical-d3-contour')
      .attr('d', (d: any) => geoPath(d) || '')
      .attr('fill', (d: any) => colorScale(d.value))
      .attr('fill-opacity', (_d: any, idx: number) => Math.min(0.52, 0.14 + idx * 0.05))
      .attr('stroke', (d: any) => colorScale(d.value * 1.2))
      .attr('stroke-width', 0.25)
      .attr('stroke-opacity', 0.5);
  }, [radarMode, showTacticalHeatmap, filteredTargets, originStats, viewFilter, timeRange, currentRangeConfig]);

  return (
    <div className="space-y-4">
      {/* Visualizer Mode Navigation & Global Heatmap Time-Range Filter (1h, 6h, 24h, 7d) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 p-2 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 sm:gap-2 w-full md:w-auto">
          <button
            onClick={() => setRadarMode('D3_WORLD')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold transition-all cursor-pointer ${
              radarMode === 'D3_WORLD'
                ? 'bg-rose-600 text-white shadow-sm border border-rose-600'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Globe2 className={`w-4 h-4 shrink-0 ${radarMode === 'D3_WORLD' ? 'text-white' : 'text-rose-600'}`} />
            <span className="hidden sm:inline">🌍 D3.js Wereldkaart & Landen Heatmap</span>
            <span className="sm:hidden">🌍 D3 Heatmap</span>
            <span
              className={`hidden md:inline text-xs px-1.5 py-0.5 rounded font-mono-code ${
                radarMode === 'D3_WORLD'
                  ? 'bg-rose-700 text-white border border-rose-500'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              D3 HEATMAP
            </span>
          </button>

          <button
            onClick={() => setRadarMode('TACTICAL_GRID')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold transition-all cursor-pointer ${
              radarMode === 'TACTICAL_GRID'
                ? 'bg-sky-700 text-white shadow-sm border border-sky-700'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Radar className={`w-4 h-4 shrink-0 ${radarMode === 'TACTICAL_GRID' ? 'text-white' : 'text-sky-600'}`} />
            <span className="hidden sm:inline">🎯 Tactisch Raster + D3 Dichtheids-Heatmap</span>
            <span className="sm:hidden">🎯 NL Raster</span>
          </button>
        </div>

        {/* Time-Range Filter Controls (1h, 6h, 24h, 7d) */}
        <div className="flex items-center justify-between md:justify-end gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono-code">
            <span className="text-xs text-slate-600 flex items-center gap-1 px-1.5 font-sans font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Historie:</span>
            </span>
            {(['1H', '6H', '24H', '7D'] as HeatmapTimeRange[]).map((rk) => {
              const cfg = TIME_RANGE_PATTERNS[rk];
              const isSelected = timeRange === rk;
              return (
                <button
                  key={rk}
                  onClick={() => setTimeRange(rk)}
                  className={`px-2.5 py-1.5 min-h-[34px] rounded-lg text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white font-bold shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                  }`}
                  title={cfg.fullLabel}
                >
                  {rk.toLowerCase()}
                </button>
              );
            })}
          </div>

          <div className="hidden xl:flex items-center gap-1.5 text-xs font-mono-code font-semibold text-slate-700 pr-2">
            <Flame className="w-4 h-4 text-orange-600 animate-pulse" />
            <span>{totalOriginAttacksPerMin} AANV/M ({currentRangeConfig.shortLabel})</span>
          </div>
        </div>
      </div>

      {radarMode === 'D3_WORLD' ? (
        <D3ThreatWorldMap timeRange={timeRange} onTimeRangeChange={setTimeRange} />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 border-b border-slate-200 gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 shrink-0">
                <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span>Tactische Cyberradar: D3 Aanvalsfrequentie Heatmap ({currentRangeConfig.fullLabel})</span>
                  <span className="text-xs font-mono-code font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded animate-pulse">
                    VENSTER: {timeRange}
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  {currentRangeConfig.summary}
                </p>
              </div>
            </div>

            {/* View toggles */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setShowTacticalHeatmap(!showTacticalHeatmap)}
                className={`px-3 py-1.5 min-h-[38px] rounded-xl text-xs font-mono-code font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  showTacticalHeatmap
                    ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-sm'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900'
                }`}
              >
                <Flame className="w-4 h-4 text-orange-600" />
                <span>D3 Heatmap: {showTacticalHeatmap ? 'AAN' : 'UIT'}</span>
              </button>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs shrink-0 overflow-x-auto scrollbar-none max-w-full">
                <button
                  onClick={() => setViewFilter('ALL')}
                  className={`px-2.5 py-1.5 min-h-[36px] rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    viewFilter === 'ALL' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  Alle ({totalOriginAttacksPerMin}/m)
                </button>
                <button
                  onClick={() => setViewFilter('RUSLAND')}
                  className={`px-2.5 py-1.5 min-h-[36px] rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    viewFilter === 'RUSLAND' ? 'bg-rose-50 text-rose-800 font-bold border border-rose-300' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span>🇷🇺</span> Rusland ({originStats.RUSLAND.attacksPerMin}/m)
                </button>
                <button
                  onClick={() => setViewFilter('CHINA')}
                  className={`px-2.5 py-1.5 min-h-[36px] rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    viewFilter === 'CHINA' ? 'bg-amber-50 text-amber-900 font-bold border border-amber-300' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span>🇨🇳</span> China ({originStats.CHINA.attacksPerMin}/m)
                </button>
                <button
                  onClick={() => setViewFilter('NOORD_KOREA')}
                  className={`px-2.5 py-1.5 min-h-[36px] rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    viewFilter === 'NOORD_KOREA' ? 'bg-rose-50 text-rose-800 font-bold border border-rose-300' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span>🇰🇵</span> Noord-Korea ({originStats.NOORD_KOREA.attacksPerMin}/m)
                </button>
                <button
                  onClick={() => setViewFilter('IRAN')}
                  className={`px-2.5 py-1.5 min-h-[36px] rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    viewFilter === 'IRAN' ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span>🇮🇷</span> Iran ({originStats.IRAN.attacksPerMin}/m)
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic D3 Origin Country Frequency Distribution Bar */}
          <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code text-slate-600 mb-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-600" />
                D3 AANVALSFREQUENTIE VERDELING PER HERKOMSTLAND
              </span>
              <span className="text-orange-800 font-bold">
                Totaal: {totalOriginAttacksPerMin} aanvallen / minuut
              </span>
            </div>

            {/* Proportional Stacked D3 Thermal Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200 border border-slate-300">
              {(Object.values(originStats) as OriginCountryHeatmapStat[]).map((stat) => {
                const widthPct =
                  totalOriginAttacksPerMin > 0
                    ? (stat.attacksPerMin / totalOriginAttacksPerMin) * 100
                    : 25;
                return (
                  <div
                    key={stat.country}
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: d3ThermalColor(stat.heatScore),
                    }}
                    className="h-full transition-all duration-500"
                    title={`${stat.label}: ${stat.attacksPerMin} aanvallen/min`}
                  />
                );
              })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2.5">
              {(Object.values(originStats) as OriginCountryHeatmapStat[]).map((stat) => {
                const share =
                  totalOriginAttacksPerMin > 0
                    ? Math.round((stat.attacksPerMin / totalOriginAttacksPerMin) * 100)
                    : 0;
                const color = d3ThermalColor(stat.heatScore);
                return (
                  <button
                    key={stat.country}
                    onClick={() => setViewFilter(viewFilter === stat.country ? 'ALL' : stat.country)}
                    className={`p-2.5 min-h-[44px] rounded-lg border text-left transition-all cursor-pointer ${
                      viewFilter === stat.country
                        ? 'bg-orange-50 border-orange-400 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 truncate">
                        {stat.flag} {stat.country.replace('_', '-')}
                      </span>
                      <span className="font-mono-code font-bold text-xs text-rose-700">
                        {share}%
                      </span>
                    </div>
                    <div className="text-xs font-mono-code font-extrabold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span>{stat.attacksPerMin} <span className="text-xs font-normal text-slate-600">aanv/m</span></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Grid: Interactive Radar Map + Telemetry Card */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Tactical Radar Display (7 cols) */}
            <div className="lg:col-span-7 bg-sky-50/70 rounded-2xl border border-slate-200 p-4 relative overflow-hidden cyber-grid-bg min-h-[380px] flex flex-col justify-between">
              {/* Radar background grid & rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-35">
                <div className="w-[340px] h-[340px] rounded-full border border-rose-300"></div>
                <div className="w-[240px] h-[240px] rounded-full border border-rose-300 absolute"></div>
                <div className="w-[140px] h-[140px] rounded-full border border-rose-300 absolute"></div>
                <div className="w-full h-[1px] bg-rose-200 absolute"></div>
                <div className="h-full w-[1px] bg-rose-200 absolute"></div>
              </div>

              {/* Top radar telemetry banner */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code text-slate-700 bg-white/90 px-3 py-2 rounded-xl border border-slate-200">
                <span className="flex items-center gap-1.5 text-rose-700 font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                  RADAR FREQ: 9.4 GHz • D3 HEATMAP {showTacticalHeatmap ? 'ACTIEF' : 'UIT'}
                </span>
                <span className="text-emerald-700 font-bold">SENSOR NL-SOC-01: ACTIEF</span>
              </div>

              {/* Interactive Tactical SVG Map with D3 Contour Density Layer */}
              <div className="relative z-10 my-4 h-[290px] w-full">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <filter id="tactical-heat-blur" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="2.2" />
                    </filter>
                    {(Object.values(originStats) as OriginCountryHeatmapStat[]).map((stat) => {
                      const c = d3ThermalColor(stat.heatScore);
                      return (
                        <radialGradient key={`grad-${stat.country}`} id={`tactical-rad-${stat.country}`} cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor={c} stopOpacity="0.6" />
                          <stop offset="55%" stopColor={c} stopOpacity="0.22" />
                          <stop offset="100%" stopColor={c} stopOpacity="0" />
                        </radialGradient>
                      );
                    })}
                  </defs>

                  {/* Simplified Stylized Map Outlines for Netherlands/Europe */}
                  <path
                    d="M 28 30 Q 35 25 45 28 T 65 35 T 75 48 T 60 70 T 35 68 Z"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                  {/* Netherlands perimeter outline zoom */}
                  <path
                    d="M 36 38 L 48 35 L 56 42 L 60 55 L 52 64 L 40 62 L 35 50 Z"
                    fill="#ffffff"
                    fillOpacity="0.85"
                    stroke="#64748b"
                    strokeWidth="1.2"
                  />

                  {/* D3 Contour Density Heatmap Layer */}
                  <g ref={heatmapGroupRef} className="d3-tactical-heatmap-layer" style={{ pointerEvents: 'none' }} />

                  {/* Radial Thermal Hotspots at Origin Entry Vectors */}
                  {showTacticalHeatmap &&
                    (Object.values(originStats) as OriginCountryHeatmapStat[]).map((stat) => {
                      if (viewFilter !== 'ALL' && stat.country !== viewFilter) return null;
                      const radius = 8 + (stat.heatScore / 100) * 10;
                      return (
                        <circle
                          key={`origin-heat-${stat.country}`}
                          cx={stat.entryCoords.x}
                          cy={stat.entryCoords.y}
                          r={radius}
                          fill={`url(#tactical-rad-${stat.country})`}
                          filter="url(#tactical-heat-blur)"
                        />
                      );
                    })}

                  {/* Threat Origin Labels with Live Frequency (East / Far East) */}
                  <text x="70" y="14" fill="#be123c" fontSize="3.1" fontFamily="monospace" fontWeight="bold">
                    🇷🇺 RUSLAND ({originStats.RUSLAND.attacksPerMin}/m)
                  </text>
                  <text x="70" y="50" fill="#9f1239" fontSize="2.9" fontFamily="monospace" fontWeight="bold">
                    🇰🇵 N-KOREA ({originStats.NOORD_KOREA.attacksPerMin}/m)
                  </text>
                  <text x="70" y="84" fill="#b45309" fontSize="3.1" fontFamily="monospace" fontWeight="bold">
                    🇨🇳 CHINA ({originStats.CHINA.attacksPerMin}/m)
                  </text>
                  <text x="68" y="95" fill="#047857" fontSize="2.9" fontFamily="monospace" fontWeight="bold">
                    🇮🇷 IRAN ({originStats.IRAN.attacksPerMin}/m)
                  </text>

                  {/* Animated Attack Trajectory Lines */}
                  {filteredTargets.map((target) => {
                    const originKey = (target.originCountry in originStats
                      ? target.originCountry
                      : 'RUSLAND') as OriginCountryKey;
                    const originStat = originStats[originKey];
                    const startX = originStat.entryCoords.x;
                    const startY = originStat.entryCoords.y;
                    const strokeColor = showTacticalHeatmap
                      ? d3ThermalColor(originStat.heatScore)
                      : target.originCountry === 'RUSLAND'
                      ? '#e11d48'
                      : target.originCountry === 'CHINA'
                      ? '#d97706'
                      : target.originCountry === 'NOORD_KOREA'
                      ? '#be123c'
                      : '#059669';

                    return (
                      <g key={`traj-${target.id}`}>
                        <line
                          x1={startX}
                          y1={startY}
                          x2={target.coords.x}
                          y2={target.coords.y}
                          stroke={strokeColor}
                          strokeWidth="0.9"
                          strokeDasharray="3 2"
                          opacity="0.75"
                        />
                        <circle
                          cx={(startX + target.coords.x) / 2}
                          cy={(startY + target.coords.y) / 2}
                          r="0.95"
                          fill={strokeColor}
                        >
                          <animate
                            attributeName="opacity"
                            values="0.25;1;0.25"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </g>
                    );
                  })}

                  {/* Target Infrastructure Nodes */}
                  {filteredTargets.map((target) => {
                    const isSelected = activeSelectedTarget.id === target.id;
                    const originKey = (target.originCountry in originStats
                      ? target.originCountry
                      : 'RUSLAND') as OriginCountryKey;
                    const heatHex = d3ThermalColor(originStats[originKey].heatScore);

                    return (
                      <g
                        key={target.id}
                        onClick={() => setSelectedTarget(target)}
                        className="cursor-pointer"
                      >
                        {/* Pulsing ring around node */}
                        <circle
                          cx={target.coords.x}
                          cy={target.coords.y}
                          r={isSelected ? 4.5 : 3}
                          fill="none"
                          stroke={showTacticalHeatmap ? heatHex : '#e11d48'}
                          strokeWidth={isSelected ? '1.5' : '0.85'}
                          opacity="0.85"
                        >
                          <animate
                            attributeName="r"
                            values="2.5;5;2.5"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        {/* Node center point */}
                        <circle
                          cx={target.coords.x}
                          cy={target.coords.y}
                          r="1.9"
                          fill={isSelected ? '#0f172a' : heatHex}
                          stroke="#ffffff"
                          strokeWidth="0.5"
                        />
                        {/* Node label */}
                        <text
                          x={target.coords.x + 3}
                          y={target.coords.y + 1}
                          fill="#0f172a"
                          fontSize="2.5"
                          fontFamily="monospace"
                          fontWeight={isSelected ? 'bold' : '600'}
                        >
                          {target.location.split(',')[0]} ({target.attacksPerMin}/m)
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Bottom radar status summary */}
              <div className="relative z-10 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs font-mono-code text-slate-600 bg-white/90 px-3 py-2 rounded-xl">
                <span>Klik op een knooppunt of land voor diepgaande telemetrie</span>
                <span className="text-rose-700 font-bold">Actieve Knooppunten: {filteredTargets.length}</span>
              </div>
            </div>

            {/* Target Details Telemetry Card (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                    <Crosshair className="w-4 h-4 text-rose-600" />
                    Target Telemetrie Dossier
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono-code font-bold bg-rose-50 text-rose-800 border border-rose-200 animate-pulse">
                    {activeSelectedTarget.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {activeSelectedTarget.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{activeSelectedTarget.location} • <strong className="text-slate-800">{activeSelectedTarget.type}</strong></span>
                  </p>
                </div>

                {/* Attack telemetry breakdown */}
                <div className="mt-5 space-y-3">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="text-xs text-slate-500 font-medium">Oorsprong & Staatsinlichtingendienst:</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 flex items-center justify-between gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span>
                          {activeSelectedTarget.originCountry === 'RUSLAND'
                            ? '🇷🇺 Rusland'
                            : activeSelectedTarget.originCountry === 'CHINA'
                            ? '🇨🇳 China'
                            : activeSelectedTarget.originCountry === 'NOORD_KOREA'
                            ? '🇰🇵 Noord-Korea'
                            : activeSelectedTarget.originCountry === 'IRAN'
                            ? '🇮🇷 Iran'
                            : '🏴‍☠️ Syndicaat'}
                        </span>
                        <span className="text-rose-700 font-mono-code">({activeSelectedTarget.originCity})</span>
                      </div>
                      <span className="text-xs font-mono-code text-orange-700 font-bold">
                        {activeSelectedTarget.attacksPerMin} aanv/min
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="text-xs text-slate-500 font-medium">Dreigingsactor / APT Groepering:</div>
                    <div className="text-sm font-bold text-amber-900 mt-0.5">
                      {activeSelectedTarget.threatActor}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="text-xs text-slate-500 font-medium">Geobserveerde Aanvalsvector:</div>
                    <div className="text-xs sm:text-sm font-mono-code font-semibold text-rose-800 mt-0.5">
                      {activeSelectedTarget.attackVector}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-emerald-800 font-medium">Geblokkeerde Kwaadwillige Pakketten:</div>
                      <div className="text-base font-mono-code font-extrabold text-emerald-900 mt-0.5">
                        {activeSelectedTarget.blockedAttempts.toLocaleString('nl-NL')} pogingen
                      </div>
                    </div>
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Sensor Integriteit: 100% OK</span>
                <span className="text-amber-800 font-mono-code font-semibold">NCSC CSIRT Gemonitord</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

