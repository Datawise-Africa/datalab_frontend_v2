import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  layout('components/root-layout.tsx', [
    index('routes/home/index.tsx'),
    // Categories routes
    route('categories', 'routes/categories/index.tsx'),
    route('categories/new', 'routes/categories/new.tsx'),
    route('categories/:id', 'routes/categories/$id.tsx'),
    route('categories/:id/edit', 'routes/categories/$id.edit.tsx'),
    // Products routes
    route('products', 'routes/products/index.tsx'),
    route('products/new', 'routes/products/new.tsx'),
    route('products/:id', 'routes/products/$id.tsx'),
    route('products/:id/edit', 'routes/products/$id.edit.tsx'),
  ]),
  route('sitemap.xml', 'routes/sitemap.xml.ts'),
  route(
    '.well-known/appspecific/com.chrome.devtools.json',
    'routes/[.]well-known.appspecific.[com.chrome.devtools.json].ts'
  ),
] satisfies RouteConfig;
