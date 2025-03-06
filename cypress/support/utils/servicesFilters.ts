import { Service } from '@/app/(shared)/services/admin/serviceService'

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'alphabetical'
  | 'most_attempts'
  | 'least_attempts'
  | 'latest_attempts'
  | 'saved_simulation'

export enum SortEnum {
  NEWEST = 'Newest first',
  OLDEST = 'Oldest first',
  ALPHABETICAL = 'Alphabetical',
  MOST_ATTEMPTS = 'Most attempts',
  LEAST_ATTEMPTS = 'Least attempts',
  LATEST_ATTEMPTS = 'Latest attempt first',
  SAVED_SIMULATION = 'Saved simulation'
}

// This function is used in the service tab filter. It searches a particular property
export const filterServices = (
  services: any,
  searchValue: string | boolean,
  filterField: keyof Service = 'title'
) =>
  services.filter((service: any) =>
    typeof searchValue === 'boolean'
      ? (service[filterField]?.toString() || '') === searchValue.toString()
      : (service[filterField]?.toString() || '')
          .toLowerCase()
          .includes(searchValue.toString().toLowerCase())
  )

export const sortServices = (services: any, sortBy: SortOption): Service[] => {
  const newServices = [...services]

  switch (sortBy) {
    case 'newest':
      return newServices.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

    case 'oldest':
      return newServices.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )

    case 'alphabetical':
      return newServices.sort((a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase())
      )

    case 'most_attempts':
      return newServices.sort(
        (a, b) => (b.simulations?.length || 0) - (a.simulations?.length || 0)
      )

    case 'least_attempts':
      return newServices.sort(
        (a, b) => (a.simulations?.length || 0) - (b.simulations?.length || 0)
      )

    case 'latest_attempts':
      return newServices.sort((a, b) => {
        const getMostRecentDate = (service: any) => {
          const latestSim = service.simulations?.length
            ? Math.max(
                ...service.simulations.map((sim: any) =>
                  new Date(sim.created_at).getTime()
                )
              )
            : 0
          const lastAttempt = service.last_attempt
            ? new Date(service.last_attempt).getTime()
            : 0
          return Math.max(latestSim, lastAttempt)
        }

        return getMostRecentDate(b) - getMostRecentDate(a)
      })

    default:
      return newServices
  }
}

export const savedSimulationServices = (services: any) =>
  services
    .filter((service: any) => {
      const isPaused = Boolean(service.last_paused_at)
      const isNotEnded = service.ended_at === null
      return isPaused && isNotEnded
    })
    .sort((a: any, b: any) => {
      const lastPausedA = new Date(a.last_paused_at).getTime()
      const lastPausedB = new Date(b.last_paused_at).getTime()
      return lastPausedB - lastPausedA
    })
