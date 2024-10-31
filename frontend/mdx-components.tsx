import type { MDXComponents } from 'mdx/types'
import "./app/markdown.css"

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components,
    }
}