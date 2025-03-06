import { type ClassValue, clsx } from 'clsx'
import { isEmpty, startCase } from 'lodash'
import moment from 'moment-timezone'
import { twMerge } from 'tailwind-merge'
import serverConfig from './config/serverConfig'
import { Simulation } from './services/learner/simulationService'
import { roles, User } from './services/userService'
import { CSVColumns, FormEnum, Organization } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeUrlQueryParams(url: string) {
  return url.replace(/\?.*$/, '')
}

export function isUrl(url: string) {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
  return urlRegex.test(url)
}

export function removeSeconds(time: string) {
  const [, , s] = time.split(':')
  if (!s) return time
  return time.replace(/:\d{2}$/, '')
}

export function calculateTotalHours(startTime: string, endTime: string) {
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)

  const totalMinutes = (endHour - startHour) * 60 + (endMinute - startMinute)

  const totalHours = (totalMinutes / 60).toFixed(2).replace(/\.00$/, '')

  return totalHours
}

export function convertTo12HourFormat(time: string) {
  const [hours, minutes] = time.split(':').map(Number)

  const period = hours >= 12 ? 'PM' : 'AM'

  // Convert hours to 12-hour format
  let hours12 = hours % 12
  hours12 = hours12 || 12 // '0' should be converted to '12'

  const formattedTime = `${hours12}:${
    minutes < 10 ? '0' : ''
  }${minutes} ${period}`

  return formattedTime
}

export function formatDateTime(dateTimeStr: string, timeZone?: string) {
  // Parse the input datetime string as UTC
  const datetime = moment.utc(dateTimeStr)

  // Convert to the specified timezone and format
  return datetime
    .tz(timeZone || moment.tz.guess())
    .format('MMM DD, YYYY, hh:mm A')
}

export function convertUtcToLocal(utcDate: string, format: string) {
  // Convert utc to local
  const localTime = moment.utc(utcDate).tz(moment.tz.guess())

  // Format the date
  const formattedDate = localTime.format(format)

  return formattedDate
}

export function addCommas(number: number) {
  return number.toLocaleString()
}

export function addCommasWithCents(number: number) {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 2
  })
}

export function addTimeToDate(date: string, time: string) {
  // Parse the time string
  const [hours, minutes, seconds] = time.split(':').map(Number)

  // Convert hours, minutes, and seconds to milliseconds
  const millisecondsToAdd = (hours * 3600 + minutes * 60 + seconds) * 1000

  // Add milliseconds to the date
  return new Date(new Date(date).getTime() + millisecondsToAdd)
}

export function calcTimeDiffInMillisec(
  startDateTime: string,
  endDateTime: string
): number {
  // Parse the UTC datetime strings into moment objects
  const startMoment = moment.utc(startDateTime)
  const endMoment = moment.utc(endDateTime)

  // Calculate the difference in milliseconds
  const diffMilliseconds: number = endMoment.diff(startMoment)

  return diffMilliseconds
}

export function padStartTime(time: string) {
  const [hours, minutes, seconds] = time.split(':')
  return `${hours.padStart(2, '0')}:${minutes.padStart(
    2,
    '0'
  )}:${seconds.padStart(2, '0')}`
}

export function timeStringToMillisec(time: string) {
  // Split the time string into hours, minutes, and seconds
  const [hours, minutes, seconds = 0] = time.split(':').map(Number)

  // Calculate the total milliseconds
  const totalMilliseconds = (hours * 60 * 60 + minutes * 60 + seconds) * 1000

  return totalMilliseconds
}

export function timeToSeconds(time: string) {
  const parts = time.split(':')
  const hours = parseInt(parts[0])
  const minutes = parseInt(parts[1])
  const seconds = parseInt(parts[2])

  const totalSeconds = hours * 3600 + minutes * 60 + seconds
  return totalSeconds
}

export function calcTimeProgress(
  totalSeconds: number,
  remainingSeconds: number
) {
  return 100 - (100 * remainingSeconds) / totalSeconds
}

export function generateAvatarInitials(name: string): string {
  const nameArray: string[] = name.trim().split(' ')

  let initials: string = ''

  // Add the first character of the first word to initials
  if (nameArray.length > 0) {
    initials += nameArray[0].charAt(0).toUpperCase()
  }

  // Add the first character of the last word to initials
  if (nameArray.length > 1) {
    initials += nameArray[nameArray.length - 1].charAt(0).toUpperCase()
  }

  return initials
}

export function isTimeLessThan(timeString1: string, timeString2: string) {
  const [hours1, minutes1, seconds1] = timeString1.split(':').map(Number)

  const [hours2, minutes2, seconds2] = timeString2.split(':').map(Number)

  const totalSeconds1 = hours1 * 3600 + minutes1 * 60 + seconds1
  const totalSeconds2 = hours2 * 3600 + minutes2 * 60 + seconds2

  return totalSeconds1 < totalSeconds2
}

export function getCurrentDateTime() {
  const currentDate = new Date()

  // Get the date components
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')

  // Get the time components
  const hours = String(currentDate.getHours()).padStart(2, '0')
  const minutes = String(currentDate.getMinutes()).padStart(2, '0')
  const seconds = String(currentDate.getSeconds()).padStart(2, '0')

  // Concatenate the components into the desired format
  const currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

  return currentDateTime
}

export function isCourseCompleted(
  dateString: string,
  timezone = 'Asia/Singapore'
) {
  const date = moment.tz(dateString, timezone)
  const currentDate = moment().tz(timezone)
  return date.isBefore(currentDate)
}

export function isCaptureStreamSupported() {
  const video = document.createElement('video')
  return 'captureStream' in video || 'mozCaptureStream' in video
}

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')

  if (localPart.length <= 2) {
    // If local part is too short to mask, return the email as is
    return email
  }

  const firstChar = localPart[0]
  const lastChar = localPart[localPart.length - 1]
  const maskedLocalPart = `${firstChar}${'*'.repeat(
    localPart.length - 2
  )}${lastChar}`

  return `${maskedLocalPart}@${domain}`
}

export function truncateText(text: string, limit: number) {
  if (text.length <= limit) {
    return text
  }
  return text.slice(0, limit) + '...'
}

export function capitalize(string: string) {
  return (
    string.charAt(0).toUpperCase() + string.slice(1).replace(/([A-Z])/g, ' $1')
  )
}

export function aOrAn(word: string) {
  if (!word) return ''

  const lowerCaseWord = word.toLowerCase()

  return ['a', 'e', 'i', 'o', 'u'].includes(lowerCaseWord[0]) ? 'an' : 'a'
}

/**
 * Can also use Moment.js
 *
 * https://stackoverflow.com/a/76265684
 */
export function formatOrdinalNumber(
  num: number,
  rules = new Intl.PluralRules(undefined, { type: 'ordinal' })
): string {
  const category = rules.select(num)
  if (category === 'one') return `${num}st`
  if (category === 'two') return `${num}nd`
  if (category === 'few') return `${num}rd`
  return `${num}th`
}

export function getSimulationUsedTime(simulation: Simulation) {
  const timeUsed = calculateTimeUsed(simulation)

  if (timeUsed < 0) {
    return 0
  }

  return timeUsed
}

function calculateTimeUsed(simulation: Simulation) {
  if (simulation.resumed_at?.length) {
    let timeUsed = 0
    const parsedResumeValues = simulation.resumed_at
    const parsedPauseValues = simulation.paused_at

    timeUsed += calcTimeDiffInMillisec(
      simulation.started_at as string,
      parsedPauseValues[0]
    )

    parsedResumeValues.forEach((resumedAt, i) => {
      if (!!parsedPauseValues[i + 1]) {
        timeUsed += calcTimeDiffInMillisec(resumedAt, parsedPauseValues[i + 1])
      } else {
        if (simulation.ended_at === null) {
          timeUsed += calcTimeDiffInMillisec(
            resumedAt,
            moment.utc().toISOString()
          )
        } else {
          timeUsed += calcTimeDiffInMillisec(resumedAt, simulation.ended_at)
        }
      }
    })

    return timeUsed
  }
  if (simulation.paused_at?.length) {
    const parsedPauseValues = simulation.paused_at
    const timeUsed = calcTimeDiffInMillisec(
      simulation.started_at as string,
      parsedPauseValues[0]
    )
    return timeUsed
  }
  if (simulation.ended_at !== null) {
    const timeUsed = calcTimeDiffInMillisec(
      simulation.started_at as string,
      simulation.ended_at
    )
    return timeUsed
  }
  if (simulation.started_at !== null) {
    const timeUsed = calcTimeDiffInMillisec(
      simulation.started_at,
      moment.utc().toISOString()
    )
    return timeUsed
  }
  return 0
}

/** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder#description */
export function modulo(n: number, d: number) {
  return ((n % d) + d) % d
}

export function hasStringData(data: string | null | undefined): data is string {
  const trimmed = data?.trim()
  if (
    trimmed === null ||
    trimmed === undefined ||
    trimmed === '' ||
    trimmed === 'null' ||
    trimmed === 'undefined'
  )
    return false

  return true
}

/**
 * Access `sequence` item at `idx` with automatic "wrapping around" in case of excess or negative index
 *
 * `Array.prototype.at()` supports negative indices but not excess indices
 *
 * ```ts
 * wrappedAccess([1, 2, 3], 0)  // 1
 * wrappedAccess([1, 2, 3], 4)  // 2
 * wrappedAccess([1, 2, 3], -1) // 3
 * ```
 */
export function wrappedAccess<T>(
  sequence: ArrayLike<T>,
  idx: number
): T | undefined {
  const effectiveIdx = modulo(idx, sequence.length)
  const item = sequence[effectiveIdx]

  return item
}

export function formatLanguages(languages: string[] | null): string {
  if (!languages) {
    return 'No character languages'
  }

  const formattedLanguages = [...languages]

  if (formattedLanguages.length > 1) {
    const lastLanguage = formattedLanguages.pop()
    return `${formattedLanguages.join(', ')}${formattedLanguages.length > 1 ? ',' : ''} and ${lastLanguage}`
  }

  return formattedLanguages.join(', ')
}

export function formatCharacterBirthday(birthdayStr: string) {
  const date = new Date(birthdayStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  })

  if (date === 'Invalid Date') {
    return ''
  }

  return date
}

/** Splits e.g. `"A. Identification Information"` to `["A", "Identification Information"]` */
export function splitSectionName(section: string) {
  const parts = section.split('. ')
  if (parts.length !== 2) {
    console.warn('Section name has more parts than expected...?')
  }

  return parts
}

/**
 * Sorts e.g.
 *
 * `2, 3, 4, 6, 1a, 1b, 5a, Notes, 5b, 7, 13b, 13c, 13a, 10, 11, 12` to
 *
 * `1a, 1b, 2, 3, 4, 5a, 5b, 6, 7, 10, 11, 12, 13a, 13b, 13c, Notes`
 *
 * - https://blog.codinghorror.com/sorting-for-humans-natural-sort-order/
 * - https://fuzzytolerance.info/blog/2019/07/19/The-better-way-to-do-natural-sort-in-JavaScript/
 * - https://stackoverflow.com/a/64038833
 * - https://stackoverflow.com/a/52369951
 */
export function naturalSort(
  a: string,
  b: string,
  options?: {
    language?: Intl.LocalesArgument
    collatorOptions?: Intl.CollatorOptions
  }
) {
  const language =
    options?.language ?? navigator.languages[0] ?? navigator.language
  const collatorOptions = options?.collatorOptions ?? {
    numeric: true,
    ignorePunctuation: true
  }
  const collator = new Intl.Collator(language, collatorOptions)

  return collator.compare(a, b)
}

export const generateColumns = (
  data: CSVColumns,
  excludeKeys: string[] = [
    '_id',
    'created_at',
    'updated_at',
    'deleted_at',
    'options'
  ]
) => {
  return (
    data &&
    Object.keys(data)
      .filter((key) => !excludeKeys.includes(key))
      .map((key) => ({
        header: startCase(key),
        accessor: key
      }))
  )
}

export const isPathIncluded = (pathname: string, pattern: string): boolean => {
  const normalizedPathname = pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname

  const normalizedPattern = pattern.startsWith('/') ? pattern : `/${pattern}`

  return normalizedPathname.includes(normalizedPattern)
}

export function getUserOrgRole(user: User, orgSlug: string) {
  const orgMembership = user?.organizations?.find(
    (membership) => membership.organization.slug === orgSlug
  )

  const orgRole = orgMembership?.roles[0]

  return orgRole
}

export function getRoleSlug(role: string) {
  if (role === roles.superadmin) {
    return 'admin'
  }
  if (role === roles.admin) {
    return 'admin'
  }
  if (role === roles.trainer) {
    return 'trainer'
  }
  if (role === roles.learner) {
    return 'learner'
  }

  throw new Error('Unknown role')
}

// Function to get user organization data and sort based on organization slug
export function getUserOrgData(
  publicOrganization?: Organization,
  organizations?: Organization[],
  orgSlug?: string
): Organization[] {
  if (!publicOrganization) return []

  const organizationsData = organizations || []

  return [publicOrganization, ...organizationsData].sort((a, b) => {
    if (a?.slug === orgSlug) return -1
    if (b?.slug === orgSlug) return 1
    return 0
  })
}

/**
 * Prevents issues like the following:
 *
 * ```ts
 * replaceSlugs('/sample-org/learner/dashboard', {
 *   ['sample-org']: 'learner-inc',
 *   ['learner']: 'admin'
 * }) === '/admin-inc/learner/dashboard' // ❌
 *
 * replaceSlugs('/sample-org/learner/dashboard', {
 *   ['sample-org']: 'learner-inc',
 *   ['learner']: 'admin'
 * }) === '/learner-inc/admin/dashboard' // ✅
 * ```
 */
export function replaceSlugs(
  pathname: string,
  slugMap: Record<string, string>
) {
  const newPathname = pathname
    .split('/')
    .map((slug) => slugMap[slug] ?? slug)
    .join('/')

  return newPathname
}

export function formatPrice(
  price: number,
  currencyCode: string,
  options?: { withDecimals?: boolean }
) {
  const { withDecimals = false } = options ?? {}

  const minimumFractionDigits = !withDecimals ? 0 : undefined
  const maximumFractionDigits = !withDecimals ? 0 : undefined

  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits,
    maximumFractionDigits
  })
  const formatted = formatter.format(price)

  return formatted
}

export function sendToEagle3d(descriptor: Record<string, any>) {
  const obj = {
    cmd: 'sendToUe4',
    value: descriptor
  }

  const iframe = document.getElementById('iframe_1') as HTMLIFrameElement
  if (iframe) {
    iframe.contentWindow?.postMessage(JSON.stringify(obj), '*')
  } else {
    console.error('iframe_1 not found.')
  }
}

export function initializeCharacter(
  characterId: string,
  environmentId: string,
  personalityId: string
) {
  const character = `${environmentId}${characterId}${personalityId}`
  console.log('character:', character)
  sendToEagle3d({
    LevelCharacter: character
  })
}

export function millisecondsToTimeString(milliseconds: number) {
  if (milliseconds === -1) return 'unlimited'

  const seconds = Math.floor(milliseconds / 1000) % 60
  const minutes = Math.floor(milliseconds / (1000 * 60)) % 60
  const hours = Math.floor(milliseconds / (1000 * 60 * 60))

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export function replaceLongSpacesWithNewline(text: string) {
  if (typeof text !== 'string') return text
  return text.trim().replace(/\s+/g, ' ')
}

export function withoutFalsy<T extends object>(
  ...items: Array<T | false | null | undefined>
): T[] {
  const filtered = items.filter((item) => !!item)

  return filtered
}

export function pluralize(args: {
  word: string
  count: number
  suffix?: string
}) {
  const { word, count } = args
  const { suffix = 's' } = args

  if (count === 1) {
    return word
  }

  return word + suffix
}

export function orgPrefixRoute(orgRoles: string[]) {
  let role = orgRoles[0]
  if (role === roles.admin || role === roles.superadmin) {
    role = roles.admin
  }
  return role
}

export function apiFile(path: string) {
  return `${serverConfig.assetUrl}/${path}`
}

export function convertObjectToFormData(obj: object) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue

    formData.append(key, value)
  }

  return formData
}

/** Gets e.g. `Emilio` from `Emilio Rossi */
export function getFirstName(name: string) {
  const parts = name.trim().split(' ')
  if (parts.length < 1) {
    return name
  }

  const firstName = parts[0]

  return firstName
}

/** Converts e.g. `Emilio Rossi` to `Emilio R.` */
export function compactName(name: string) {
  const parts = name.trim().split(' ')
  if (parts.length < 2) {
    return name
  }

  const lastPart = parts.at(-1)
  if (lastPart === undefined) {
    return name
  }

  const lastPartInitial = lastPart[0]
  if (lastPartInitial === undefined) {
    return name
  }

  const firstParts = parts.slice(0, -1)
  const firstPartsStr = firstParts.join(' ')

  const compact = `${firstPartsStr} ${lastPartInitial}.`

  return compact
}

export function cleanAIResponse(response: string) {
  const index = response.indexOf(':')
  const cleanResponse = (
    index !== -1 ? response.substring(index + 1).trim() : response
  ).trim()
  return cleanResponse
}

export function msToTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = (totalSeconds % 3600) % 60

  return {
    totalSeconds,
    hours,
    minutes,
    seconds
  }
}

export const formatAgeText = (age: string | undefined) => {
  if (!age) return ''
  const numericAge = parseInt(age, 10)
  return `${numericAge} year${numericAge === 1 ? '' : 's'} old`
}

export function cleanTotalCompletedTime(totalCompletedTime: string) {
  if (totalCompletedTime.includes('-')) {
    return '00:00:00'
  }
  return totalCompletedTime
}

export function safe<T>(action: () => T) {
  try {
    return { data: action() }
  } catch (error) {
    return { error }
  }
}

/**
 * 'https://example.com/boo?q=foo&s=bar' -> 'boo'
 * 'https://example.com/foo/bar/baz'     -> 'baz'
 * 'https://example.com'                 -> 'https://example.com'
 * 'https://example.com/'                -> 'https://example.com/'
 * 'anything-else'                       -> 'anything-else'
 */
export function getLastUrlSegment(url: string) {
  const { data: segments } = safe(() => new URL(url).pathname.split('/'))

  const lastSegment = segments?.at(-1)
  if (isEmpty(lastSegment) || lastSegment === undefined) {
    return url
  }

  const decoded = decodeURIComponent(lastSegment)

  return decoded
}

export function checkIfQuestionHasOptions(optionType: string) {
  return [
    FormEnum.MCQ,
    FormEnum.MCQIF,
    FormEnum.MCQO,
    FormEnum.MCQIF_NOT_REQUIRED
  ].includes(optionType as FormEnum)
}
