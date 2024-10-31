import type { MDXComponents } from 'mdx/types'
import "./app/markdown.css"

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components,
        // Allows customizing built-in components, e.g. to add styling.
        // return {
        //   h1: ({ children }) => <h1 style={{ fontSize: "100px" }}>{children}</h1>,
        //   ...components,
        // }
    }
}