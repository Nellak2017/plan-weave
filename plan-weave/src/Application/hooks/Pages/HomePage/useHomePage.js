import homeImgOne from '../../../../../public/Home-Page/svg-1-task-computer.svg'
import homeImgTwo from '../../../../../public/Home-Page/svg-2-todo.svg'

const NavData = {
    middleContentData: ({ user }) => ({ href: `/${user ? 'plan-weave' : ''}` }),
    rightContentData: ({ user, router, handleLogout }) => ({
        linkData: [
            { label: 'App', href: `/${user ? 'plan-weave' : ''}`, title: 'Go to Plan Weave App' },
            { label: `${user ? 'Log out' : 'Log in'}`, href: `/${user ? '' : 'login'}`, title: `${user ? 'Log out of' : 'Log into'} PlanWeave App`, onClick: user ? () => handleLogout(router) : null },
        ],
        lastButtonData: { label: 'Sign Up', href: '/signup', title: 'Sign up', }
    })
}
const body = [
    {
        topLine: 'Plan Weave', headline: 'Focus on what is important', buttonLabel: 'Get Started', img: homeImgOne, alt: 'Task SVG',
        description: 'From the simplest task to the busiest calendar, Plan Weave lets you see what you need to do by organizing tasks so you know what you are doing, why you are doing it, and how to do it.',
    },
    {
        topLine: 'Simple Todo', headline: 'Make a Simple Todo List', buttonLabel: 'Learn More about Plan Weave', img: homeImgTwo, alt: 'Thread View SVG',
        description: "If you need a way to quickly write down a list of tasks without all the views, simple tasks is right for you. You can drag and drop and re-organize your tasks however you want, and it will automatically calculate everything for you so you don't have to!",
    }
]
export const useHomePage = () => ({ NavData, body })