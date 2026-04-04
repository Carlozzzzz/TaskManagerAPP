import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useToast } from '@/hooks/useToast'
import { ToastProvider } from '@/context/ToastProvider'

describe('useToast', () => {
  it('should provide toast context', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    )

    const { result } = renderHook(() => useToast(), { wrapper })

    expect(result.current).toBeDefined()
    expect(result.current.showToast).toBeDefined()
  })

  it('should throw error when used outside ToastProvider', () => {
    expect(() => {
      renderHook(() => useToast())
    }).toThrow('useToast must be used within ToastProvider')
  })
})
