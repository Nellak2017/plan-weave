import * as Yup from 'yup'

export const taskSchema = Yup.object({
	name: Yup.string()
		.max(50, 'Name must be at most 50 characters')
		.required('Name is required')
		.test('is-string', 'Name must be a string', (value) => {
			return typeof value === 'string'
		}),
	efficiency: Yup.number()
		.nullable()
		.when(['eta', 'ata'], {
			is: (eta, ata) => eta !== undefined && ata !== undefined && eta !== 0 && ata !== 0,
			then: () => Yup.number()
				.min(0)
				.max(1)
				.test(
					'is-calculated-efficiency',
					'Efficiency must be equal to eta / ata',
					function (value) {
						const eta = this.resolve(Yup.ref('eta'))
						const ata = this.resolve(Yup.ref('ata'))
						if (eta && ata && eta !== 0 && ata !== 0) {
							return value === eta / ata
						}
						return true
					}
				),
			otherwise: () => Yup.number().nullable(),
		})
		.default(null),
	eta: Yup.number()
		.min(0.01)
		.required(),
	ata: Yup.number()
		.min(0.01)
		.required(),
	parentThread: Yup.lazy((value) => {
		if (!value) {
			return Yup.mixed().nullable()
		}
		return Yup.object().shape({
			name: Yup.string()
				.required(),
		})
	}),
	dueDate: Yup.date()
		.nullable(),
	dependencies: Yup.array()
		.of(Yup.lazy((value) => {
			if (!value) {
				return Yup.mixed().nullable()
			}
			return taskSchema
		}))
		.default([]),
	value: Yup.number()
		.min(0)
		.required(),
}).default({})
