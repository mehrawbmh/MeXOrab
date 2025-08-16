import { useEffect } from 'react'

export function useApplyQueryParams(apply: (params: URLSearchParams) => void) {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      if ([...params.keys()].length > 0) apply(params)
    } catch {
    }
  }, [apply])
}

export function setQueryParams(params: Record<string, string | undefined>) {
  try {
    const url = new URL(window.location.href)
    for (const [k, v] of Object.entries(params)) {
      if (v == null || v === '') url.searchParams.delete(k)
      else url.searchParams.set(k, v)
    }
    const relative = url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : '') + (url.hash || '')
    window.history.replaceState({}, '', relative)
  } catch {
  }
}


