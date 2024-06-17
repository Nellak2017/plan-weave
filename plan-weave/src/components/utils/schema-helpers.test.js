import {
	coerceToSchema, // only covered by example based tests
} from './schema-helpers.mjs'
import { simpleTaskSchema } from '../schemas/simpleTaskSchema/simpleTaskSchema.js'
import { fc } from '@fast-check/jest'
import * as Yup from 'yup'
import { formatISO } from 'date-fns'

describe('coerceToSchema', () => {
	test('coerceToSchema example test', () => {
		const schema = Yup.object().shape({
			name: Yup.string().default('Anonymous'),
			age: Yup.number().default(0),
			email: Yup.string().email().default('no-reply@example.com')
		})

		const data = {
			name: 'John Doe',
			age: 'invalid-age',
			// email is missing
		}

		const result = coerceToSchema(data, schema)

		expect(result.data).toEqual({ name: 'John Doe', age: 0, email: 'no-reply@example.com' })
		expect(result.warnings).toEqual([
			'Field age was invalid and was coerced to 0',
			'Field email was missing and was set to no-reply@example.com'
		])
	})
})
