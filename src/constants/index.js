
export const navigation = [
    {
        id: "0",
        title: "Datasets",
        "url": "/",
        isLoggedIn: false,
        requiresAuth: false,
        dropdownItems: []
    },
    {
        id: "1",
        title: "Dashboards",
        "url": "/data-dashboards",
        isLoggedIn: false,
        requiresAuth: false,
        dropdownItems: []
    },
    {
        id: "2",
        title: "Reports",
        "url": "/reports",
        isLoggedIn: false,
        requiresAuth: false,
        dropdownItems: []
    }
]

export const socials = [
    {
        id: "0",
        name: "LinkedIn",
        url: "https://www.linkedin.com/company/datawise-africa",
    },
    {
        id: "1",
        name: "Github",
        url: "https://github.com/Datawise-Africa",
    },
]

export const cookieOptions = {
    httpOnly: true,
    /* eslint-disable no-undef */
    secure: process.env.NODE_ENV !== 'production',
     
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/'
}

// export const REACT_PUBLIC_API_HOST = "http://localhost:8000"
export const REACT_PUBLIC_API_HOST = "https://backend.datawiseafrica.com"