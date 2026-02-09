import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchFamilyDetail } from "@/app/api/families/[id]/client"
import { postFollow, deleteFollow, fetchFollowStatus } from "@/app/api/families/[id]/follow/client"
import { fetchFamilyTimelines } from "@/app/api/timeline/family/client"

/** 家族詳細情報を取得する */
export const useFamilyDetail = ({familyId}: {familyId: string}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["familyDetail", familyId],
    queryFn: () => fetchFamilyDetail({familyId}),
  })

  return {
    familyDetail: data,
    isLoading,
    error,
  }
}

/** フォロー状態を取得する */
export const useFollowStatus = ({familyId}: {familyId: string}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["followStatus", familyId],
    queryFn: () => fetchFollowStatus({familyId}),
  })

  return {
    isFollowing: data?.isFollowing ?? false,
    isLoading,
  }
}

/** フォロー切り替えを行う */
export const useFollowToggle = ({familyId}: {familyId: string}) => {
  const queryClient = useQueryClient()

  const followMutation = useMutation({
    mutationFn: () => postFollow({familyId}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["followStatus", familyId]})
      queryClient.invalidateQueries({queryKey: ["familyDetail", familyId]})
    },
  })

  const unfollowMutation = useMutation({
    mutationFn: () => deleteFollow({familyId}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["followStatus", familyId]})
      queryClient.invalidateQueries({queryKey: ["familyDetail", familyId]})
    },
  })

  return {
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
    isLoading: followMutation.isPending || unfollowMutation.isPending,
  }
}

/** 家族タイムラインを取得する */
export const useFamilyTimeline = ({familyId}: {familyId: string}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["familyTimeline", familyId],
    queryFn: () => fetchFamilyTimelines({familyId}),
  })

  return {
    timelines: data || [],
    isLoading,
  }
}
