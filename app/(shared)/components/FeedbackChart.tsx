import { ComponentProps } from 'react'
import { wrappedAccess } from '@/app/(shared)/utils'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Text,
  XAxis,
  YAxis
} from 'recharts'
import { VerticalCoordinatesGenerator } from 'recharts/types/cartesian/CartesianGrid'

type DataEntry = {
  label: string
  value: number
}

type FeedbackChartProps = {
  data: DataEntry[]
  height?: ComponentProps<typeof ResponsiveContainer>['height']
  xAxisTickCt?: number
  xAxisDomain?: [number, number]
  xAxisUnit?: string
  yAxisWidth?: number
}

function removeDataEntriesOutsideXAxisDomain(
  data: DataEntry[],
  xAxisDomain: [number, number]
) {
  const filtered = data.filter(({ label, value }) => {
    const isOutsideDomain = value < xAxisDomain[0] || xAxisDomain[1] < value
    if (isOutsideDomain) {
      console.warn(
        `${label} (${value}) is beyond axis domain; will not be displayed...`
      )

      return false
    }

    return true
  })

  return filtered
}

function skipFirstLine(xAxisTickCt: number) {
  const generator: VerticalCoordinatesGenerator = ({ width, offset }) => {
    const leftOffset = offset.left
    const rightOffset = offset.right
    if (leftOffset === undefined || rightOffset === undefined) {
      console.warn('Feedback chart grid offsets not available')
      return []
    }

    const effectiveWidth = width - leftOffset - rightOffset
    const length = xAxisTickCt - 1

    /**
     * Counts `1, 2, ..., xAxisTickCt - 1`
     * Skipping 0 skips first line
     */
    const linePositions = Array.from(
      { length },
      (_, idx) => leftOffset + effectiveWidth * ((idx + 1) / length)
    )

    return linePositions
  }

  return generator
}

const Y_AXIS_KEY: keyof DataEntry = 'label'
const X_AXIS_KEY: keyof DataEntry = 'value'

/**
 * Looks like a React component, but actually is not.
 * e.g. cannot have hooks inside
 */
const createLabel: {
  Desktop: ComponentProps<typeof YAxis>['tick']
  Mobile: ComponentProps<typeof LabelList>['content']
} = {
  /** https://stackoverflow.com/a/56627878 */
  Desktop(props: ComponentProps<typeof Text> & { payload: { value: string } }) {
    const { y, payload } = props

    return (
      <Text
        x={0} // Align to leftmost side
        y={y}
        textAnchor='start'
        verticalAnchor='middle'
        fill='currentColor'
        className='text-neutral-gray-600'
      >
        {payload.value}
      </Text>
    )
  },

  Mobile(props) {
    const { y, value } = props

    const validCondition = typeof y === 'number'
    if (!validCondition) return null

    return (
      <Text
        x={4} // Prevent overflow outside chart
        y={y - 4} // Design has bottom spacing
        textAnchor='start'
        fill='currentColor'
        className='text-neutral-gray-600 uppercase font-medium'
      >
        {value}
      </Text>
    )
  }
}

function FeedbackChartDesktop(props: FeedbackChartProps) {
  const { xAxisUnit } = props

  /** According to design */
  const { height = 128 } = props
  const { xAxisTickCt = 5, xAxisDomain = [1, 5] } = props
  const { yAxisWidth = 175 } = props

  const data = removeDataEntriesOutsideXAxisDomain(props.data, xAxisDomain)

  return (
    <ResponsiveContainer
      width='100%'
      height={height}
      className='text-xs select-none'
    >
      <BarChart data={data} layout='vertical'>
        <CartesianGrid
          horizontal={false}
          verticalCoordinatesGenerator={skipFirstLine(xAxisTickCt)}
          stroke='currentColor'
          className='text-neutral-gray-200'
        />
        <XAxis
          type='number'
          orientation='top'
          axisLine={false}
          tickLine={false}
          tickCount={xAxisTickCt}
          domain={xAxisDomain}
          unit={xAxisUnit}
          stroke='currentColor'
          className='text-neutral-gray-400'
        />
        <YAxis
          type='category'
          dataKey={Y_AXIS_KEY}
          axisLine={false}
          tickLine={false}
          tick={createLabel.Desktop}
          width={yAxisWidth}
        />
        <Bar dataKey={X_AXIS_KEY}>
          {data.map((_, idx) => (
            <Cell
              key={idx}
              fill='currentColor'
              className={wrappedAccess(
                [
                  'text-purple-shade-lightest',
                  'text-purple-shade-darkest2',
                  'text-purple-shade-lighter',
                  'text-purple-shade-base'
                ],
                idx
              )}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function FeedbackChartMobile(props: FeedbackChartProps) {
  const { xAxisUnit } = props

  /** According to design */
  const { height = 198 } = props
  const { xAxisTickCt = 5, xAxisDomain = [1, 5] } = props
  const { yAxisWidth = 0 } = props

  const data = removeDataEntriesOutsideXAxisDomain(props.data, xAxisDomain)

  return (
    <ResponsiveContainer
      width='100%'
      height={height}
      className='text-xs select-none'
    >
      <BarChart data={data} layout='vertical' barCategoryGap='25%'>
        <CartesianGrid
          horizontal={false}
          verticalCoordinatesGenerator={skipFirstLine(xAxisTickCt)}
          stroke='currentColor'
          className='text-neutral-gray-200'
        />
        <XAxis
          type='number'
          orientation='top'
          axisLine={false}
          tickLine={false}
          tickCount={xAxisTickCt}
          domain={xAxisDomain}
          unit={xAxisUnit}
          stroke='currentColor'
          className='text-neutral-gray-400'
        />
        <YAxis type='category' width={yAxisWidth} />
        <Bar dataKey={X_AXIS_KEY} className='translate-y-2'>
          {data.map((_, idx) => (
            <Cell
              key={idx}
              fill='currentColor'
              className={wrappedAccess(
                [
                  'text-purple-shade-lightest',
                  'text-purple-shade-darkest2',
                  'text-purple-shade-lighter',
                  'text-purple-shade-base'
                ],
                idx
              )}
            />
          ))}

          <LabelList
            dataKey={Y_AXIS_KEY}
            position='top'
            content={createLabel.Mobile}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function FeedbackChart(props: FeedbackChartProps) {
  return (
    <>
      <div className='hidden lg:block'>
        <FeedbackChartDesktop {...props} />
      </div>
      <div className='lg:hidden'>
        <FeedbackChartMobile {...props} />
      </div>
    </>
  )
}

export default FeedbackChart
