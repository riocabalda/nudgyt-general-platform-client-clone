import { Button } from '../../ui/button'

type DownloadLinkType = keyof typeof DownloadLinkMap

const DownloadLinkMap = {
  rubric_template: {
    text: 'Download Rubrics Template',
    fileNames: ['rubric_template.csv', 'rubric_template_guide.pdf']
  },
  simulation_form_template: {
    text: 'Download Form Template',
    fileNames: [
      'simulation_form_template.csv',
      'simulation_form_template_guide.pdf'
    ]
  }
} as const

function triggerDownload(fileName: string) {
  const filePath = `/forms/${fileName}`

  const link = document.createElement('a')
  link.href = filePath
  link.download = fileName

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function DownloadLinkButton(props: { type: DownloadLinkType }) {
  const { type } = props

  const { text, fileNames } = DownloadLinkMap[type]

  function downloadFiles() {
    for (const fileName of fileNames) {
      triggerDownload(fileName)
    }
  }

  return (
    <Button
      variant='link'
      onClick={downloadFiles}
      className='p-0 m-0 lg:p-0 lg:m-0 w-auto h-auto'
    >
      {text}
    </Button>
  )
}

export default DownloadLinkButton
