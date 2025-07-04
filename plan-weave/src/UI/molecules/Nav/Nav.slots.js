import { Button } from "@mui/material"
import Image from 'next/image'
import { BsArrowRightShort } from 'react-icons/bs'
import Link from 'next/link'
import { Logo, SiteTitle, LoginContainer, StyledNav, ContentContainer } from './Nav.elements'

// The below Components are the default components for Nav that can be customized
export const LeftContent = ({
    state: {
        href = '/', logoPath = { src: '/Plan-Weave-Logo-Square.png' }, alt = 'Plan Weave Logo', tabIndex = 0, title = 'Organize your tasks with Plan Weave',
        dimensions: { width = 64, height = 61 } = {},
    } = {}
}) => (
    <Logo className='logo' tabIndex={tabIndex}>
        <Link href={href} tabIndex={tabIndex}><Image src={logoPath.src} alt={alt} width={width} height={height} title={title} aria-label={title} /></Link>
    </Logo>
)
export const MiddleContent = ({ state: { label = 'Plan Weave', href = '/plan-weave', tabIndex = 0, title = 'Go to Plan Weave App' } = {} }) => (
    <SiteTitle><Link href={href} tabIndex={tabIndex} title={title} aria-label={title}>{label}</Link></SiteTitle>
)
export const RightContent = ({
    state: {
        prevComponent = <></>,
        linkData = [
            { label: 'App', href: '/plan-weave', title: 'Go to Plan Weave App', onClick: null },
            { label: 'Log in', href: '/login', title: 'Log into PlanWeave App', onClick: null },
        ],
        lastButtonData = { label: 'Sign Up', href: '/signup', title: 'Sign up', onClick: null },
        postComponent = <></>,
    } = {}
}) => (
    <LoginContainer>
        {prevComponent}
        {linkData?.map(({ label, href, title, onClick }) => <Link key={label} href={href} title={title} onClick={e => { if (onClick) { onClick(e) } }}>{label}</Link>)}
        {lastButtonData &&
            <Link href={lastButtonData?.href} className={'sign-up'} onClick={e => { if (lastButtonData?.onClick) { lastButtonData?.onClick(e) } }}>
                <Button title={lastButtonData?.title} aria-label={lastButtonData?.title}>
                    {lastButtonData?.label}<BsArrowRightShort />
                </Button>
            </Link>}
        {postComponent}
    </LoginContainer>
)
export const DefaultContainer = ({ left, middle, right }) => (<StyledNav><ContentContainer>{left}{middle}{right}</ContentContainer></StyledNav>)