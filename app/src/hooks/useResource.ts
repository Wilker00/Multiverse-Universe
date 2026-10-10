import { useCallback, useEffect, useState } from 'react'

export function useResource<T>(loader: () => Promise<T>, dependencies: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setData(await loader())
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The request failed.')
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    void reload()
  }, [reload])

  return { data, error, loading, reload, setData }
}
