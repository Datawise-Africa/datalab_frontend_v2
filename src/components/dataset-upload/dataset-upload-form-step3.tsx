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
import {
  AlertCircle,
  Building,
  Check,
  Dot,
  Mail,
  Plus,
  User,
  X,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useState } from 'react';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { type ILicence, type SingleFormLicence } from '@/hooks/use-licences';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import type { UploadDatasetSchemaType } from '@/lib/schema/upload-dataset-schema';
import { MultiSelect } from '../ui/multi-select';
import { type IFormAuthor } from '@/hooks/use-authors';
import { USER_TITLES } from '@/constants/user-titles.ts';

type Step3Props = {
  form: UseFormReturn<UploadDatasetSchemaType>;
  existingAuthors: IFormAuthor[];
  existingLicences: SingleFormLicence[];
};

interface Author {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  email: string;
  affiliation: string; // Optional, can be empty
}
const baseAuthors: Author[] = [
  // {
  //   id: crypto.randomUUID(),
  //   first_name: '',
  //   last_name: '',
  //   title: '',
  //   email: '',
  //   affiliation: '',
  // },
];


export default function DatasetUploadFormStep3({
  form,
  existingAuthors,
  existingLicences,
}: Step3Props) {
  const [authors, setAuthors] = useState<Author[]>(baseAuthors);

  const addAuthor = () => {
    const newAuthor: Author = {
      id: crypto.randomUUID(),
      first_name: '',
      last_name: '',
      title: '',
      email: '',
      affiliation: '',
    };
    setAuthors([...authors, newAuthor]);
    form.setValue('step_3.new_authors', [...authors, newAuthor]);
  };
  const removeAuthor = (id: string) => {
    setAuthors(authors.filter((author) => author.id !== id));
    form.setValue(
      'step_3.new_authors',
      authors.filter((author) => author.id !== id),
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name={`step_3.authors`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Authors</FormLabel>
              <FormControl className="">
                <MultiSelect
                  {...field}
                  options={existingAuthors.map((author) => ({
                    value: '' + author.id,
                    label: `${author.first_name} ${author.last_name}`,
                  }))}
                  mode="multiple"
                  value={field.value as unknown as string[]}
                  chipVariant="default"
                  onChange={field.onChange}
                  placeholder="Select authors"
                  className="border-primary/30 w-full bg-white"
                />
              </FormControl>
              {/* <FormDescription className="text-xs text-gray-500">
                                            The title or role of the author.
                                        </FormDescription> */}
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <h1>Add New Authors</h1>
          <Button
            onClick={addAuthor}
            variant={'outline'}
            className="border-primary/30 bg-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Author
          </Button>
        </div>
        {authors.map((author, index) => (
          <div
            key={author.id}
            className="border-primary/30 mb-4 rounded-md border p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center text-lg">
                <User className="mr-2 inline h-5 w-5" />
                Author {index + 1}
              </h2>
              {
                <Button variant="ghost" onClick={() => removeAuthor(author.id)}>
                  <X className="h-4 w-4" />
                </Button>
              }
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Title */}
                <FormField
                  control={form.control}
                  name={`step_3.new_authors.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl className="">
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger className="border-primary/30 w-full">
                            <SelectValue placeholder="Mr./Mrs." />
                          </SelectTrigger>
                          <SelectContent className="border-primary/30 w-full bg-white">
                            {USER_TITLES.map((title) => (
                              <SelectItem key={title} value={title}>
                                {title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {/* <FormDescription className="text-xs text-gray-500">
                                            The title or role of the author.
                                        </FormDescription> */}
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                {/* First Name */}
                <FormField
                  control={form.control}
                  name={`step_3.new_authors.${index}.first_name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. John" {...field} />
                      </FormControl>
                      {/* <FormDescription className="text-xs text-gray-500">
                                            The first name of the author.
                                        </FormDescription> */}
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                {/* Last Name */}
                <FormField
                  control={form.control}
                  name={`step_3.new_authors.${index}.last_name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Last Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. Doe" {...field} />
                      </FormControl>
                      {/* <FormDescription className="text-xs text-gray-500">
                                            The last name of the author.
                                        </FormDescription> */}
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                {/* Email */}
                <FormField
                  control={form.control}
                  name={`step_3.new_authors.${index}.email`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <IconInput
                          leftIcon={<Mail className="h-4 w-4" />}
                          type="email"
                          placeholder="E.g. john.doe@example.com"
                          {...field}
                        />
                      </FormControl>
                      {/* <FormDescription className="text-xs text-gray-500">
                                            The email address of the author.
                                        </FormDescription> */}
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              {/* Affiliation */}
              <FormField
                control={form.control}
                name={`step_3.new_authors.${index}.affiliation`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Affiliation <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <IconInput
                        leftIcon={<Building />}
                        placeholder="E.g. University, Company, or Organization"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      The affiliation of the author.
                    </FormDescription>
                    <FormMessage className="text-xs text-red-500" />
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
          name="step_3.doi_citation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DOI Citation</FormLabel>
              <FormControl>
                <Input placeholder="E.g. 10.1234/abcd.efgh" {...field} />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                <strong>Optional:</strong> Add a DOI if your dataset has already
                been published elsewhere
              </FormDescription>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        {/* Licence */}
        <FormField
          control={form.control}
          name="step_3.license"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value as unknown as string}
                  onValueChange={field.onChange}
                  className="space-y-2"
                >
                  {existingLicences!.map((lic, index) => (
                    <LicenceItem
                      lic={lic}
                      index={index}
                      key={lic.license_type}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Choose a license for your dataset. Click on any option to see
                more details.
              </FormDescription>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function LicenceItem({ index, lic }: { lic: ILicence; index: number }) {
  return (
    <div
      key={lic.license_type}
      className="border-primary/20 rounded border p-2 transition-colors hover:bg-gray-50"
    >
      <div className="flex items-start space-x-3">
        <RadioGroupItem
          value={lic.id as unknown as string}
          id={`license-${index}`}
          className=""
        />

        <div className="min-w-0 flex-1">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={`item-${index}`} className="border-0">
              <AccordionTrigger className="p-0 text-left hover:no-underline">
                <Label
                  htmlFor={`license-${index}`}
                  className="block w-full cursor-pointer text-left"
                >
                  <div className=" ">
                    <h3 className="">{lic.license_type}</h3>
                    {/* <p className="text-sm text-gray-600">{lic.description}</p> */}
                    {/* <div className="flex flex-wrap gap-2"> */}
                    {/* {Object.entries(lic.fields).map(([fieldName, value]) => (
                        <Badge
                          key={fieldName}
                          variant="outline"
                          className={cn(
                            'text-xs',
                            value
                              ? 'border-green-300 bg-green-50 text-green-800'
                              : 'border-red-300 bg-red-50 text-red-800',
                          )}
                        >
                          {value ? (
                            <Check className="mr-1 h-3 w-3" />
                          ) : (
                            <X className="mr-1 h-3 w-3" />
                          )}
                          {fieldName}
                        </Badge>
                      ))} */}
                    {/* </div> */}
                  </div>
                </Label>
              </AccordionTrigger>

              <AccordionContent className="pt-4">
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">{lic.description}</p>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="flex items-center gap-2 text-base font-semibold text-green-600">
                        <Check className="h-4 w-4" />
                        Advantages
                      </h4>
                      <ul className="space-y-1">
                        {lic.advantages.map((advantage, advIndex) => (
                          <li
                            key={advIndex}
                            className="flex items-start gap-2 text-sm text-green-700"
                          >
                            <Dot className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="flex items-center gap-2 text-base font-semibold text-orange-600">
                        <AlertCircle className="h-4 w-4" />
                        Considerations
                      </h4>
                      <ul className="space-y-1">
                        {lic.disadvantages.map((consideration, disIndex) => (
                          <li
                            key={disIndex}
                            className="flex items-start gap-2 text-sm text-orange-700"
                          >
                            <Dot className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600" />
                            <span>{consideration}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
