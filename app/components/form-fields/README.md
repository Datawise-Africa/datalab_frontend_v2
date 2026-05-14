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

### 5. FormSelectField

Dropdown select field with shadcn/ui Select component.

```tsx
<FormSelectField
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

**Props:**

- `control` - React Hook Form control object
- `name` - Field name (typed from form schema)
- `label` - Field label text
- `placeholder?` - Placeholder text (default: 'Select an option')
- `required?` - Show required asterisk (default: false)
- `disabled?` - Disable the field (default: false)
- `options` - Array of `{ value: string, label: string }` objects

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
  FormSelectField,
} from '~/components/form-fields';
```

## Benefits

✅ **Reduced Boilerplate**: ~15 lines → 7 lines per field (53% reduction)  
✅ **Type Safety**: Full TypeScript support with generic types  
✅ **Consistent UI**: Standardized styling across all forms  
✅ **Easy Maintenance**: Update once, apply everywhere  
✅ **Better DX**: Cleaner, more readable form code
