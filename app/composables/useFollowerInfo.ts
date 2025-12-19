export function useFollowerInfo(
  userId: string,
  initialState: FollowerInfo,
) {
  const query = useQuery({
    queryKey: ['follower-info', userId],
    queryFn: () => $fetch<FollowerInfo>(`/api/users/user/${userId}/followers`, {
      method: 'GET',
    }),
    initialData: initialState,
    // refetchOnWindowFocus: false, so the data will be consider by tanstack query always fresh
    staleTime: Infinity,
  })

  return query
}
