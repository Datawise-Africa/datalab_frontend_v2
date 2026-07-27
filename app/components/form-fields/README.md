# Form Field Components

Reusable form field components to eliminate boilerplate code in forms.

## Available Components

### 1. FormTextField

Standard text input field with support for different input types.

```tsx
<FormTextField
  control={form.control}
  name="email"
  label="Email Address"
  placeholder="Enter your email"
  type="email"
  required
/>
```

**Props:**

- `control` - React Hook Form control object
- `name` - Field name (typed from form schema)
- `label` - Field label text
- `placeholder?` - Placeholder text
- `required?` - Show required asterisk (default: false)
- `disabled?` - Disable the field (default: false)
- `type?` - Input type: 'text' | 'email' | 'url' (default: 'text')

### 2. FormPasswordField

Password input with show/hide toggle button.

```tsx
<FormPasswordField
  control={form.control}
  name="password"
  label="Password"
  placeholder="Enter password"
  required
/>
```

**Props:**

- `control` - React Hook Form control object
- `name` - Field name (typed from form schema)
- `label` - Field label text
- `placeholder?` - Placeholder text
- `required?` - Show required asterisk (default: false)
- `disabled?` - Disable the field (default: false)

### 3. FormTextareaField

Multi-line text area field.

```tsx
<FormTextareaField
  control={form.control}
  name="description"
  label="Description"
  placeholder="Enter description"
  rows={4}
/>
```

**Props:**

- `control` - React Hook Form control object
- `name` - Field name (typed from form schema)
- `label` - Field label text
- `placeholder?` - Placeholder text
- `required?` - Show required asterisk (default: false)
- `disabled?` - Disable the field (default: false)
- `rows?` - Number of visible text lines (default: 4)

### 4. FormNumberField

Number input with proper type handling and validation.

```tsx
<FormNumberField
  control={form.control}
  name="price"
  label="Price"
  placeholder="0.00"
  step={0.01}
  min={0}
  required
/>
```

**Props:**

- `control` - React Hook Form control object
- `name` - Field name (typed from form schema)
- `label` - Field label text
- `placeholder?` - Placeholder text
- `required?` - Show required asterisk (default: false)
- `disabled?` - Disable the field (default: false)
- `min?` - Minimum allowed value
- `max?` - Maximum allowed value
- `step?` - Increment step for number input

### 5. FormPickerField

The one select field — single or multi, static options or remote search. Renders
`Picker` (`~/components/ui/picker.tsx`), our own control; it is deliberately not
named `Combobox` so it never collides with shadcn's recipe, and
`~/components/ui/select.tsx` remains the unrelated vendored shadcn primitive.

```tsx
<FormPickerField
  control={form.control}
  name="categoryId"
  label="Category"
  placeholder="Select a category"
  options={[
    { value: '1', label: 'Category 1' },
    { value: '2', label: 'Category 2' },
  ]}
  required
/>
```

Multi-select, and remote search where the parent owns the fetch:

```tsx
<FormPickerField
  control={form.control}
  name="countries"
  label="Countries"
  multi
  max={5}
  options={countryOptions}
/>

<FormPickerField
  control={form.control}
  name="author"
  label="Author"
  minSearchLength={2}
  onSearch={(query, signal) => searchAuthors(query, { signal })}
/>
```

**Props:**

- `control` - React Hook Form control object
- `name` - Field name (typed from form schema)
- `label` - Field label text
- `placeholder?` - Placeholder text
- `searchPlaceholder?` - Placeholder for the search input
- `emptyMessage?` - Text shown when nothing matches
- `loading?` / `loadingText?` - Parent-owned loading flag and its label
- `required?` - Show required asterisk (default: false)
- `disabled?` - Disable the field (default: false)
- `readOnly?` - Show the selection but block interaction
- `options` - Array of `{ value: string, label: string }` objects (static mode)
- `onSearch?` - `(query, signal) => Promise<PickerItem[]>` (remote mode; also
  accepts `debounceMs`, `initialItems`, `minSearchLength`)
- `multi?` - Store an array; adds `max`, `optionStyle`, `maxVisibleChips`
- `valueAs?` - `'string' | 'number' | 'boolean'` coercion. Clearing writes `null`

For selects outside a form, use `Picker` from `~/components/ui/picker` directly.

## Usage Example

### Before (with boilerplate):

```tsx
<FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>
        Name <span className="text-destructive">*</span>
      </FormLabel>
      <FormControl>
        <Input placeholder="Enter name" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### After (with reusable component):

```tsx
<FormTextField
  control={form.control}
  name="name"
  label="Name"
  placeholder="Enter name"
  required
/>
```

## Import

```tsx
import {
  FormTextField,
  FormPasswordField,
  FormTextareaField,
  FormNumberField,
  FormPickerField,
} from '~/components/form-fields';
```

## Benefits

✅ **Reduced Boilerplate**: ~15 lines → 7 lines per field (53% reduction)  
✅ **Type Safety**: Full TypeScript support with generic types  
✅ **Consistent UI**: Standardized styling across all forms  
✅ **Easy Maintenance**: Update once, apply everywhere  
✅ **Better DX**: Cleaner, more readable form code
