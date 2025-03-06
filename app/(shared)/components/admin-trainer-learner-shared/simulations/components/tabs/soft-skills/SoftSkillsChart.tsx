import { modulo } from '@/app/(shared)/utils'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Text
} from 'recharts'

type DataEntry = {
  label: string
  total: number
  value: number
}

type Adjustment = { intersperse: boolean } | null

/** Does not seem to be possible via CSS... */
const STYLES = {
  sizes: {
    chartRadius: { sm: '56%', md: '75%', lg: '100%' },

    /** Constrains the text width. Any [small] number seems to work... */
    labels: { width: 20 }
  }
}

function getRadarClass(idx: number) {
  type Classes = {
    common: string
    shades: string[]
  }

  const classes: Classes | null = {
    common: 'text-purple-shade-base',
    shades: [
      'text-purple-shade-lightest',
      'text-purple-shade-darkest',
      'text-purple-shade-lighter'
    ]
  }

  const isOddIdx = idx % 2 !== 0
  if (isOddIdx) return classes.common

  /**
   * ```
   * 0 -> 0
   * 2 -> 1
   * 4 -> 2
   * 6 -> 3
   * ```
   *
   * Wrapped around to defined shade count
   */
  const shadeIdx = Math.floor(idx / 2) % classes.shades.length
  return classes.shades[shadeIdx]
}

/**
 * Reshape data to
 * ```ts
 * {
 *   label,
 *   total,
 *   ...{
 *     A
 *     B
 *     C
 *     // As many letters as there are data entries
 *   }
 * }
 * ```
 *
 * This will create individual radars according to the data count
 *
 * The letters represent each radar
 */
function prepareDataForChart(data: DataEntry[]) {
  const radarKeys = data.map((_, idx) =>
    String.fromCharCode('A'.charCodeAt(0) + idx)
  )

  const chartData = data.map(({ label, total, value }, dataIdx) => {
    const radarData: Record<string, unknown> = { label, total }

    const validRadarIdx = [dataIdx, modulo(dataIdx - 1, data.length)]
    radarKeys.forEach((key, radarIdx) => {
      let sliceValue = 0
      if (validRadarIdx.includes(radarIdx)) sliceValue = value

      radarData[key] = sliceValue
    })

    return radarData
  })

  return { radarKeys, chartData }
}

/**
 * Looks like a React component, but actually is not.
 * e.g. cannot have hooks inside
 *
 * https://stackoverflow.com/a/69407060
 */
function createChartLabel(
  props: ComponentProps<typeof Text> & {
    payload: { value: string | number; index: number }
  },
  adjustments?: Adjustment[]
) {
  const { x, y, cx, cy, payload } = props

  const arePropsValid =
    typeof x === 'number' &&
    typeof y === 'number' &&
    typeof cx === 'number' &&
    typeof cy === 'number'

  if (!arePropsValid) {
    return <Text {...props} />
  }

  /** Scale the labels away from the chart center by this factor */
  const factor = 1.1
  const scaledX = cx + (x - cx) * factor
  const scaledY = cy + (y - cy) * factor

  let value = `${payload.value}`

  /**
   * Recharts' `<Text />` component automatically "wraps" its content
   * by dividing it into several `<tspan>` elements.
   *
   * When the content exceeds the `width` attribute, it is broken at the whitespaces.
   * However when there are no whitespaces, it is still displayed as is, causing clipping issues.
   *
   * This attempts to trigger the "wrapping" behavior by adding artificial spaces in the text.
   *
   * - https://github.com/recharts/recharts/issues/198
   * - https://recharts.org/en-US/api/Text#width
   */
  const intersperse = adjustments?.[payload.index]?.intersperse ?? false
  if (intersperse) {
    value = value
      .split(' ')
      .map((word) => {
        const midIdx = Math.ceil(word.length / 2)
        const firstHalf = word.slice(0, midIdx)
        const secondHalf = word.slice(midIdx)

        return `${firstHalf} ${secondHalf}`
      })
      .join(' ')
  }

  return (
    <Text
      {...props}
      verticalAnchor='middle'
      x={scaledX}
      y={scaledY}
      width={STYLES.sizes.labels.width}
    >
      {value}
    </Text>
  )
}

/** https://recharts.org/en-US/examples/SpecifiedDomainRadarChart */
function SoftSkillsChart(props: {
  data: DataEntry[]
  size?: 'sm' | 'md' | 'lg'
  withLabels?: boolean
}) {
  const { data, size = 'lg', withLabels = false } = props

  const [adjustments, setAdjustments] = useState<Adjustment[] | undefined>(
    undefined
  )
  const containerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    function performAdjustments() {
      const container = containerRef.current
      if (container === null) return

      const charts = container.getElementsByClassName('recharts-surface')
      if (charts.length !== 1) return

      const chart = charts[0]
      const chartRect = chart.getBoundingClientRect()

      const labels = chart.getElementsByClassName('recharts-text')
      const adjustments: Adjustment[] = Array.from(labels, (label) => {
        const labelRect = label.getBoundingClientRect()

        const isClippingLeft = labelRect.left < chartRect.left
        const isClippingRight = chartRect.right < labelRect.right

        /** Also check top and bottom? */
        if (isClippingLeft || isClippingRight) {
          return { intersperse: true }
        }

        return null
      })

      setAdjustments(adjustments)
    }

    setAdjustments(undefined)
    setTimeout(performAdjustments)
  }, [data])

  const { radarKeys, chartData } = prepareDataForChart(data)
  const labelsKey: keyof DataEntry = 'label'

  const chartRadius = STYLES.sizes.chartRadius[size]

  let domainMin = 0
  let domainMax = -Infinity
  for (const entry of data) {
    if (entry.total < domainMin) domainMin = entry.total
    if (entry.total > domainMax) domainMax = entry.total
  }
  const domain = [domainMin, domainMax]

  /** Offset for 0 value */
  const tickCt = domainMax + 1

  return (
    <ResponsiveContainer
      ref={containerRef}
      width='100%'
      height='100%'
      className='text-xs select-none'
    >
      <RadarChart cx='50%' cy='50%' outerRadius={chartRadius} data={chartData}>
        <PolarGrid stroke='currentColor' className='text-neutral-gray-400' />
        {withLabels && (
          <PolarAngleAxis
            dataKey={labelsKey}
            axisLine={false}
            tickLine={false}
            tick={(props) => createChartLabel(props, adjustments)}
            stroke='currentColor'
            className='text-neutral-gray-600'
          />
        )}
        <PolarRadiusAxis
          tickCount={tickCt}
          tick={false}
          axisLine={false}
          domain={domain}
        />
        {radarKeys.map((key, idx) => (
          <Radar
            key={key}
            dataKey={key}
            fill='currentColor'
            className={getRadarClass(idx)}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  )
}

export default SoftSkillsChart
