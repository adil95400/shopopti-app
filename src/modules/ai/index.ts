// AI Module Index
// This file exports all AI-related functionality from a central location

import { aiService } from '../../services/aiService';

// Re-export the AI service
export { aiService };

// Export AI-specific hooks and utilities
export * from './hooks/useAiAssistant';
export * from './hooks/useAiOptimization';
export * from './utils/promptTemplates';