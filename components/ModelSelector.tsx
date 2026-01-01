import React, { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';
import { 
    IModel, IProvider, ICapability, IDomain, IUseCase, ITag, 
    IFineTuningJob, IDeploymentConfig, IExperiment, IDataset, ITool, IAgenticWorkflow,
    ModelFilterOptions, ModelSortOptions, IModelService 
} from '../types';
import { MockModelService } from '../services/modelService';

// --- Context & Provider ---
export interface ModelUniverseContextType {
    selectedModelId: string | null;
    setSelectedModelId: (id: string | null) => void;
    models: IModel[];
    providers: IProvider[];
    capabilities: ICapability[];
    domains: IDomain[];
    useCases: IUseCase[];
    tags: ITag[];
    loadingModels: boolean;
    loadingMetadata: boolean;
    filters: ModelFilterOptions;
    setFilters: React.Dispatch<React.SetStateAction<ModelFilterOptions>>;
    sort: ModelSortOptions;
    setSort: React.Dispatch<React.SetStateAction<ModelSortOptions>>;
    refreshModels: () => void;
}

export const ModelUniverseContext = createContext<ModelUniverseContextType | undefined>(undefined);

export const useModelUniverse = () => {
    const context = useContext(ModelUniverseContext);
    if (!context) throw new Error('useModelUniverse must be used within a ModelUniverseProvider');
    return context;
};

export const ModelUniverseProvider: React.FC<React.PropsWithChildren<{ service: IModelService }>> = ({ children, service }) => {
    const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
    const [models, setModels] = useState<IModel[]>([]);
    const [providers, setProviders] = useState<IProvider[]>([]);
    const [capabilities, setCapabilities] = useState<ICapability[]>([]);
    const [domains, setDomains] = useState<IDomain[]>([]);
    const [useCases, setUseCases] = useState<IUseCase[]>([]);
    const [tags, setTags] = useState<ITag[]>([]);
    const [loadingModels, setLoadingModels] = useState(true);
    const [loadingMetadata, setLoadingMetadata] = useState(true);
    const [filters, setFilters] = useState<ModelFilterOptions>({});
    const [sort, setSort] = useState<ModelSortOptions>({ field: 'displayName', direction: 'asc' });
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refreshModels = useCallback(() => setRefreshTrigger(prev => prev + 1), []);

    useEffect(() => {
        const fetchMetadata = async () => {
            setLoadingMetadata(true);
            try {
                const [provs, caps, doms, uses, tgs] = await Promise.all([
                    service.getProviders(),
                    service.getCapabilities(),
                    service.getDomains(),
                    service.getUseCases(),
                    service.getTags(),
                ]);
                setProviders(provs);
                setCapabilities(caps);
                setDomains(doms);
                setUseCases(uses);
                setTags(tgs);
            } catch (error) {
                console.error("Failed to fetch model metadata:", error);
            } finally {
                setLoadingMetadata(false);
            }
        };
        fetchMetadata();
    }, [service]);

    useEffect(() => {
        const fetchModels = async () => {
            setLoadingModels(true);
            try {
                const fetchedModels = await service.getModels(filters, sort);
                setModels(fetchedModels);
            } catch (error) {
                console.error("Failed to fetch models:", error);
            } finally {
                setLoadingModels(false);
            }
        };
        fetchModels();
    }, [service, filters, sort, refreshTrigger]);

    const value = useMemo(() => ({
        selectedModelId, setSelectedModelId, models, providers, capabilities, domains, useCases, tags,
        loadingModels, loadingMetadata, filters, setFilters, sort, setSort, refreshModels,
    }), [selectedModelId, models, providers, capabilities, domains, useCases, tags, loadingModels, loadingMetadata, filters, sort, refreshModels]);

    return <ModelUniverseContext.Provider value={value}>{children}</ModelUniverseContext.Provider>;
};

// --- Reusable Components ---
export const Button: React.FC<React.PropsWithChildren<{ onClick?: () => void; className?: string; disabled?: boolean; variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon'; icon?: string; }>> = ({ children, onClick, className = '', disabled, variant = 'primary', icon }) => {
    let baseStyle = 'px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 flex items-center justify-center';
    const variantStyles = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50',
        secondary: 'bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-50 border border-gray-600',
        danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
        ghost: 'p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200',
        icon: 'w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200',
    };
    return (
        <button onClick={onClick} className={`${baseStyle} ${variantStyles[variant]} ${className}`} disabled={disabled}>
            {icon && <span className="material-icons mr-2 text-lg">{icon}</span>}
            {children}
        </button>
    );
};

export const TagChip: React.FC<{ tag: ITag; onClick?: (tag: ITag) => void; removable?: boolean }> = ({ tag, onClick, removable }) => (
    <span
        style={{ backgroundColor: tag.color || '#4b5563', color: 'white' }}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 mb-2 shadow-sm ${onClick ? 'cursor-pointer hover:opacity-90' : ''}`}
        onClick={() => onClick && onClick(tag)}
    >
        {tag.name}
        {removable && (
            <button className="ml-1.5 -mr-0.5 h-4 w-4 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30" onClick={(e) => { e.stopPropagation(); onClick && onClick(tag); }}>
                <span className="material-icons text-[10px]">close</span>
            </button>
        )}
    </span>
);

export const StarRating: React.FC<{ rating?: number; reviewCount?: number; maxStars?: number }> = ({ rating, reviewCount, maxStars = 5 }) => {
    if (rating === undefined || rating === null) return null;
    const clampedRating = Math.max(0, Math.min(maxStars, rating));
    const fullStars = Math.floor(clampedRating);
    const hasHalfStar = clampedRating % 1 !== 0;
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center text-sm text-yellow-500">
            {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`} className="material-icons text-base">star</span>)}
            {hasHalfStar && <span className="material-icons text-base">star_half</span>}
            {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="material-icons text-base">star_border</span>)}
            {reviewCount !== undefined && <span className="ml-1 text-gray-400 text-xs">({reviewCount})</span>}
        </div>
    );
};

export const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
    </div>
);

export const InfoCard: React.FC<{ title: string; items: { id: string; name: string; icon?: string; color?: string; }[] }> = ({ title, items }) => {
    if (!items || items.length === 0) return null;
    return (
        <div className="mb-6">
            <h4 className="font-semibold text-gray-200 mb-2 uppercase text-xs tracking-wider">{title}</h4>
            <div className="flex flex-wrap gap-2">
                {items.map(item => (
                    <div key={item.id} className="flex items-center bg-gray-700/50 rounded-md px-2 py-1 text-xs border border-gray-600/50 text-gray-300">
                        {item.icon && <span className="material-icons text-sm mr-1.5 text-gray-400">{item.icon}</span>}
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Main Components ---

const FilterSection: React.FC<{ title: string; children: React.ReactNode; isOpenDefault?: boolean }> = ({ title, children, isOpenDefault = true }) => {
    const [isOpen, setIsOpen] = useState(isOpenDefault);
    return (
        <div className="border-b border-gray-800 py-4 last:border-0">
            <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between text-left mb-2 group">
                <h4 className="text-sm font-semibold text-gray-300 group-hover:text-indigo-400 transition-colors">{title}</h4>
                <span className={`material-icons text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {isOpen && <div className="mt-2 space-y-1">{children}</div>}
        </div>
    );
};

export const ModelFilterSidebar: React.FC = () => {
    const { filters, setFilters, providers, capabilities, domains, useCases, loadingMetadata } = useModelUniverse();
    const [localSearch, setLocalSearch] = useState(filters.searchTerm || '');

    useEffect(() => {
        const handler = setTimeout(() => {
            if (localSearch !== filters.searchTerm) setFilters(prev => ({ ...prev, searchTerm: localSearch }));
        }, 300);
        return () => clearTimeout(handler);
    }, [localSearch, filters.searchTerm, setFilters]);

    const handleMultiSelect = (key: keyof ModelFilterOptions, id: string) => {
        setFilters(prev => {
            const current = (prev[key] as string[]) || [];
            return { ...prev, [key]: current.includes(id) ? current.filter(x => x !== id) : [...current, id] };
        });
    };

    if (loadingMetadata) return <div className="w-80 p-6 bg-gray-900 border-r border-gray-800 flex items-center justify-center"><LoadingSpinner /></div>;

    return (
        <aside className="w-80 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
            <div className="p-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
                <div className="relative">
                    <span className="material-icons absolute left-3 top-2.5 text-gray-500">search</span>
                    <input 
                        type="text" 
                        placeholder="Search models..." 
                        className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 border border-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <FilterSection title="Providers">
                    {providers.map(p => (
                        <label key={p.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-1.5 rounded transition-colors">
                            <input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500" 
                                checked={(filters.providerIds || []).includes(p.id)} onChange={() => handleMultiSelect('providerIds', p.id)} />
                            <span className="text-sm text-gray-400">{p.name}</span>
                        </label>
                    ))}
                </FilterSection>

                <FilterSection title="Capabilities">
                    {capabilities.map(c => (
                        <label key={c.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-1.5 rounded transition-colors">
                            <input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-indigo-600" 
                                checked={(filters.capabilityIds || []).includes(c.id)} onChange={() => handleMultiSelect('capabilityIds', c.id)} />
                            <div className="flex items-center">
                                {c.icon && <span className="material-icons text-sm text-gray-500 mr-2">{c.icon}</span>}
                                <span className="text-sm text-gray-400">{c.name}</span>
                            </div>
                        </label>
                    ))}
                </FilterSection>

                <FilterSection title="Domains" isOpenDefault={false}>
                    {domains.map(d => (
                        <label key={d.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-1.5 rounded transition-colors">
                            <input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-indigo-600" 
                                checked={(filters.domainIds || []).includes(d.id)} onChange={() => handleMultiSelect('domainIds', d.id)} />
                            <span className="text-sm text-gray-400">{d.name}</span>
                        </label>
                    ))}
                </FilterSection>
                
                 <FilterSection title="Use Cases" isOpenDefault={false}>
                    {useCases.map(u => (
                        <label key={u.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-1.5 rounded transition-colors">
                            <input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-indigo-600" 
                                checked={(filters.useCaseIds || []).includes(u.id)} onChange={() => handleMultiSelect('useCaseIds', u.id)} />
                            <span className="text-sm text-gray-400 truncate" title={u.name}>{u.name}</span>
                        </label>
                    ))}
                </FilterSection>

                <div className="pt-4 mt-2 border-t border-gray-800">
                     <button onClick={() => setFilters({})} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium w-full text-center py-2 hover:bg-gray-800 rounded">
                         Reset All Filters
                     </button>
                </div>
            </div>
        </aside>
    );
};

const ModelCard: React.FC<{ model: IModel; onClick: () => void }> = ({ model, onClick }) => {
    return (
        <div onClick={onClick} className="group bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-700 p-1.5 flex items-center justify-center border border-gray-600">
                        {model.provider.logoUrl ? (
                            <img src={model.provider.logoUrl} alt={model.provider.name} className="w-full h-full object-contain opacity-90" />
                        ) : (
                            <span className="text-xl font-bold text-gray-500">{model.provider.name[0]}</span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-100 leading-tight group-hover:text-indigo-400 transition-colors">{model.displayName}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{model.provider.name}</p>
                    </div>
                </div>
                <div className="text-right">
                    <StarRating rating={model.rating} reviewCount={model.reviewCount} />
                </div>
            </div>

            <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-grow leading-relaxed">
                {model.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
                {model.tags.slice(0, 3).map(tag => (
                    <span key={tag.id} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-300 border border-gray-600/50">{tag.name}</span>
                ))}
                {model.tags.length > 3 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-400 border border-gray-600/50">+{model.tags.length - 3}</span>}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50 mt-auto">
                <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <span className="flex items-center" title="Cost per 1M Input Tokens">
                        <span className="material-icons text-sm mr-1 text-green-500">monetization_on</span>
                        {model.pricing.inputTokenCostPerMillion ? `$${model.pricing.inputTokenCostPerMillion}` : 'Free'}
                    </span>
                    <span className="flex items-center" title="Latency P50">
                        <span className="material-icons text-sm mr-1 text-blue-500">speed</span>
                        {model.performance.latencyMs.p50}ms
                    </span>
                </div>
                <span className="material-icons text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all">arrow_forward</span>
            </div>
        </div>
    );
};

const ModelDetailsPanel: React.FC<{ model: IModel; onClose: () => void }> = ({ model, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');
    
    // Using mock service data getters - in a real app these would be fetched
    const [jobs, setJobs] = useState<IFineTuningJob[]>([]);
    const [deployments, setDeployments] = useState<IDeploymentConfig[]>([]);

    useEffect(() => {
        MockModelService.getFineTuningJobs(model.id).then(setJobs);
        MockModelService.getDeployments(model.id).then(setDeployments);
    }, [model.id]);

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'technical', label: 'Technical Specs' },
        { id: 'fine-tuning', label: 'Fine-tuning', hidden: !model.isCustomizable },
        { id: 'deployments', label: 'Deployments' },
        { id: 'code', label: 'Integration' }
    ].filter(t => !t.hidden);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-900 w-full max-w-5xl h-[90vh] rounded-2xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-900">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-lg p-2 flex items-center justify-center">
                            {model.provider.logoUrl ? <img src={model.provider.logoUrl} alt="" /> : <span className="text-2xl font-bold text-gray-800">{model.provider.name[0]}</span>}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-100">{model.displayName}</h2>
                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                                <span>{model.provider.name}</span>
                                <span>•</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${model.status === 'available' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{model.status}</span>
                                <span>•</span>
                                <span>v{model.currentVersion.version}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                         {model.apiReferenceUrl && (
                             <a href={model.apiReferenceUrl} target="_blank" rel="noreferrer" className="hidden sm:flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors">
                                 <span className="material-icons text-sm mr-2">code</span>
                                 API Docs
                             </a>
                         )}
                        <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
                            <span className="material-icons">close</span>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-800 bg-gray-900/50 px-6 overflow-x-auto custom-scrollbar-horizontal">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-900">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <section>
                                    <h3 className="text-lg font-semibold text-gray-100 mb-3">Description</h3>
                                    <p className="text-gray-300 leading-relaxed text-sm">{model.longDescription || model.description}</p>
                                </section>
                                
                                <section>
                                    <h3 className="text-lg font-semibold text-gray-100 mb-3">Recommended Use Cases</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {model.useCases.slice(0, 4).map(uc => (
                                            <div key={uc.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                                <h4 className="font-semibold text-gray-200 text-sm">{uc.name}</h4>
                                                <p className="text-xs text-gray-400 mt-1">{uc.description}</p>
                                                {uc.exampleQueries && (
                                                    <div className="mt-2 text-xs italic text-gray-500 border-l-2 border-gray-600 pl-2">
                                                        "{uc.exampleQueries[0]}"
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                                    <h3 className="text-sm font-semibold text-gray-200 mb-4 uppercase tracking-wider">Metrics</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">Rating</span>
                                            <StarRating rating={model.rating} reviewCount={model.reviewCount} />
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">Latency (P50)</span>
                                            <span className="text-gray-200 font-mono">{model.performance.latencyMs.p50}ms</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">Throughput</span>
                                            <span className="text-gray-200 font-mono">{model.performance.throughputTokensPerSecond.toLocaleString()} t/s</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">Context Window</span>
                                            <span className="text-gray-200">128k - 1M</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                                    <h3 className="text-sm font-semibold text-gray-200 mb-4 uppercase tracking-wider">Pricing (USD)</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Input (1M)</span>
                                            <span className="text-gray-200 font-mono">${model.pricing.inputTokenCostPerMillion}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Output (1M)</span>
                                            <span className="text-gray-200 font-mono">${model.pricing.outputTokenCostPerMillion}</span>
                                        </div>
                                        {model.pricing.freeTierAvailable && (
                                            <div className="mt-2 pt-2 border-t border-gray-700 text-center">
                                                <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-medium">Free Tier Available</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'technical' && (
                        <div className="space-y-8">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InfoCard title="Capabilities" items={model.capabilities} />
                                    <InfoCard title="Domains" items={model.domains} />
                                </div>
                                <div>
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-200 mb-2 uppercase text-xs tracking-wider">Modalities</h4>
                                        <div className="flex gap-4">
                                            <div>
                                                <span className="text-xs text-gray-400 block mb-1">Input</span>
                                                <div className="flex gap-1">
                                                    {model.inputModalities.map(m => <span key={m} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700 capitalize">{m}</span>)}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-400 block mb-1">Output</span>
                                                <div className="flex gap-1">
                                                    {model.outputModalities.map(m => <span key={m} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700 capitalize">{m}</span>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-200 mb-2 uppercase text-xs tracking-wider">Safety Scores</h4>
                                        <div className="space-y-2">
                                            <div>
                                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                    <span>Harmfulness</span>
                                                    <span>Low ({model.safetyEthical.harmfulContentScore})</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${(1 - model.safetyEthical.harmfulContentScore) * 100}%` }}></div>
                                                </div>
                                            </div>
                                             <div>
                                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                    <span>Bias</span>
                                                    <span>Low ({model.safetyEthical.biasScores.general})</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${(1 - (model.safetyEthical.biasScores.general || 0)) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}

                    {activeTab === 'fine-tuning' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-100">Active Jobs</h3>
                                <Button icon="add">New Job</Button>
                            </div>
                            {jobs.length > 0 ? (
                                <div className="grid gap-4">
                                    {jobs.map(job => (
                                        <div key={job.jobId} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                                            <div>
                                                <div className="font-semibold text-gray-200">{job.fineTunedModelName}</div>
                                                <div className="text-xs text-gray-400 mt-1">Base: {job.baseModelDisplayName} • Dataset: {job.datasetId}</div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${job.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{job.status}</span>
                                                <div className="text-xs text-gray-500 mt-1">{new Date(job.startTime).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700 border-dashed">
                                    <span className="material-icons text-4xl text-gray-600 mb-2">tune</span>
                                    <p className="text-gray-400">No fine-tuning jobs found.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'deployments' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-100">Active Endpoints</h3>
                                <Button icon="rocket_launch">Deploy</Button>
                            </div>
                            {deployments.length > 0 ? (
                                <div className="grid gap-4">
                                    {deployments.map(dep => (
                                        <div key={dep.deploymentId} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <div className="font-semibold text-gray-200 flex items-center">
                                                        {dep.region}
                                                        <span className="mx-2 text-gray-600">•</span>
                                                        <span className="font-mono text-sm text-indigo-400">{dep.deploymentId}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">v{dep.version} • {dep.scalingConfig.minNodes}-{dep.scalingConfig.maxNodes} nodes</div>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${dep.status === 'deployed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{dep.status}</span>
                                            </div>
                                            <div className="bg-gray-900 p-2 rounded border border-gray-800 flex justify-between items-center">
                                                <code className="text-xs text-gray-400 font-mono truncate mr-4">{dep.endpointUrl}</code>
                                                <button className="text-gray-500 hover:text-white"><span className="material-icons text-sm">content_copy</span></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700 border-dashed">
                                    <span className="material-icons text-4xl text-gray-600 mb-2">cloud_off</span>
                                    <p className="text-gray-400">No active deployments.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'code' && (
                        <div className="space-y-6">
                            {model.exampleCode?.map((ex, i) => (
                                <div key={i}>
                                    <h4 className="text-sm font-semibold text-gray-300 mb-2">{ex.description} ({ex.language})</h4>
                                    <pre className="bg-gray-950 p-4 rounded-lg border border-gray-800 overflow-x-auto text-sm font-mono text-green-400">
                                        <code>{ex.snippet}</code>
                                    </pre>
                                </div>
                            ))}
                            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                <h4 className="text-sm font-semibold text-gray-200 mb-2">API Configuration</h4>
                                <p className="text-sm text-gray-400 mb-4">Use the model ID below in your API requests.</p>
                                <div className="flex items-center space-x-2">
                                    <code className="bg-black/30 px-3 py-2 rounded text-indigo-300 font-mono text-sm flex-1">{model.id}</code>
                                    <Button variant="ghost" icon="content_copy" onClick={() => navigator.clipboard.writeText(model.id)} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ModelGrid: React.FC = () => {
    const { models, loadingModels, sort, setSort, setSelectedModelId } = useModelUniverse();

    if (loadingModels) return <div className="flex-1 flex items-center justify-center"><LoadingSpinner /></div>;

    return (
        <div className="flex-1 p-6 overflow-y-auto bg-gray-950 custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-100">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        {models.length} Models Available
                    </span>
                </h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Sort by:</span>
                    <select 
                        className="bg-gray-800 border-gray-700 text-gray-200 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2"
                        value={sort.field}
                        onChange={(e) => setSort(prev => ({ ...prev, field: e.target.value as any }))}
                    >
                        <option value="displayName">Name</option>
                        <option value="rating">Rating</option>
                        <option value="currentVersion.releaseDate">Release Date</option>
                        <option value="performance.latencyMs.p50">Latency (Fastest)</option>
                        <option value="costEfficiency">Cost Efficiency</option>
                    </select>
                </div>
            </div>

            {models.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <span className="material-icons text-6xl mb-4">search_off</span>
                    <p className="text-lg">No models found matching your filters.</p>
                    <button onClick={() => window.location.reload()} className="mt-4 text-indigo-400 hover:underline">Clear Filters</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-10">
                    {models.map(model => (
                        <ModelCard key={model.id} model={model} onClick={() => setSelectedModelId(model.id)} />
                    ))}
                </div>
            )}
        </div>
    );
};

export const ModelSelector: React.FC = () => {
    const { selectedModelId, setSelectedModelId, models } = useModelUniverse();
    const selectedModel = models.find(m => m.id === selectedModelId);

    return (
        <div className="flex h-screen w-full bg-gray-950 text-gray-100 font-sans overflow-hidden">
            <ModelFilterSidebar />
            <ModelGrid />
            {selectedModel && <ModelDetailsPanel model={selectedModel} onClose={() => setSelectedModelId(null)} />}
        </div>
    );
};
