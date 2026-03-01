import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'
import { resetPersonSequence } from './factories/person'

beforeEach(() => {
  resetPersonSequence()
})
