import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import useApi from './use-api';
import { extractCorrectErrorMessage } from '@/lib/error';
import { licenceQueryKeys } from '@/lib/features/licences-keys';

export interface ILicence {
    id: number;
    license_type: string;
    title: string;
    advantages: string[];
    disadvantages: string[];
    description: string;
    fields: Record<string, boolean>;
}

const examples: ILicence[] = [
    {
        id: 1,
        license_type: 'MIT',
        title: 'MIT License',
        fields: {
            'Commercial Use': true,
            'Modification Allowed': true,
            'Private Use': true,
            'Distribution Allowed': true,
            'Patent Grant': false,
            Copyleft: false,
            'SaaS Use': true,
            'Linking Allowed': true,
        },
        advantages: [
            'Very permissive',
            'Easy to understand',
            'Widely recognized',
            'Good for commercial use',
        ],
        disadvantages: ['No explicit patent grant', 'No copyleft provisions'],
        description:
            'A permissive license that is short and to the point. It lets people do anything with your code with proper attribution and without warranty.',
    },
    {
        id: 2,
        license_type: 'Apache-2.0',
        title: 'Apache License 2.0',
        fields: {
            'Commercial Use': true,
            'Modification Allowed': true,
            'Private Use': true,
            'Distribution Allowed': true,
            'Patent Grant': true,
            Copyleft: false,
            'SaaS Use': true,
            'Linking Allowed': true,
        },
        advantages: [
            'Includes patent grant',
            'Permissive but more comprehensive than MIT',
            'Good for collaboration',
            'Corporate-friendly',
        ],
        disadvantages: ['More complex than MIT', 'Longer license text'],
        description:
            'A permissive license that also provides an express grant of patent rights from contributors to users.',
    },
    {
        id: 3,
        license_type: 'GPL-3.0',
        title: 'GNU GPLv3',
        fields: {
            'Commercial Use': true,
            'Modification Allowed': true,
            'Private Use': true,
            'Distribution Allowed': true,
            'Patent Grant': true,
            Copyleft: true,
            'SaaS Use': true,
            'Linking Allowed': false,
        },
        advantages: [
            'Strong copyleft protection',
            'Ensures software remains open',
            'Patent protections included',
            'Good for community projects',
        ],
        disadvantages: [
            'Restrictive for commercial use',
            'Complex requirements',
            'Viral nature can be problematic for some businesses',
        ],
        description:
            'A copyleft license that requires derived works to be distributed under the same license terms.',
    },
    {
        id: 4,
        license_type: 'LGPL-3.0',
        title: 'GNU LGPLv3',
        fields: {
            'Commercial Use': true,
            'Modification Allowed': true,
            'Private Use': true,
            'Distribution Allowed': true,
            'Patent Grant': true,
            Copyleft: true,
            'SaaS Use': true,
            'Linking Allowed': true,
        },
        advantages: [
            'Less restrictive than GPL for linking',
            'Good for libraries',
            'Allows combination with proprietary code',
        ],
        disadvantages: [
            'Still complex for some commercial uses',
            'Linking requirements can be confusing',
        ],
        description:
            'A weaker copyleft license that allows linking with non-GPL software.',
    },
    {
        id: 5,
        license_type: 'AGPL-3.0',
        title: 'GNU AGPLv3',
        fields: {
            'Commercial Use': true,
            'Modification Allowed': true,
            'Private Use': true,
            'Distribution Allowed': true,
            'Patent Grant': true,
            Copyleft: true,
            'SaaS Use': false,
            'Linking Allowed': false,
        },
        advantages: [
            'Strongest copyleft protection',
            'Covers network/SaaS use',
            'Ensures service providers share modifications',
        ],
        disadvantages: [
            'Very restrictive for SaaS applications',
            'Can deter commercial adoption',
            'Complex compliance requirements',
        ],
        description:
            'A strong copyleft license that extends the GPL to network software-as-a-service applications.',
    },
    {
        id: 6,
        license_type: 'BSD-3-Clause',
        title: 'BSD 3-Clause',
        fields: {
            'Commercial Use': true,
            'Modification Allowed': true,
            'Private Use': true,
            'Distribution Allowed': true,
            'Patent Grant': false,
            Copyleft: false,
            'SaaS Use': true,
            'Linking Allowed': true,
        },
        advantages: [
            'Very permissive',
            'Simple terms',
            'Allows commercial use',
            'No copyleft requirements',
        ],
        disadvantages: [
            'No patent grant',
            'Non-endorsement clause can be problematic for some',
        ],
        description:
            "A permissive license similar to the MIT License, but with an additional clause prohibiting use of the licensor's name for endorsement.",
    },
    {
        id: 7,
        license_type: 'CC-BY-4.0',
        title: 'Creative Commons Attribution 4.0',
        fields: {
            'Commercial Use': true,
            'Modification Allowed': true,
            'Private Use': true,
            'Distribution Allowed': true,
            'Patent Grant': false,
            Copyleft: false,
            'SaaS Use': true,
            'Linking Allowed': true,
        },
        advantages: [
            'Simple attribution requirement',
            'Good for creative works',
            'Flexible reuse options',
        ],
        disadvantages: [
            'Not specifically designed for software',
            'No software-specific protections',
        ],
        description:
            'A Creative Commons license that allows for redistribution and reuse with attribution.',
    },
    {
        id: 8,
        license_type: 'MPL-2.0',
        title: 'Mozilla Public License 2.0',
        fields: {
            'Commercial Use': true,
            'Modification Allowed': true,
            'Private Use': true,
            'Distribution Allowed': true,
            'Patent Grant': true,
            Copyleft: true,
            'SaaS Use': true,
            'Linking Allowed': true,
        },
        advantages: [
            'Balanced approach between permissive and copyleft',
            'File-level copyleft',
            'Good for libraries',
            'Patent protections included',
        ],
        disadvantages: [
            'File-level copyleft can be complex',
            'Less known than MIT/GPL',
        ],
        description:
            'A weak copyleft license that maintains copyleft on the original files but allows combining with other code under different terms.',
    },
    {
        id: 9,
        license_type: 'Unlicense',
        title: 'The Unlicense',
        fields: {
            'Commercial Use': true,
            'Modification Allowed': true,
            'Private Use': true,
            'Distribution Allowed': true,
            'Patent Grant': false,
            Copyleft: false,
            'SaaS Use': true,
            'Linking Allowed': true,
        },
        advantages: [
            'Maximally permissive',
            'Public domain equivalent',
            'No restrictions whatsoever',
        ],
        disadvantages: [
            'No warranty or liability protection',
            'Uncertain legal status in some jurisdictions',
            'Not recommended for serious projects',
        ],
        description:
            'A public domain dedication that allows anyone to use the code for any purpose without restrictions.',
    },
    {
        id: 10,
        license_type: 'Artistic-2.0',
        title: 'Artistic License 2.0',
        fields: {
            'Commercial Use': true,
            'Modification Allowed': true,
            'Private Use': true,
            'Distribution Allowed': true,
            'Patent Grant': false,
            Copyleft: false,
            'SaaS Use': true,
            'Linking Allowed': true,
        },
        advantages: [
            'Flexible for artistic works',
            'Allows for artistic control',
            'Good for Perl modules',
        ],
        disadvantages: [
            'Less common for pure software',
            'Somewhat ambiguous terms',
            'Not widely understood',
        ],
        description:
            'A license originally designed for Perl that allows for modification and distribution while maintaining some artistic control.',
    },
];

export function useLicences() {
    const api = useApi().privateApi;
    const fetchLicences = useCallback(async () => {
        try {
            const response = await api.get<ILicence[]>('/licences');
            return response.data;
        } catch (error) {
            console.error('Error fetching licences:', error);
            throw new Error(extractCorrectErrorMessage(error));
        }
    }, []);
    const licenceQuery = useQuery({
        queryKey: licenceQueryKeys.all,
        queryFn: fetchLicences,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: false,
        initialData: examples,
    });
    return licenceQuery;
}
