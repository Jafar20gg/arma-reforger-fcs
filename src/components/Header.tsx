import React from 'react';
import { TerrainId, TerrainConfig, WeaponConfig, BallisticSolution, InterfaceVisibilitySettings } from '../types';
import { 
  Crosshair, 
  Map as MapIcon
} from 'lucide-react';

interface HeaderProps {
  terrains: Record<TerrainId, TerrainConfig>;
  activeTerrainId: TerrainId;
  onSelectTerrain: (id: TerrainId) => void;
  solution?: BallisticSolution;
  selectedWeapon?: WeaponConfig;
  lang: 'en' | 'ar';
  visibility?: InterfaceVisibilitySettings;
}

export const Header: React.FC<HeaderProps> = ({
  terrains,
  activeTerrainId,
  onSelectTerrain,
  solution,
  selectedWeapon,
  lang,
  visibility,
}) => {
  const isSoviet = selectedWeapon?.milSystem === 'SOVIET';
  const menuPos = visibility?.menuButtonPosition || 'top-right';
  const headerPos = visibility?.headerPosition || 'top';
  const headerSize = visibility?.headerSize || 'sm';

  const azMilFormatted = solution 
    ? (isSoviet 
        ? `${String(Math.floor(solution.azimuthMils / 100)).padStart(2, '0')}-${String(solution.azimuthMils % 100).padStart(2, '0')}`
        : `${solution.azimuthMils}`)
    : '----';

  const elMilFormatted = solution && solution.elevationMils !== null
    ? (isSoviet
        ? `${String(Math.floor(solution.elevationMils / 100)).padStart(2, '0')}-${String(solution.elevationMils % 100).padStart(2, '0')}`
        : `${solution.elevationMils}`)
    : '----';

  // Responsive height and sizing: comfortable on phones (>=44px touch-ready)
  const heightClass = headerSize === 'sm'
    ? 'min-h-[44px] h-12 sm:h-12'
    : headerSize === 'lg'
    ? 'min-h-[56px] h-14 sm:h-16'
    : 'min-h-[48px] h-12 sm:h-13';

  const borderClass = headerPos === 'bottom'
    ? 'border-t border-slate-800'
    : 'border-b border-slate-800';

  return (
    <header
      className={`${heightClass} ${borderClass} bg-slate-950/95 backdrop-blur-md px-2 sm:px-4 flex items-center justify-between z-20 shrink-0 gap-2 transition-all overflow-x-auto overflow-y-hidden no-scrollbar`}
      style={{
        // In RTL Arabic, 'top-right' is visually on the far RIGHT of the screen (physical right).
        // Using explicit padding-right / padding-left ensures the 3-dot floating button never overlaps!
        paddingRight: (headerPos === 'top' && menuPos === 'top-right') || (headerPos === 'bottom' && menuPos === 'bottom-right') ? 54 : 8,
        paddingLeft: (headerPos === 'top' && menuPos === 'top-left') || (headerPos === 'bottom' && menuPos === 'bottom-left') ? 54 : 8,
      }}
    >
      {/* Brand & Title (Compact on mobile) */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
          <Crosshair className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div className="shrink-0 leading-tight">
          <h1 className="text-[11px] sm:text-xs md:text-sm font-bold tracking-wider text-white font-mono uppercase whitespace-nowrap">
            <span className="hidden sm:inline">Arma Reforger </span>
            <span className="text-sky-400 font-extrabold">FCS</span>
          </h1>
          <p className="text-[9px] sm:text-[10px] text-slate-400 tracking-tight hidden md:block whitespace-nowrap leading-none mt-0.5">
            {lang === 'ar' 
              ? 'منظومة إدارة النيران وحسابات الهاون التكتيكية'
              : 'Fire Control System & Tactical Artillery Planner'}
          </p>
        </div>
      </div>

      {/* Top Status Bar (Elevation in Degrees, Azimuth, and Ring) - Desktop & Tablet */}
      {(!visibility || visibility.showLiveSolutionPill) && solution && (
        <div className="hidden lg:flex items-center gap-2 font-mono text-[11px] bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-lg shadow-inner shrink-0">
          <span className="text-sky-400 font-bold flex items-center gap-1">
            <span>AZ:</span>
            <span>{azMilFormatted}</span>
            <span className="text-slate-400 text-[10px] font-normal">({solution.azimuthDeg.toFixed(1)}°)</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span>EL:</span>
            <span>{solution.elevationDeg !== null ? `${solution.elevationDeg.toFixed(1)}°` : '---'}</span>
            {solution.elevationMils !== null && (
              <span className="text-slate-400 text-[10px] font-normal">({elMilFormatted} mil)</span>
            )}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-semibold">
            {lang === 'ar' ? `حلقة ${solution.charge}` : `Ring ${solution.charge}`}
          </span>
        </div>
      )}

      {/* Terrain Selector Tabs (Clearly visible, touchable on mobile, never clipped) */}
      {(!visibility || visibility.showTerrainTabs) && (
        <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-lg p-0.5 sm:p-1 gap-1 shrink sm:shrink-0 flex-1 sm:flex-initial max-w-[280px] sm:max-w-none justify-end sm:justify-start">
          {(Object.keys(terrains) as TerrainId[]).map((id) => {
            const terrain = terrains[id];
            const isActive = id === activeTerrainId;
            return (
              <button
                key={id}
                onClick={() => onSelectTerrain(id)}
                className={`min-h-[32px] sm:min-h-[36px] flex-1 sm:flex-initial px-1.5 sm:px-3 py-1 text-[10px] xs:text-[11px] sm:text-xs font-mono font-bold rounded transition-all flex items-center justify-center gap-1 cursor-pointer touch-manipulation active:scale-95 whitespace-nowrap ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 shadow-md font-extrabold ring-1 ring-sky-300'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800'
                }`}
                aria-label={terrain.name}
                title={terrain.name}
              >
                <MapIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 hidden sm:inline-block" />
                <span className="uppercase tracking-wider font-bold">{terrain.name}</span>
                <span className="text-[10px] opacity-75 hidden xl:inline">
                  ({terrain.worldSize === 4096 ? '4.1k' : '12.8k'})
                </span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
