import {
  logEvent as firebaseLogEvent,
  setUserProperty as firebaseSetUserProperty,
  getAnalytics,
  logSelectContent,
  logViewItem,
} from "@react-native-firebase/analytics";
import { useCallback, useEffect, useRef } from "react";

// Custom event names for the Dawaey app
export const ANALYTICS_EVENTS = {
  // Search Events
  SEARCH_PERFORMED: "search_performed",
  SEARCH_TYPE_SELECTED: "search_type_selected",
  FUZZY_SEARCH_DETECTED: "fuzzy_search_detected",
  WILDCARD_SEARCH_USED: "wildcard_search_used",
  SEARCH_RESULTS_VIEWED: "search_results_viewed",

  // Medication Events
  MEDICATION_VIEWED: "medication_viewed",
  MEDICATION_DETAILS_OPENED: "medication_details_opened",
  MEDICATION_IMAGE_LOADED: "medication_image_loaded",
  MEDICATION_IMAGE_FAILED: "medication_image_failed",
  ALTERNATIVES_SEARCHED: "alternatives_searched",
  SIMILAR_MEDICATIONS_SEARCHED: "similar_medications_searched",

  // Navigation Events
  TAB_SWITCHED: "tab_switched",
  MODAL_OPENED: "modal_opened",
  MODAL_CLOSED: "modal_closed",

  // User Engagement Events
  REFERENCES_VIEWED: "references_viewed",
  PHARMACY_SEARCHED: "pharmacy_searched",
  PROFILE_VIEWED: "profile_viewed",
  SETTINGS_CHANGED: "settings_changed",

  // Performance Events
  SEARCH_PERFORMANCE: "search_performance",
  APP_LAUNCH: "app_launch",
  ERROR_OCCURRED: "error_occurred",
} as const;

// Screen names for consistent tracking
export const SCREEN_NAMES = {
  SEARCH: "Search",
  COMMUNITY: "Community",
  PHARMACIES: "Pharmacies",
  PROFILE: "Profile",
  MEDICATION_DETAILS: "Medication_Details",
  REFERENCES: "References",
} as const;

export const useAnalytics = () => {
  const lastScreenRef = useRef<string | null>(null);
  const sessionStartRef = useRef<number>(Date.now());
  const analytics = getAnalytics();

  // Helper function to sanitize parameters - Firebase Analytics only accepts string, number, boolean, or arrays
  const sanitizeParameters = (params?: Record<string, any>): Record<string, any> => {
    if (!params) return {};
    
    const sanitized: Record<string, any> = {};
    
    Object.entries(params).forEach(([key, value]) => {
      // Only include valid types and non-null/undefined values
      if (value !== null && value !== undefined) {
        const valueType = typeof value;
        if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
          sanitized[key] = value;
        } else if (Array.isArray(value)) {
          // Filter arrays to only include valid primitive types
          const validArray = value.filter(item => 
            item !== null && item !== undefined && 
            (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean')
          );
          if (validArray.length > 0) {
            sanitized[key] = validArray;
          }
        } else if (valueType === 'object') {
          // Convert objects to strings (for complex data)
          try {
            sanitized[key] = JSON.stringify(value);
          } catch (e) {
            console.warn(`Failed to stringify parameter ${key}:`, e);
          }
        }
      }
    });
    
    return sanitized;
  };

  // Log custom events
  const logEvent = useCallback(
    async (eventName: string, parameters?: Record<string, any>) => {
      try {
        const sanitizedParams = sanitizeParameters({
          timestamp: Date.now(),
          session_duration: Date.now() - sessionStartRef.current,
          ...parameters,
        });
        
        await firebaseLogEvent(analytics, eventName, sanitizedParams);
      } catch (error) {
        console.warn("Analytics event failed:", eventName, error);
      }
    },
    [analytics]
  );

  // Initialize analytics on app start
  useEffect(() => {
    logEvent(ANALYTICS_EVENTS.APP_LAUNCH, {
      session_start: sessionStartRef.current,
      timestamp: Date.now(),
    });
  }, [logEvent]);

  // Log screen views
  const logScreenView = useCallback(
    async (screenName: string, screenClass?: string) => {
      try {
        const params: Record<string, any> = {
          screen_name: screenName,
          screen_class: screenClass ?? screenName,
          timestamp: Date.now(),
        };

        if (lastScreenRef.current) {
          params.previous_screen = lastScreenRef.current;
        }

        // Use the custom logEvent function for screen tracking since modular API doesn't have a predefined screen_view
        await logEvent("screen_view", params);
        lastScreenRef.current = screenName;
      } catch (error) {
        console.warn("Screen view tracking failed:", screenName, error);
      }
    },
    [logEvent]
  );

  // Search-specific events
  const logSearch = useCallback(
    async (searchQuery: string, searchType?: string, resultsCount?: number) => {
      await logEvent(ANALYTICS_EVENTS.SEARCH_PERFORMED, {
        search_term: searchQuery,
        search_type: searchType ?? "general",
        results_count: resultsCount ?? 0,
        query_length: searchQuery.length,
        has_special_chars: /[*+\-\(\)]/.test(searchQuery),
      });
    },
    [logEvent]
  );

  const logSearchType = useCallback(
    async (
      searchType: "alternatives" | "similar",
      originalMedication: string
    ) => {
      await logEvent(ANALYTICS_EVENTS.SEARCH_TYPE_SELECTED, {
        search_type: searchType,
        original_medication: originalMedication,
      });
    },
    [logEvent]
  );

  const logFuzzySearch = useCallback(
    async (originalQuery: string, suggestedQuery: string) => {
      await logEvent(ANALYTICS_EVENTS.FUZZY_SEARCH_DETECTED, {
        original_query: originalQuery,
        suggested_query: suggestedQuery,
        query_similarity: calculateSimilarity(originalQuery, suggestedQuery),
      });
    },
    [logEvent]
  );

  const logWildcardSearch = useCallback(
    async (pattern: string, resultsCount: number) => {
      await logEvent(ANALYTICS_EVENTS.WILDCARD_SEARCH_USED, {
        wildcard_pattern: pattern,
        results_count: resultsCount,
        pattern_complexity: (pattern.match(/\*/g) || []).length,
      });
    },
    [logEvent]
  );

  // Medication-specific events
  const logMedicationView = useCallback(
    async (medication: any, context?: string) => {
      await logEvent(ANALYTICS_EVENTS.MEDICATION_VIEWED, {
        medication_id: medication.id,
        medication_name: medication.tradename,
        active_ingredient: medication.activeingredient,
        company: medication.company,
        form: medication.form,
        has_price: !!medication.price,
        context: context ?? "search_results",
      });
    },
    [logEvent]
  );

  const logMedicationDetailsOpened = useCallback(
    async (medication: any, source: string) => {
      await logEvent(ANALYTICS_EVENTS.MEDICATION_DETAILS_OPENED, {
        medication_id: medication.id,
        medication_name: medication.tradename,
        source: source, // 'search_card', 'alternative_link', etc.
        has_image: true, // assuming images are available
      });
    },
    [logEvent]
  );

  const logMedicationImageEvent = useCallback(
    async (medicationId: number, success: boolean, loadTime?: number) => {
      const params: Record<string, any> = {
        medication_id: medicationId,
        image_url: `https://soliman.ai/dawaey-app-pics/${medicationId}.jpg`,
      };
      
      if (loadTime !== undefined) {
        params.load_time = loadTime;
      }
      
      await logEvent(
        success
          ? ANALYTICS_EVENTS.MEDICATION_IMAGE_LOADED
          : ANALYTICS_EVENTS.MEDICATION_IMAGE_FAILED,
        params
      );
    },
    [logEvent]
  );

  // Navigation events
  const logTabSwitch = useCallback(
    async (tabName: string, previousTab?: string) => {
      const params: Record<string, any> = {
        tab_name: tabName,
      };
      
      if (previousTab) {
        params.previous_tab = previousTab;
      }
      
      await logEvent(ANALYTICS_EVENTS.TAB_SWITCHED, params);
    },
    [logEvent]
  );

  const logModalEvent = useCallback(
    async (
      modalName: string,
      action: "opened" | "closed",
      context?: string
    ) => {
      const params: Record<string, any> = {
        modal_name: modalName,
      };
      
      if (context) {
        params.context = context;
      }
      
      await logEvent(
        action === "opened"
          ? ANALYTICS_EVENTS.MODAL_OPENED
          : ANALYTICS_EVENTS.MODAL_CLOSED,
        params
      );
    },
    [logEvent]
  );

  // Performance events
  const logSearchPerformance = useCallback(
    async (metrics: {
      query: string;
      searchTime: number;
      resultsCount: number;
      cacheHit?: boolean;
      searchType?: string;
    }) => {
      await logEvent(ANALYTICS_EVENTS.SEARCH_PERFORMANCE, {
        search_term: metrics.query,
        search_time_ms: metrics.searchTime,
        results_count: metrics.resultsCount,
        cache_hit: metrics.cacheHit ?? false,
        search_type: metrics.searchType ?? "general",
        performance_tier: getPerformanceTier(metrics.searchTime),
      });
    },
    [logEvent]
  );

  const logError = useCallback(
    async (
      error: Error,
      context: string,
      additionalData?: Record<string, any>
    ) => {
      const params: Record<string, any> = {
        error_message: error.message,
        context: context,
      };
      
      if (error.stack) {
        params.error_stack = error.stack.substring(0, 500); // Limit stack trace length
      }
      
      if (additionalData) {
        Object.assign(params, additionalData);
      }
      
      await logEvent(ANALYTICS_EVENTS.ERROR_OCCURRED, params);
    },
    [logEvent]
  );

  // User properties
  const setUserProperty = useCallback(
    async (property: string, value: string) => {
      try {
        await firebaseSetUserProperty(analytics, property, value);
      } catch (error) {
        console.warn("User property setting failed:", property, error);
      }
    },
    [analytics]
  );

  // Predefined analytics events
  const logSelectContentEvent = useCallback(
    async (contentType: string, itemId: string) => {
      await logSelectContent(analytics, {
        content_type: contentType,
        item_id: itemId,
      });
    },
    [analytics]
  );

  const logSearchAnalytics = useCallback(
    async (searchTerm: string) => {
      await logEvent("search", {
        search_term: searchTerm,
      });
    },
    [logEvent]
  );

  const logViewItemEvent = useCallback(
    async (itemId: string, itemName: string, category: string) => {
      await logViewItem(analytics, {
        currency: "EGP", // Egyptian Pound for price context
        value: 0, // Could be medication price if available
        items: [
          {
            item_id: itemId,
            item_name: itemName,
            item_category: category,
            quantity: 1,
          },
        ],
      });
    },
    [analytics]
  );

  return {
    // Core functions
    logEvent,
    logScreenView,
    setUserProperty,

    // Search tracking
    logSearch,
    logSearchType,
    logFuzzySearch,
    logWildcardSearch,
    logSearchPerformance,

    // Medication tracking
    logMedicationView,
    logMedicationDetailsOpened,
    logMedicationImageEvent,

    // Navigation tracking
    logTabSwitch,
    logModalEvent,

    // Error tracking
    logError,

    // Predefined events
    logSelectContent: logSelectContentEvent,
    logSearchAnalytics,
    logViewItem: logViewItemEvent,

    // Constants
    ANALYTICS_EVENTS,
    SCREEN_NAMES,
  };
};

// Helper functions
const calculateSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
};

const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[str2.length][str1.length];
};

const getPerformanceTier = (timeMs: number): string => {
  if (timeMs < 100) return "excellent";
  if (timeMs < 300) return "good";
  if (timeMs < 500) return "fair";
  return "slow";
};

// No default export needed, using named export
