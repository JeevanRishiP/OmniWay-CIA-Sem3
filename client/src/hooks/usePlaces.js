import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { placeApi } from '../api/client';

export const PLACE_KEYS = {
  all: ['places'],
  lists: () => [...PLACE_KEYS.all, 'list'],
  list: (filters) => [...PLACE_KEYS.lists(), filters],
  details: () => [...PLACE_KEYS.all, 'detail'],
  detail: (id) => [...PLACE_KEYS.details(), id],
  notes: (id, params) => [...PLACE_KEYS.detail(id), 'notes', params]
};

export function usePlaces(filters = {}) {
  return useQuery({
    queryKey: PLACE_KEYS.list(filters),
    queryFn: () => placeApi.getPlaces(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    keepPreviousData: true
  });
}

export function usePlace(id) {
  return useQuery({
    queryKey: PLACE_KEYS.detail(id),
    queryFn: () => placeApi.getPlaceById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2
  });
}

export function usePlaceNotes(id, params = {}) {
  return useQuery({
    queryKey: PLACE_KEYS.notes(id, params),
    queryFn: () => placeApi.getPlaceNotes(id, params),
    enabled: Boolean(id),
    staleTime: 1000 * 30 // 30 seconds
  });
}

export function useCreatePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPlace) => placeApi.createPlace(newPlace),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLACE_KEYS.lists() });
    }
  });
}

export function useVerifyFeature(placeId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => placeApi.verifyFeature(placeId, data),
    // Optimistic cache update for instant UI feedback
    onMutate: async (newVerification) => {
      await queryClient.cancelQueries({ queryKey: PLACE_KEYS.detail(placeId) });

      const previousPlaceData = queryClient.getQueryData(PLACE_KEYS.detail(placeId));

      if (previousPlaceData?.place) {
        const optimisticPlace = {
          ...previousPlaceData,
          place: {
            ...previousPlaceData.place,
            features: {
              ...previousPlaceData.place.features,
              [newVerification.feature]: {
                ...previousPlaceData.place.features?.[newVerification.feature],
                available: Boolean(newVerification.observedStatus),
                lastVerifiedAt: new Date().toISOString(),
                notes: newVerification.details,
                verificationCount:
                  (previousPlaceData.place.features?.[newVerification.feature]?.verificationCount || 0) + 1
              }
            },
            overallFreshnessScore: 'fresh'
          }
        };

        queryClient.setQueryData(PLACE_KEYS.detail(placeId), optimisticPlace);
      }

      return { previousPlaceData };
    },
    onError: (err, newVerification, context) => {
      if (context?.previousPlaceData) {
        queryClient.setQueryData(PLACE_KEYS.detail(placeId), context.previousPlaceData);
      }
    },
    onSettled: () => {
      // Refresh place detail, list, and notes queries
      queryClient.invalidateQueries({ queryKey: PLACE_KEYS.detail(placeId) });
      queryClient.invalidateQueries({ queryKey: PLACE_KEYS.notes(placeId, {}) });
      queryClient.invalidateQueries({ queryKey: PLACE_KEYS.lists() });
    }
  });
}

