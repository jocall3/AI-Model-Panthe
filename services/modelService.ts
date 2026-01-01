import {
    IModel, IProvider, ICapability, IDomain, IUseCase, ITag,
    IFineTuningJob, IDeploymentConfig, IExperiment, IDataset, ITool, IAgenticWorkflow,
    IModelService, ModelFilterOptions, ModelSortOptions
} from '../types';

// Helper for consistent dates
const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

const mockProviders: IProvider[] = [
    {
        id: 'google',
        name: 'Google AI',
        description: 'Pioneering AI research and products.',
        logoUrl: 'https://www.gstatic.com/devrel-devsite/prod/vc3d1f4350529d3c5ed83e18a9010373c224f2249/ai/images/ai-logo.svg',
        websiteUrl: 'https://ai.google/',
        termsOfServiceUrl: 'https://cloud.google.com/terms',
        privacyPolicyUrl: 'https://policies.google.com/privacy',
        contactEmail: 'ai-support@google.com',
        regionAvailability: ['US', 'EU', 'APAC', 'SA'],
    },
    {
        id: 'anthropic',
        name: 'Anthropic',
        description: 'Building reliable, interpretable, and steerable AI systems.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg',
        websiteUrl: 'https://www.anthropic.com/',
        termsOfServiceUrl: 'https://www.anthropic.com/legal/terms',
        privacyPolicyUrl: 'https://www.anthropic.com/legal/privacy',
        contactEmail: 'support@anthropic.com',
        regionAvailability: ['US', 'EU'],
    },
    {
        id: 'openai',
        name: 'OpenAI',
        description: 'Ensuring that artificial general intelligence benefits all of humanity.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
        websiteUrl: 'https://openai.com/',
        termsOfServiceUrl: 'https://openai.com/policies/terms-of-use',
        privacyPolicyUrl: 'https://openai.com/policies/privacy-policy',
        contactEmail: 'support@openai.com',
        regionAvailability: ['US', 'EU', 'APAC'],
    },
    {
        id: 'huggingface',
        name: 'Hugging Face',
        description: 'The AI community building the future.',
        logoUrl: 'https://huggingface.co/front/assets/huggingface_logo.svg',
        websiteUrl: 'https://huggingface.co/',
        termsOfServiceUrl: 'https://huggingface.co/terms',
        privacyPolicyUrl: 'https://huggingface.co/privacy',
        contactEmail: 'contact@huggingface.co',
        regionAvailability: ['GLOBAL'],
    },
    {
        id: 'meta',
        name: 'Meta AI',
        description: 'Advancing AI for next-generation social experiences.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
        websiteUrl: 'https://ai.meta.com/',
        regionAvailability: ['GLOBAL'],
    },
    {
        id: 'stability-ai',
        name: 'Stability AI',
        description: 'The world\'s leading open-source generative AI company.',
        logoUrl: 'https://images.crunchbase.com/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/v1660233483/f233483/mn5k8s9p0z0o0k0k0k0.png',
        websiteUrl: 'https://stability.ai/',
        regionAvailability: ['GLOBAL'],
    },
];

const mockCapabilities: ICapability[] = [
    { id: 'text-gen', name: 'Text Generation', description: 'Generates human-like text.', icon: 'edit_note', category: 'core' },
    { id: 'image-gen', name: 'Image Synthesis', description: 'Creates images from text or other inputs.', icon: 'image', category: 'core' },
    { id: 'video-gen', name: 'Video Generation', description: 'Generates video clips.', icon: 'movie', category: 'core' },
    { id: 'audio-gen', name: 'Audio Synthesis', description: 'Creates audio, music, or speech.', icon: 'mic', category: 'core' },
    { id: 'code-gen', name: 'Code Generation', description: 'Writes or completes code.', icon: 'code', category: 'core' },
    { id: 'multimodal', name: 'Multimodal', description: 'Processes and generates across multiple data types (text, image, video, audio).', icon: 'layers', category: 'core' },
    { id: 'reasoning', name: 'Complex Reasoning', description: 'Solves complex problems requiring logical inference.', icon: 'psychology', category: 'extended' },
    { id: 'summarization', name: 'Summarization', description: 'Condenses long texts into shorter versions.', icon: 'summarize', category: 'extended' },
    { id: 'translation', name: 'Translation', description: 'Translates text between languages.', icon: 'translate', category: 'extended' },
    { id: 'sentiment', name: 'Sentiment Analysis', description: 'Determines emotional tone of text.', icon: 'mood', category: 'domain-specific' },
    { id: 'embedding', name: 'Text Embedding', description: 'Converts text into numerical vectors.', icon: 'scatter_plot', category: 'technical' },
    { id: 'vision', name: 'Computer Vision', description: 'Analyzes and understands images/videos (e.g., object detection, classification).', icon: 'visibility', category: 'extended' },
    { id: 'speech-rec', name: 'Speech Recognition', description: 'Converts spoken language to text.', icon: 'record_voice_over', category: 'extended' },
    { id: 'tool-use', name: 'Tool Use / Function Calling', description: 'Can call external tools or APIs to perform actions.', icon: 'build', category: 'technical' },
    { id: 'agentic', name: 'Agentic Behavior', description: 'Capable of planning and executing multi-step tasks.', icon: 'smart_toy', category: 'technical' },
    { id: 'fine-tuning', name: 'Fine-tuning Ready', description: 'Can be adapted with custom data for specific tasks.', icon: 'tune', category: 'technical' },
    { id: 'real-time', name: 'Real-time Processing', description: 'Optimized for low-latency, real-time applications.', icon: 'flash_on', category: 'performance' },
];

const mockDomains: IDomain[] = [
    { id: 'creative-arts', name: 'Creative Arts', description: 'Art, music, writing, design.', color: '#FF5733' },
    { id: 'software-dev', name: 'Software Development', description: 'Coding, testing, documentation.', color: '#2196F3' },
    { id: 'customer-svc', name: 'Customer Service', description: 'Chatbots, support automation.', color: '#8BC34A' },
    { id: 'healthcare', name: 'Healthcare', description: 'Diagnostics, research, patient care.', color: '#E91E63' },
    { id: 'finance', name: 'Finance', description: 'Market analysis, fraud detection.', color: '#FFC107' },
    { id: 'education', name: 'Education', description: 'Tutoring, content creation.', color: '#673AB7' },
    { id: 'marketing', name: 'Marketing', description: 'Content generation, ad optimization.', color: '#00BCD4' },
    { id: 'research', name: 'Scientific Research', description: 'Data analysis, hypothesis generation.', color: '#9C27B0' },
    { id: 'legal', name: 'Legal', description: 'Document review, case analysis.', color: '#795548' },
    { id: 'gaming', name: 'Gaming', description: 'NPC behavior, story generation, asset creation.', color: '#F44336' },
];

const mockUseCases: IUseCase[] = [
    { id: 'chatbot', name: 'Intelligent Chatbot', description: 'Conversational AI assistants.', exampleQueries: ['Explain quantum physics.', 'Write a poem about a cat.'] },
    { id: 'content-creation', name: 'Content Generation', description: 'Blogs, articles, social media posts.', exampleQueries: ['Generate a blog post about sustainable living.', 'Write 5 catchy tweets for a new product launch.'] },
    { id: 'image-editing', name: 'AI-Powered Image Editing', description: 'Stylization, inpainting, outpainting.', exampleQueries: ['Remove the background from this image.', 'Change the style of this photo to watercolor.'] },
    { id: 'code-completion', name: 'Code Autocompletion', description: 'Assisting developers with code.', exampleQueries: ['Implement a quicksort algorithm in Python.', 'Generate unit tests for this JavaScript function.'] },
    { id: 'drug-discovery', name: 'Drug Discovery', description: 'Accelerating pharmaceutical research.', exampleQueries: ['Predict the binding affinity of this molecule.', 'Design a novel protein structure for enzyme X.'] },
    { id: 'financial-forecasting', name: 'Financial Forecasting', description: 'Predicting market trends.', exampleQueries: ['Forecast stock prices for AAPL for the next quarter.', 'Analyze market sentiment from recent news.'] },
    { id: 'personalized-learning', name: 'Personalized Learning', description: 'Adaptive educational content.', exampleQueries: ['Create a personalized study plan for calculus.', 'Explain Bayes theorem to a high school student.'] },
    { id: 'virtual-assistant', name: 'Virtual Assistant', description: 'Automating tasks and scheduling.', exampleQueries: ['Summarize my emails from yesterday.', 'Schedule a meeting with John for Tuesday.'] },
    { id: 'medical-imaging-analysis', name: 'Medical Imaging Analysis', description: 'Assisting diagnosis from scans.', exampleQueries: ['Detect anomalies in this X-ray image.', 'Segment the tumor from the MRI scan.'] },
    { id: 'legal-research', name: 'Legal Research', description: 'Automating legal document analysis.', exampleQueries: ['Summarize key points from this legal brief.', 'Find relevant case law for contract dispute X.'] },
];

const mockTags: ITag[] = [
    { id: 'fast', name: 'Fast Inference', color: '#4CAF50', type: 'performance' },
    { id: 'cost-effective', name: 'Cost-Effective', color: '#2196F3', type: 'performance' },
    { id: 'high-quality', name: 'High Quality', color: '#9C27B0', type: 'performance' },
    { id: 'multilingual', name: 'Multilingual', color: '#FF9800', type: 'application' },
    { id: 'small', name: 'Small Model', color: '#795548', type: 'technical' },
    { id: 'large', name: 'Large Model', color: '#607D8B', type: 'technical' },
    { id: 'opensource', name: 'Open Source', color: '#00BCD4', type: 'technical' },
    { id: 'proprietary', name: 'Proprietary', color: '#E91E63', type: 'technical' },
    { id: 'research', name: 'Research-focused', color: '#F44336', type: 'application' },
    { id: 'production-ready', name: 'Production-Ready', color: '#8BC34A', type: 'application' },
    { id: 'on-device', name: 'On-Device Capable', color: '#FFEB3B', type: 'technical' },
    { id: 'quantized', name: 'Quantized', color: '#9E9E9E', type: 'technical' },
];

const mockModels: IModel[] = [
    {
        id: 'gemini-2.5-flash-001',
        uniqueName: 'google/gemini-2.5-flash-001',
        displayName: 'Gemini 2.5 Flash',
        description: 'Google\'s fastest and most efficient multimodal model, optimized for high-volume, low-latency applications.',
        longDescription: 'Gemini 2.5 Flash excels at tasks requiring rapid responses, such as chatbots, real-time analytics, and quick content generation. It supports extensive context windows and is highly cost-effective for large-scale deployments. Its multimodal capabilities allow it to process and generate content across text, image, and video.',
        provider: mockProviders[0],
        currentVersion: {
            version: '2.5.0-flash-001',
            releaseDate: daysAgo(10),
            changelogUrl: 'https://ai.google/models/gemini-flash-changelog',
            status: 'stable',
            featuresAdded: ['Improved multimodal understanding', 'Enhanced safety guardrails'],
        },
        allVersions: [
            {
                version: '2.5.0-flash-001',
                releaseDate: daysAgo(10),
                changelogUrl: 'https://ai.google/models/gemini-flash-changelog',
                status: 'stable',
                featuresAdded: ['Improved multimodal understanding', 'Enhanced safety guardrails'],
            },
            {
                version: '2.0.0-flash-beta',
                releaseDate: daysAgo(150),
                changelogUrl: 'https://ai.google/models/gemini-flash-beta-changelog',
                status: 'deprecated',
                breakingChanges: ['API endpoint changed', 'Tokenization updates'],
                migrationGuideUrl: 'https://ai.google/models/gemini-flash-migration',
                bugFixes: ['Addressed minor hallucinations'],
            },
        ],
        capabilities: [
            mockCapabilities[0], mockCapabilities[1], mockCapabilities[5],
            mockCapabilities[7], mockCapabilities[13], mockCapabilities[15], mockCapabilities[16],
        ],
        inputModalities: ['text', 'image', 'audio', 'video'],
        outputModalities: ['text', 'image', 'audio'],
        supportedLanguages: ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko'],
        domains: [mockDomains[2], mockDomains[6], mockDomains[0]],
        useCases: [mockUseCases[0], mockUseCases[1], mockUseCases[7]],
        tags: [mockTags[0], mockTags[1], mockTags[3], mockTags[5], mockTags[7], mockTags[9]],
        pricing: {
            inputTokenCostPerMillion: 0.1,
            outputTokenCostPerMillion: 0.2,
            imageGenerationCostPerImage: 0.002,
            unit: 'USD',
            freeTierAvailable: true,
            currencySymbol: '$',
        },
        performance: {
            latencyMs: { p50: 50, p90: 80, p99: 150 },
            throughputTokensPerSecond: 120000,
            accuracyScore: 0.92,
            robustnessScore: 0.88,
            maxConcurrentRequests: 5000,
            coldStartLatencyMs: 100,
        },
        safetyEthical: {
            harmfulContentScore: 0.05,
            biasScores: { general: 0.1 },
            transparencyScore: 0.7,
            explainabilityScore: 0.65,
            dataPrivacyCompliance: ['GDPR', 'CCPA'],
            responsibleAIGuidelinesAdherence: ['Fairness', 'Safety', 'Privacy'],
            riskAssessmentLevel: 'low',
            mitigationStrategies: ['Reinforcement Learning from Human Feedback (RLHF)', 'Continuous monitoring'],
        },
        documentationUrl: 'https://ai.google/docs/gemini-flash',
        apiReferenceUrl: 'https://ai.google/api/gemini-flash',
        playgroundUrl: 'https://ai.google/gemini-playground',
        learnMoreUrl: 'https://blog.google/technology/ai/gemini-flash-overview/',
        recommendedFor: ['real-time-chat', 'large-scale-summarization', 'multimodal-content-analysis'],
        status: 'available',
        isCustomizable: true,
        isCommunityContributed: false,
        rating: 4.8,
        reviewCount: 1200,
        communityForumUrl: 'https://ai.google/community/gemini',
        releaseNotesUrl: 'https://ai.google/gemini/releasenotes',
        inferenceEndpointUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
        licensingInfo: 'Proprietary, Google Cloud Terms',
        hardwareRequirements: 'Cloud-hosted',
        carbonFootprintEstimate: 'low',
        integrationGuides: [{ platform: 'LangChain', url: 'https://python.langchain.com/docs/integrations/llms/google_generative_ai' }],
        exampleCode: [{ language: 'Python', description: 'Basic text generation', snippet: `import google.generativeai as genai\n\ngenai.configure(api_key="YOUR_API_KEY")\nmodel = genai.GenerativeModel('gemini-2.5-flash')\nresponse = model.generate_content("Hello world!")\nprint(response.text)` }],
    },
     {
        id: 'gemini-1.5-pro-001',
        uniqueName: 'google/gemini-1.5-pro-001',
        displayName: 'Gemini 1.5 Pro',
        description: 'Google\'s most capable general-purpose multimodal model, designed for complex reasoning and long context windows.',
        longDescription: 'Gemini 1.5 Pro features a massive context window (up to 1 million tokens), enabling it to process and analyze incredibly long documents, codebases, or videos. It excels at complex reasoning, multi-turn conversations, and highly accurate content generation. Ideal for advanced R&D and applications requiring deep understanding.',
        provider: mockProviders[0],
        currentVersion: {
            version: '1.5.0-pro-001',
            releaseDate: daysAgo(90),
            changelogUrl: 'https://ai.google/models/gemini-pro-changelog',
            status: 'stable',
            featuresAdded: ['1M token context window', 'Improved video understanding'],
        },
        allVersions: [
            {
                version: '1.5.0-pro-001',
                releaseDate: daysAgo(90),
                changelogUrl: 'https://ai.google/models/gemini-pro-changelog',
                status: 'stable',
                featuresAdded: ['1M token context window', 'Improved video understanding'],
            },
        ],
        capabilities: [
            mockCapabilities[0], mockCapabilities[1], mockCapabilities[2],
            mockCapabilities[5], mockCapabilities[6], mockCapabilities[7],
            mockCapabilities[8], mockCapabilities[4], mockCapabilities[13],
            mockCapabilities[14], mockCapabilities[15],
        ],
        inputModalities: ['text', 'image', 'audio', 'video'],
        outputModalities: ['text', 'image', 'audio'],
        supportedLanguages: ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko', 'ar', 'hi', 'pt', 'ru'],
        domains: [mockDomains[1], mockDomains[3], mockDomains[7], mockDomains[0]],
        useCases: [mockUseCases[1], mockUseCases[3], mockUseCases[4], mockUseCases[6], mockUseCases[0]],
        tags: [mockTags[2], mockTags[3], mockTags[5], mockTags[7], mockTags[9]],
        pricing: {
            inputTokenCostPerMillion: 3.5,
            outputTokenCostPerMillion: 10.5,
            imageGenerationCostPerImage: 0.005,
            videoGenerationCostPerSecond: 0.01,
            unit: 'USD',
            freeTierAvailable: false,
            currencySymbol: '$',
        },
        performance: {
            latencyMs: { p50: 300, p90: 600, p99: 1200 },
            throughputTokensPerSecond: 15000,
            accuracyScore: 0.95,
            robustnessScore: 0.93,
            maxConcurrentRequests: 1000,
            coldStartLatencyMs: 500,
        },
        safetyEthical: {
            harmfulContentScore: 0.03,
            biasScores: { gender: 0.05, race: 0.04, general: 0.06 },
            transparencyScore: 0.8,
            explainabilityScore: 0.75,
            dataPrivacyCompliance: ['GDPR', 'HIPAA', 'CCPA'],
            responsibleAIGuidelinesAdherence: ['Fairness', 'Safety', 'Privacy', 'Accountability'],
            riskAssessmentLevel: 'medium',
            mitigationStrategies: ['Extensive red teaming', 'Ethical AI review board'],
        },
        documentationUrl: 'https://ai.google/docs/gemini-pro',
        apiReferenceUrl: 'https://ai.google/api/gemini-pro',
        playgroundUrl: 'https://ai.google/gemini-playground',
        learnMoreUrl: 'https://blog.google/technology/ai/gemini-1-5-pro-overview/',
        recommendedFor: ['complex-analysis', 'long-document-processing', 'advanced-code-generation'],
        status: 'available',
        isCustomizable: true,
        isCommunityContributed: false,
        rating: 4.9,
        reviewCount: 2500,
        communityForumUrl: 'https://ai.google/community/gemini',
        releaseNotesUrl: 'https://ai.google/gemini/releasenotes',
        inferenceEndpointUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
        licensingInfo: 'Proprietary, Google Cloud Terms',
        hardwareRequirements: 'Cloud-hosted',
        carbonFootprintEstimate: 'medium',
        relatedModels: ['gemini-2.5-flash-001'],
    },
    {
        id: 'claude-3-opus',
        uniqueName: 'anthropic/claude-3-opus',
        displayName: 'Claude 3 Opus',
        description: 'Anthropic\'s most intelligent model, offering state-of-the-art performance on highly complex tasks.',
        provider: mockProviders[1],
        currentVersion: {
            version: '3.0.0-opus',
            releaseDate: daysAgo(180),
            changelogUrl: 'https://www.anthropic.com/news/claude-3-family',
            status: 'stable',
            featuresAdded: ['Improved multimodal vision', 'Reduced hallucination rate'],
        },
        allVersions: [
            {
                version: '3.0.0-opus',
                releaseDate: daysAgo(180),
                changelogUrl: 'https://www.anthropic.com/news/claude-3-family',
                status: 'stable',
                featuresAdded: ['Improved multimodal vision', 'Reduced hallucination rate'],
            },
        ],
        capabilities: [
            mockCapabilities[0], mockCapabilities[6], mockCapabilities[7],
            mockCapabilities[4], mockCapabilities[5], mockCapabilities[13], mockCapabilities[14],
        ],
        inputModalities: ['text', 'image'],
        outputModalities: ['text'],
        supportedLanguages: ['en'],
        domains: [mockDomains[1], mockDomains[3], mockDomains[7], mockDomains[8]],
        useCases: [mockUseCases[0], mockUseCases[1], mockUseCases[3], mockUseCases[4], mockUseCases[9]],
        tags: [mockTags[2], mockTags[5], mockTags[7], mockTags[9]],
        pricing: {
            inputTokenCostPerMillion: 15.0,
            outputTokenCostPerMillion: 75.0,
            unit: 'USD',
            freeTierAvailable: false,
            currencySymbol: '$',
        },
        performance: {
            latencyMs: { p50: 800, p90: 1500, p99: 2500 },
            throughputTokensPerSecond: 10000,
            accuracyScore: 0.96,
            robustnessScore: 0.94,
            maxConcurrentRequests: 800,
            coldStartLatencyMs: 300,
        },
        safetyEthical: {
            harmfulContentScore: 0.02,
            biasScores: { general: 0.04 },
            transparencyScore: 0.85,
            explainabilityScore: 0.8,
            dataPrivacyCompliance: ['GDPR', 'HIPAA'],
            responsibleAIGuidelinesAdherence: ['Constitutional AI', 'Safety', 'Privacy', 'Fairness'],
            riskAssessmentLevel: 'medium',
            mitigationStrategies: ['Constitutional AI principles', 'Extensive safety evaluations'],
        },
        documentationUrl: 'https://docs.anthropic.com/claude/reference/claude-3-opus',
        apiReferenceUrl: 'https://docs.anthropic.com/claude/reference/getting-started',
        playgroundUrl: 'https://console.anthropic.com/playground',
        learnMoreUrl: 'https://www.anthropic.com/news/claude-3-family',
        recommendedFor: ['strategic-analysis', 'complex-problem-solving', 'advanced-research-assistant'],
        status: 'available',
        isCustomizable: false,
        isCommunityContributed: false,
        rating: 4.9,
        reviewCount: 1800,
        communityForumUrl: 'https://www.anthropic.com/community',
        releaseNotesUrl: 'https://www.anthropic.com/news/claude-3-family',
        inferenceEndpointUrl: 'https://api.anthropic.com/v1/messages',
        licensingInfo: 'Proprietary, Anthropic Terms',
        hardwareRequirements: 'Cloud-hosted',
        carbonFootprintEstimate: 'medium',
    },
    {
        id: 'stable-diffusion-xl',
        uniqueName: 'stability-ai/stable-diffusion-xl',
        displayName: 'Stable Diffusion XL',
        description: 'Stability AI\'s most advanced open-source text-to-image model for high-quality image generation.',
        longDescription: 'SDXL 1.0 is an advanced generative AI model designed for image synthesis.',
        provider: mockProviders[5],
        currentVersion: {
            version: '1.0.0',
            releaseDate: daysAgo(365),
            changelogUrl: 'https://stability.ai/blog/stable-diffusion-xl-release',
            status: 'stable',
            featuresAdded: ['1024x1024 base resolution', 'Improved aesthetic quality'],
        },
        allVersions: [
            {
                version: '1.0.0',
                releaseDate: daysAgo(365),
                changelogUrl: 'https://stability.ai/blog/stable-diffusion-xl-release',
                status: 'stable',
                featuresAdded: ['1024x1024 base resolution', 'Improved aesthetic quality'],
            },
        ],
        capabilities: [mockCapabilities[1], mockCapabilities[15]],
        inputModalities: ['text', 'image'],
        outputModalities: ['image'],
        supportedLanguages: ['en'],
        domains: [mockDomains[0], mockDomains[6], mockDomains[9]],
        useCases: [mockUseCases[1], mockUseCases[2]],
        tags: [mockTags[2], mockTags[5], mockTags[6], mockTags[9]],
        pricing: {
            inputTokenCostPerMillion: 0,
            outputTokenCostPerMillion: 0,
            imageGenerationCostPerImage: 0,
            unit: 'N/A',
            freeTierAvailable: true,
            currencySymbol: '$',
        },
        performance: {
            latencyMs: { p50: 2000, p90: 5000, p99: 10000 },
            throughputTokensPerSecond: 0,
            accuracyScore: 0.94,
            fidScore: 20.1,
            maxConcurrentRequests: 10,
            coldStartLatencyMs: 0,
        },
        safetyEthical: {
            harmfulContentScore: 0.12,
            biasScores: { general: 0.18 },
            transparencyScore: 0.85,
            explainabilityScore: 0.6,
            dataPrivacyCompliance: ['User-managed'],
            responsibleAIGuidelinesAdherence: ['Transparency', 'Open Science'],
            riskAssessmentLevel: 'high',
            mitigationStrategies: ['Community-driven safety research', 'Optional safety filters'],
        },
        documentationUrl: 'https://github.com/Stability-AI/generative-models',
        apiReferenceUrl: 'https://platform.stability.ai/docs/api-reference',
        playgroundUrl: 'https://dreamstudio.ai/generate',
        learnMoreUrl: 'https://stability.ai/stable-diffusion',
        recommendedFor: ['custom-art-generation', 'local-deployment', 'research-prototyping'],
        status: 'available',
        isCustomizable: true,
        isCommunityContributed: true,
        rating: 4.7,
        reviewCount: 4000,
        communityForumUrl: 'https://discord.gg/stabilityai',
        releaseNotesUrl: 'https://stability.ai/blog/stable-diffusion-xl-release',
        licensingInfo: 'CreativeML Open RAIL++-M License',
        hardwareRequirements: '16GB VRAM GPU recommended',
        carbonFootprintEstimate: 'user-dependent',
    },
];

const mockFineTuningJobs: IFineTuningJob[] = [
    {
        jobId: 'ft-gemini-25f-001',
        modelId: 'gemini-2.5-flash-001',
        baseModelDisplayName: 'Gemini 2.5 Flash',
        datasetId: 'ds-chat-history-v2',
        status: 'completed',
        startTime: daysAgo(5),
        endTime: daysAgo(4),
        durationMs: 90 * 60 * 1000,
        costEstimate: 25.0,
        actualCost: 28.50,
        metrics: { validationLoss: 0.015, accuracy: 0.98 },
        hyperparameters: { epochs: 3, learningRate: 1e-5, batchSize: 8 },
        fineTunedModelId: 'custom-gemini-flash-my-chatbot',
        fineTunedModelName: 'MyCompany Chatbot - v1',
        logsUrl: '#',
        createdBy: 'user:dev_team@mycompany.com',
        createdAt: daysAgo(5),
    }
];

const mockDeployments: IDeploymentConfig[] = [
    {
        deploymentId: 'dep-chatbot-prod-us-1',
        modelId: 'custom-gemini-flash-my-chatbot',
        version: '1.0.0',
        region: 'us-central1',
        scalingConfig: { minNodes: 2, maxNodes: 10, autoScaleEnabled: true, targetMetric: 'qps', targetValue: 50 },
        status: 'deployed',
        endpointUrl: 'https://api.mycompany.com/v1/chatbot',
        creationDate: daysAgo(3),
        lastUpdated: daysAgo(1),
        costEstimatePerHour: 0.75,
        accessControlList: ['user:admin@mycompany.com', 'group:developers'],
        healthStatus: 'healthy',
        sslEnabled: true,
    }
];

const mockExperiments: IExperiment[] = [];
const mockDatasets: IDataset[] = [
    {
        id: 'ds-chat-history-v2',
        name: 'Customer Chat History V2',
        description: 'Anonymized chat logs for customer support fine-tuning.',
        type: 'text',
        sizeBytes: 150 * 1024 * 1024,
        recordCount: 500000,
        uploadDate: daysAgo(15),
        owner: 'data-team@mycompany.com',
        accessControl: ['group:ai-engineers'],
        storageLocation: 'gs://my-company-datasets/chat-history-v2.jsonl',
        dataFormat: 'JSONL',
        validationStatus: 'validated',
    }
];
const mockTools: ITool[] = [];
const mockAgenticWorkflows: IAgenticWorkflow[] = [];

export const MockModelService: IModelService = {
    getModels: async (filters = {}, sort = { field: 'displayName', direction: 'asc' }) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        let filteredModels = [...mockModels];

        if (filters.searchTerm) {
            const lowerSearchTerm = filters.searchTerm.toLowerCase();
            filteredModels = filteredModels.filter(model =>
                model.displayName.toLowerCase().includes(lowerSearchTerm) ||
                model.description.toLowerCase().includes(lowerSearchTerm) ||
                model.provider.name.toLowerCase().includes(lowerSearchTerm)
            );
        }
        if (filters.providerIds && filters.providerIds.length > 0) {
            filteredModels = filteredModels.filter(model => filters.providerIds!.includes(model.provider.id));
        }
        if (filters.capabilityIds && filters.capabilityIds.length > 0) {
            filteredModels = filteredModels.filter(model =>
                model.capabilities.some(cap => filters.capabilityIds!.includes(cap.id))
            );
        }
        if (filters.domainIds && filters.domainIds.length > 0) {
            filteredModels = filteredModels.filter(model =>
                model.domains.some(domain => filters.domainIds!.includes(domain.id))
            );
        }
        if (filters.useCaseIds && filters.useCaseIds.length > 0) {
            filteredModels = filteredModels.filter(model =>
                model.useCases.some(useCase => filters.useCaseIds!.includes(useCase.id))
            );
        }

        filteredModels.sort((a, b) => {
            let valA: any = a[sort.field as keyof IModel];
            let valB: any = b[sort.field as keyof IModel];

            if (sort.field === 'costEfficiency') {
                 // simplified logic for mock
                 valA = a.pricing.inputTokenCostPerMillion || 0;
                 valB = b.pricing.inputTokenCostPerMillion || 0;
            } else if (sort.field === 'performance.latencyMs.p50') {
                valA = a.performance.latencyMs.p50;
                valB = b.performance.latencyMs.p50;
            } else if (sort.field === 'currentVersion.releaseDate') {
                valA = new Date(a.currentVersion.releaseDate).getTime();
                valB = new Date(b.currentVersion.releaseDate).getTime();
            }

            if (typeof valA === 'string' && typeof valB === 'string') {
                return sort.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            if (typeof valA === 'number' && typeof valB === 'number') {
                return sort.direction === 'asc' ? valA - valB : valB - valA;
            }
            return 0;
        });

        return filteredModels;
    },
    getModelById: async (id: string) => mockModels.find(m => m.id === id),
    getProviders: async () => mockProviders,
    getCapabilities: async () => mockCapabilities,
    getDomains: async () => mockDomains,
    getUseCases: async () => mockUseCases,
    getTags: async () => mockTags,
    getFineTuningJobs: async () => mockFineTuningJobs,
    getDeployments: async () => mockDeployments,
    getExperiments: async () => mockExperiments,
    getDatasets: async () => mockDatasets,
    getTools: async () => mockTools,
    getAgenticWorkflows: async () => mockAgenticWorkflows
};
