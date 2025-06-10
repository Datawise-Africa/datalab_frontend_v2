import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import type { UseFormReturn } from 'react-hook-form';
import { Input } from '../ui/input';
import { IconInput } from '../ui/icon-input';
import { AtSign, Building, X } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { useState } from 'react';
import { Button } from '../ui/button';

type Step3Props = {
    form: UseFormReturn;
};

interface Author {
    id: string;
    first_name: string;
    last_name: string;
    title: string;
    email: string;
}
const baseAuthors: Author[] = [
    {
        id: crypto.randomUUID(),
        first_name: '',
        last_name: '',
        title: '',
        email: '',
    },
];
export default function Step3({ form }: Step3Props) {
    const [authors, setAuthors] = useState<Author[]>(baseAuthors);
    const addAuthor = () => {
        const newAuthor: Author = {
            id: crypto.randomUUID(),
            first_name: '',
            last_name: '',
            title: '',
            email: '',
        };
        setAuthors([...authors, newAuthor]);
        form.setValue('authors', [...authors, newAuthor]);
    };
    const removeAuthor = (id: string) => {
        setAuthors(authors.filter((author) => author.id !== id));
        form.setValue(
            'authors',
            authors.filter((author) => author.id !== id),
        );
    };
    // const updateAuthor = (id: string, field: string, value: string) => {
    //     setAuthors(
    //         authors.map((author) =>
    //             author.id === id ? { ...author, [field]: value } : author,
    //         ),
    //     );
    //     form.setValue('authors', authors);
    // };

    return (
        <div>
            <div>
                <div className="mb-6 flex items-center justify-between">
                    <h1>Authors</h1>
                    <Button onClick={addAuthor}>Add Author</Button>
                </div>
                {authors.map((author, index) => (
                    <div
                        key={author.id}
                        className="mb-4 rounded-md border border-primary/30 p-4 shadow-sm"
                    >
                        <div className="mb-2 flex items-center justify-between">
                            <h2>
                                Author {index + 1}: {author.first_name}{' '}
                                {author.last_name}
                            </h2>
                            {index > 0 && (
                                <Button
                                    variant="ghost"
                                    onClick={() => removeAuthor(author.id)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Title */}
                            <FormField
                                control={form.control}
                                name={`authors.${index}.title`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl className="">
                                            <Select {...field}>
                                                <SelectTrigger className="border-primary/30 w-full">
                                                    <SelectValue placeholder="Theme" />
                                                </SelectTrigger>
                                                <SelectContent className="border-primary/30 w-full bg-white">
                                                    <SelectItem value="light">
                                                        Light
                                                    </SelectItem>
                                                    <SelectItem value="dark">
                                                        Dark
                                                    </SelectItem>
                                                    <SelectItem value="system">
                                                        System
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        {/* <FormDescription className="text-xs text-gray-500">
                                            The title or role of the author.
                                        </FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* First Name */}
                            <FormField
                                control={form.control}
                                name={`authors.${index}.first_name`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            First Name{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="E.g. John"
                                                {...field}
                                            />
                                        </FormControl>
                                        {/* <FormDescription className="text-xs text-gray-500">
                                            The first name of the author.
                                        </FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Last Name */}
                            <FormField
                                control={form.control}
                                name={`authors.${index}.last_name`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Last Name{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="E.g. Doe"
                                                {...field}
                                            />
                                        </FormControl>
                                        {/* <FormDescription className="text-xs text-gray-500">
                                            The last name of the author.
                                        </FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Email */}
                            <FormField
                                control={form.control}
                                name={`authors.${index}.email`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Email{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <IconInput
                                                leftIcon={
                                                    <AtSign className="h-4 w-4 text-gray-300" />
                                                }
                                                type="email"
                                                placeholder="E.g. john.doe@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        {/* <FormDescription className="text-xs text-gray-500">
                                            The email address of the author.
                                        </FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Affiliation */}
                            <FormField
                                control={form.control}
                                name={`authors.${index}.affiliation`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Affiliation{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <IconInput
                                                leftIcon={<Building />}
                                                placeholder="E.g. University, Company"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-gray-500">
                                            The affiliation of the author.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {/* DOI citation */}
            <div className="mb-6">
                <FormField
                    control={form.control}
                    name="doi"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>DOI Citation</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="E.g. 10.1234/abcd.efgh"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-xs text-gray-500">
                                Provide the DOI citation for your dataset.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
