/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const ViewLazyImport = createFileRoute('/view')()
const UploadLazyImport = createFileRoute('/upload')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const ViewLazyRoute = ViewLazyImport.update({
  path: '/view',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/view.lazy').then((d) => d.Route))

const UploadLazyRoute = UploadLazyImport.update({
  path: '/upload',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/upload.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/upload': {
      id: '/upload'
      path: '/upload'
      fullPath: '/upload'
      preLoaderRoute: typeof UploadLazyImport
      parentRoute: typeof rootRoute
    }
    '/view': {
      id: '/view'
      path: '/view'
      fullPath: '/view'
      preLoaderRoute: typeof ViewLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/upload': typeof UploadLazyRoute
  '/view': typeof ViewLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/upload': typeof UploadLazyRoute
  '/view': typeof ViewLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/upload': typeof UploadLazyRoute
  '/view': typeof ViewLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/upload' | '/view'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/upload' | '/view'
  id: '__root__' | '/' | '/upload' | '/view'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  UploadLazyRoute: typeof UploadLazyRoute
  ViewLazyRoute: typeof ViewLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  UploadLazyRoute: UploadLazyRoute,
  ViewLazyRoute: ViewLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/upload",
        "/view"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/upload": {
      "filePath": "upload.lazy.tsx"
    },
    "/view": {
      "filePath": "view.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
