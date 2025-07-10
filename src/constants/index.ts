export type NavigationItem = {
  id: string;
  title: string;
  url: string;
  isLoggedIn: boolean;
  requiresAuth: boolean;
  dropdownItems: NavigationItem[];
  icon: string;
};

export const navigation: NavigationItem[] = [
  {
    id: '0',
    title: 'Datasets',
    url: '/',
    isLoggedIn: false,
    requiresAuth: false,
    dropdownItems: [],
    icon: '/assets/datalab/Group.svg',
  },
  {
    id: '1',
    title: 'Dashboards',
    url: '/data-dashboards',
    isLoggedIn: false,
    requiresAuth: false,
    dropdownItems: [],
    icon: '/assets/datalab/Icon.svg',
  },
  {
    id: '2',
    title: 'Reports',
    url: '/reports',
    isLoggedIn: false,
    requiresAuth: false,
    dropdownItems: [],
    icon: '/assets/datalab/Vector.svg',
  },
];

type SocialLink = {
  id: string;
  name: string;
  url: string;
};

export const socials: SocialLink[] = [
  {
    id: '0',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/datawise-africa',
  },
  {
    id: '1',
    name: 'Github',
    url: 'https://github.com/Datawise-Africa',
  },
];

export const cookieOptions = {
  httpOnly: true,
  /* eslint-disable no-undef */
  secure: process.env.NODE_ENV !== 'production',

  maxAge: 60 * 60 * 24 * 7, // One week
  path: '/',
};

// export const REACT_PUBLIC_API_HOST = "http://localhost:8000"
export const REACT_PUBLIC_API_HOST =  'https://backend.datawiseafrica.com';

