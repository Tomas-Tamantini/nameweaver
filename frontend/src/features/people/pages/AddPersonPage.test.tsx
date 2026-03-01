import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { createPerson } from '@/features/people/services/people-service'
import { buildPerson } from '@/test/factories/person'
import { toast } from 'sonner'
import AddPersonPage from './AddPersonPage'

vi.mock('@/features/people/services/people-service', () => ({
  createPerson: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockedCreatePerson = vi.mocked(createPerson)

function renderAddPersonPage() {
  render(
    <MemoryRouter initialEntries={['/people/new']}>
      <Routes>
        <Route path="/people/new" element={<AddPersonPage />} />
        <Route path="/people" element={<h2>People destination</h2>} />
      </Routes>
    </MemoryRouter>,
  )
}

afterEach(() => {
  mockedCreatePerson.mockReset()
  vi.clearAllMocks()
  cleanup()
})

describe('AddPersonPage', () => {
  it('renders form fields and submit action', () => {
    renderAddPersonPage()

    expect(
      screen.getByRole('heading', { name: 'Add person' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'Short description' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute(
      'href',
      '/people',
    )
    expect(
      screen.getByRole('button', { name: 'Save person' }),
    ).toBeInTheDocument()
  })

  it('navigates to people page when clicking cancel', () => {
    renderAddPersonPage()

    fireEvent.click(screen.getByRole('link', { name: 'Cancel' }))

    expect(
      screen.getByRole('heading', { name: 'People destination' }),
    ).toBeInTheDocument()
  })

  it('shows validation errors for empty required fields', async () => {
    renderAddPersonPage()

    fireEvent.click(screen.getByRole('button', { name: 'Save person' }))

    expect(await screen.findByText('Name is required.')).toBeInTheDocument()
    expect(
      await screen.findByText('Short description is required.'),
    ).toBeInTheDocument()
    expect(mockedCreatePerson).not.toHaveBeenCalled()
  })

  it('submits valid values, shows success toast, and navigates to people page', async () => {
    mockedCreatePerson.mockResolvedValue(buildPerson({ id: 99 }))

    renderAddPersonPage()

    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), {
      target: { value: 'Ada Lovelace' },
    })
    fireEvent.change(
      screen.getByRole('textbox', { name: 'Short description' }),
      {
        target: { value: 'Met at a conference.' },
      },
    )

    fireEvent.click(screen.getByRole('button', { name: 'Save person' }))

    await waitFor(() => {
      expect(mockedCreatePerson).toHaveBeenCalledWith({
        name: 'Ada Lovelace',
        description: 'Met at a conference.',
      })
    })

    expect(toast.success).toHaveBeenCalledWith('Person added')
    expect(
      screen.getByRole('heading', { name: 'People destination' }),
    ).toBeInTheDocument()
  })

  it('shows a form-level alert when the service fails', async () => {
    mockedCreatePerson.mockRejectedValue({
      code: 'CREATE_PERSON_FAILED',
      message: 'Service unavailable right now.',
      status: 503,
    })

    renderAddPersonPage()

    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), {
      target: { value: 'Grace Hopper' },
    })
    fireEvent.change(
      screen.getByRole('textbox', { name: 'Short description' }),
      {
        target: { value: 'Former colleague.' },
      },
    )

    fireEvent.click(screen.getByRole('button', { name: 'Save person' }))

    expect(
      await screen.findByText('Service unavailable right now.'),
    ).toBeInTheDocument()
    expect(toast.error).not.toHaveBeenCalled()
  })
})
