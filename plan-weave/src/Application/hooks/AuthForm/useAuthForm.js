import { variant as variantSelector } from '../../selectors.js'

export const useAuthForm = () => {
    const variant = variantSelector()
    return { variant, maxwidth: 409 }
}