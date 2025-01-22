import React, { useState, useMemo } from 'react'
import {
	StyledContainer,
	DropdownMenu,
	DropdownMenuItem
} from './Select.elements.js'
import TaskInput from '../TaskInput/TaskInput.js'
import { toast } from 'react-toastify'

export function Select({ variant, services, state }) {
	const { onChange, onBlur } = services || {}
	const { options, initialValue, placeholder, title, controlledValue, minLength, maxLength } = state || {}

	const [selectedOption, setSelectedOption] = useState(initialValue || '')
	const [isOpen, setIsOpen] = useState(false)

	const optionToUse = useMemo(() => controlledValue !== undefined ? controlledValue : selectedOption, [controlledValue, selectedOption])

	const handleChange = e => {
		setIsOpen(true)
		const value = e.target.value.toString()
		setSelectedOption(value)
		if (onChange) onChange(value)
	}
	const handleBlur = e => {
		setIsOpen(false)
		const value = e.target.value
		const tooSmall = value.length < minLength
		const tooLarge = value.length > maxLength
		if (tooSmall || tooLarge) {
			console.warn(`The input value for the Select is too ${tooSmall ? 'small' : 'large'}. ${value}`)
			toast.warn(`The input value for the Select is too ${tooSmall ? 'small' : 'large'}.`)
			return // This stops the parent from getting updated onBlur. Parents should use min/max length carefully
		}
		if (onBlur) onBlur(value)
	}

	return (
		<StyledContainer>
			<TaskInput
				title={title || 'Create or Select Task Thread.'}
				variant={variant}
				onChange={handleChange}
				onBlur={handleBlur}
				placeholder={placeholder}
				initialValue={initialValue}
				controlledValue={optionToUse}
			/>
			<DropdownMenu open={isOpen}>
				{options
					?.filter(option => option?.toLowerCase() !== optionToUse.toLowerCase()
						&& option?.toLowerCase().startsWith(optionToUse.toLowerCase() || " "))
					.map((option, index) => (
						<DropdownMenuItem
							key={option || `unique: ${index}`}
							onMouseDown={() => {
								setSelectedOption(option)
								setIsOpen(false)
							}}
						>
							{option}
						</DropdownMenuItem>
					))}
			</DropdownMenu>
		</StyledContainer>
	)
}
export default Select