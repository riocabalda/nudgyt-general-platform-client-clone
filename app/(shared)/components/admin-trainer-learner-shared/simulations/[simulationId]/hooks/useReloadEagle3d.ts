import { useEffect, useRef } from 'react'

function useReloadEagle3d(simulationLink: string) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const reloadEagle3d = () => {
    const iframe = document.getElementById('iframe_1') as HTMLIFrameElement
    if (iframe && iframe.src) {
      const currentSrc = iframe.src
      iframe.src = simulationLink

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        iframe.src = currentSrc
      }, 100)
    }
  }

  return { reloadEagle3d }
}

export default useReloadEagle3d
