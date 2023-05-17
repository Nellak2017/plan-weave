import * as Yup from 'yup'

/* 
Legend: 

name, 
efficiency,
eta,
ata,
parentThread,
dueDate,
dependencies,
value
*/

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
			is: (eta, ata) => eta !== null && ata !== null && eta !== 0 && ata !== 0,
			then: () => Yup.number()
				.min(0)
				.max(1)
				.test(
					'is-calculated-efficiency',
					'Efficiency must be equal to eta / ata, when eta / ata are not null and > 0',
					function (value) {
						const eta = this.resolve(Yup.ref('eta'))
						const ata = this.resolve(Yup.ref('ata'))
						if (eta && ata && eta !== 0 && ata !== 0) {
							return value === eta / ata
						}
						return true
					}
				),
			otherwise: () => Yup.number().nullable()
				.test(
					'is-non-null-efficiency',
					'Efficiency must be null when both eta and ata are null',
					function (value) {
						const eta = this.resolve(Yup.ref('eta'))
						const ata = this.resolve(Yup.ref('ata'))
						if (eta === null && ata === null && value !== null) {
							return false
						}
						return true
					}
				),
		})
		.default(null),
	eta: Yup.number()
		.nullable()
		.min(0.01)
		.default(null)
		.transform((value, originalValue) => {
			if (originalValue === '') {
				return null;
			}
			return value;
		}),
	ata: Yup.number()
		.nullable()
		.min(0.01)
		.default(null)
		.transform((value, originalValue) => {
			if (originalValue === '') {
				return null;
			}
			return value;
		}),
	parentThread: Yup.lazy((value) => {
		if (!value) {
			return Yup.mixed().nullable()
		}
		return Yup.object().shape({
			name: Yup.string()
				.required(),
		})
	}),
	dueDate: Yup.date().default(() => new Date())
		.transform((value, originalValue) => {
			if (originalValue === '') {
				return new Date();
			}
			return value;
		}),
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


export const fillDefaults = (obj) => {
	const filledObj = taskSchema.cast(obj)

	if (filledObj.eta && filledObj.ata) {
		const efficiency = filledObj.eta / filledObj.ata
		filledObj.efficiency = efficiency
	} else {
		filledObj.efficiency = null
	}

	if (!filledObj.parentThread) {
		filledObj.parentThread = null
	}

	return filledObj
}