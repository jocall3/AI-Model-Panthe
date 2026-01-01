export interface ICapability {
    id: string;
    name: string;
    description: string;
    icon?: string;
    category?: 'core' | 'extended' | 'domain-specific' | 'technical' | 'performance';
}

export interface IDomain {
    id: string;
    name: string;
    description: string;
    color?: string;
}

export interface IUseCase {
    id: string;
    name: string;
    description: string;
    exampleQueries?: string[];
}

export interface ITag {
    id: string;
    name: string;
    color?: string;
    type?: 'technical' | 'application' | 'performance';
}

export interface IPricing {
    inputTokenCostPerMillion?: number;
    outputTokenCostPerMillion?: number;
    imageGenerationCostPerImage?: number;
    videoGenerationCostPerSecond?: number;
    audioGenerationCostPerMinute?: number;
    embeddingCostPerMillion?: number;
    unit: string;
    modelCallCost?: number;
    freeTierAvailable: boolean;
    currencySymbol: string;
}

export interface IPerformanceMetrics {
    latencyMs: { p50: number; p90: number; p99: number; };
    throughputTokensPerSecond: number;
    accuracyScore?: number;
    robustnessScore?: number;
    f1Score?: number;
    bleuScore?: number;
    fidScore?: number;
    inferenceCostPerUnit?: number;
    maxConcurrentRequests?: number;
    coldStartLatencyMs?: number;
}

export interface ISafetyEthicalMetrics {
    harmfulContentScore: number;
    biasScores: {
        gender?: number;
        race?: number;
        age?: number;
        political?: number;
        general?: number;
    };
    transparencyScore: number;
    explainabilityScore: number;
    dataPrivacyCompliance: string[];
    responsibleAIGuidelinesAdherence: string[];
    riskAssessmentLevel: 'low' | 'medium' | 'high' | 'critical';
    mitigationStrategies?: string[];
}

export interface IModelVersion {
    version: string;
    releaseDate: string;
    changelogUrl?: string;
    status: 'stable' | 'beta' | 'deprecated' | 'experimental' | 'preview';
    breakingChanges?: string[];
    migrationGuideUrl?: string;
    performanceImprovements?: string[];
    bugFixes?: string[];
    featuresAdded?: string[];
    securityPatches?: string[];
}

export interface IProvider {
    id: string;
    name: string;
    description: string;
    logoUrl?: string;
    websiteUrl?: string;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
    contactEmail?: string;
    regionAvailability: string[];
}

export interface IModel {
    id: string;
    uniqueName: string;
    displayName: string;
    description: string;
    longDescription?: string;
    provider: IProvider;
    currentVersion: IModelVersion;
    allVersions: IModelVersion[];
    capabilities: ICapability[];
    inputModalities: string[];
    outputModalities: string[];
    supportedLanguages: string[];
    domains: IDomain[];
    useCases: IUseCase[];
    tags: ITag[];
    pricing: IPricing;
    performance: IPerformanceMetrics;
    safetyEthical: ISafetyEthicalMetrics;
    documentationUrl?: string;
    apiReferenceUrl?: string;
    playgroundUrl?: string;
    learnMoreUrl?: string;
    recommendedFor?: string[];
    deprecatedDate?: string;
    status: 'available' | 'limited-access' | 'soon' | 'deprecated' | 'experimental';
    isCustomizable: boolean;
    isCommunityContributed: boolean;
    rating?: number;
    reviewCount?: number;
    communityForumUrl?: string;
    releaseNotesUrl?: string;
    inferenceEndpointUrl?: string;
    licensingInfo?: string;
    hardwareRequirements?: string;
    carbonFootprintEstimate?: 'very-low' | 'low' | 'medium' | 'high' | 'very-high' | 'user-dependent';
    integrationGuides?: { platform: string; url: string; }[];
    exampleCode?: { language: string; snippet: string; description: string; }[];
    relatedModels?: string[];
}

export interface IFineTuningJob {
    jobId: string;
    modelId: string;
    baseModelDisplayName: string;
    datasetId: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    startTime: string;
    endTime?: string;
    durationMs?: number;
    costEstimate?: number;
    actualCost?: number;
    metrics?: {
        validationLoss?: number;
        accuracy?: number;
        perplexity?: number;
    };
    hyperparameters: Record<string, any>;
    fineTunedModelId?: string;
    fineTunedModelName?: string;
    logsUrl?: string;
    createdBy?: string;
    createdAt: string;
    callbackUrl?: string;
}

export interface IDeploymentConfig {
    deploymentId: string;
    modelId: string;
    version: string;
    region: string;
    scalingConfig: {
        minNodes: number;
        maxNodes: number;
        autoScaleEnabled: boolean;
        targetMetric?: 'cpu_utilization' | 'qps' | 'latency';
        targetValue?: number;
    };
    status: 'provisioning' | 'deployed' | 'updating' | 'failed' | 'deleted' | 'scaling';
    endpointUrl: string;
    creationDate: string;
    lastUpdated: string;
    costEstimatePerHour: number;
    actualCostPerHour?: number;
    accessControlList: string[];
    healthStatus: 'healthy' | 'unhealthy' | 'degraded';
    monitoringDashboardUrl?: string;
    alertsConfig?: { type: 'email' | 'slack'; threshold: number; };
    loadBalancerConfig?: { type: string; };
    customDomain?: string;
    sslEnabled: boolean;
}

export interface IExperiment {
    experimentId: string;
    name: string;
    description: string;
    status: 'draft' | 'running' | 'completed' | 'paused' | 'archived';
    startTime: string;
    endTime?: string;
    variants: {
        variantName: string;
        modelId: string;
        trafficSplit: number;
        deploymentId?: string;
        customConfig?: Record<string, any>;
    }[];
    metricsToTrack: string[];
    resultsSummary?: Record<string, any>;
    dashboardUrl?: string;
    createdBy?: string;
    createdAt: string;
    targetAudience?: string;
}

export interface IDataset {
    id: string;
    name: string;
    description: string;
    type: 'text' | 'image' | 'audio' | 'video' | 'multimodal' | 'code';
    sizeBytes: number;
    recordCount: number;
    uploadDate: string;
    owner: string;
    accessControl: string[];
    storageLocation: string;
    schema?: Record<string, string>;
    previewUrl?: string;
    dataFormat: string;
    validationStatus: 'pending' | 'validated' | 'failed' | 'warning';
    lastValidated?: string;
    tags?: string[];
}

export interface ITool {
    id: string;
    name: string;
    description: string;
    schema: Record<string, any>;
    endpoint: string;
    parameters: {
        name: string;
        type: string;
        description: string;
        required: boolean;
    }[];
    iconUrl?: string;
    provider?: string;
    tags?: string[];
}

export interface IAgenticWorkflow {
    id: string;
    name: string;
    description: string;
    modelsUsed: string[];
    toolsUsed: string[];
    steps: {
        order: number;
        type: 'model_call' | 'tool_call' | 'decision_node' | 'human_in_loop';
        refId: string;
        logic?: string;
    }[];
    status: 'draft' | 'active' | 'archived';
    version: string;
    createdBy: string;
    createdAt: string;
    lastUpdated: string;
    diagramUrl?: string;
    playgroundUrl?: string;
}

export interface ModelFilterOptions {
    searchTerm?: string;
    providerIds?: string[];
    capabilityIds?: string[];
    domainIds?: string[];
    useCaseIds?: string[];
    tagIds?: string[];
    minRating?: number;
    isCustomizable?: boolean;
    isCommunityContributed?: boolean;
    status?: IModel['status'][];
    minLatencyMs?: number;
    maxCostPerMillionTokens?: number;
    inputModality?: string;
    outputModality?: string;
    freeTierAvailable?: boolean;
}

export interface ModelSortOptions {
    field: keyof IModel | 'rating' | 'costEfficiency' | 'performance.latencyMs.p50' | 'currentVersion.releaseDate';
    direction: 'asc' | 'desc';
}

export interface IModelService {
    getModels: (filters?: ModelFilterOptions, sort?: ModelSortOptions) => Promise<IModel[]>;
    getModelById: (id: string) => Promise<IModel | undefined>;
    getProviders: () => Promise<IProvider[]>;
    getCapabilities: () => Promise<ICapability[]>;
    getDomains: () => Promise<IDomain[]>;
    getUseCases: () => Promise<IUseCase[]>;
    getTags: () => Promise<ITag[]>;
    getFineTuningJobs: (modelId?: string) => Promise<IFineTuningJob[]>;
    getDeployments: (modelId?: string) => Promise<IDeploymentConfig[]>;
    getExperiments: (modelId?: string) => Promise<IExperiment[]>;
    getDatasets: (owner?: string) => Promise<IDataset[]>;
    getTools: (modelId?: string) => Promise<ITool[]>;
    getAgenticWorkflows: (modelId?: string) => Promise<IAgenticWorkflow[]>;
}