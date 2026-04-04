import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as authService from '@/services/authService'
import apiClient from '@/services/apiClient'

vi.mock('@/services/apiClient')

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('register', () => {
    it('should register user successfully', async () => {
      const mockResponse = {
        data: {
          user: { id: 1, name: 'John Doe', email: 'john@example.com' },
          token: 'mock-jwt-token'
        }
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const result = await authService.register('John Doe', 'john@example.com', 'password123')

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockResponse = {
        data: {
          user: { id: 1, name: 'John Doe', email: 'john@example.com' },
          token: 'mock-jwt-token'
        }
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const result = await authService.login('john@example.com', 'password123')

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'john@example.com',
        password: 'password123'
      })
      expect(result).toEqual(mockResponse.data)
    })
  })
})
