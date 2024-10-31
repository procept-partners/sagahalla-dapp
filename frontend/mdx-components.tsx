import type { MDXComponents } from 'mdx/types'
// import "./app/markdown.css"

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components,
        h1: ({ children }) => <h1 style={{
            fontSize: "2.25rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
            fontFamily: 'Helvetica', // Add font family here
            lineHeight: 1.6 // Add line height here
        }}>{children}</h1>,
        h2: ({ children }) => <h2 style={{
            fontSize: "1.75rem",
            fontWeight: 600,
            marginBottom: "1.25rem",
            fontFamily: 'Helvetica', // Add font family here
            lineHeight: 1.6 // Add line height here
        }}>{children}</h2>,
        h3: ({ children }) => <h3 style={{
            fontSize: "1.5rem",
            fontWeight: 500,
            marginBottom: "1rem",
            fontFamily: 'Helvetica', // Add font family here
            lineHeight: 1.6 // Add line height here
        }}>{children}</h3>,
        h4: ({ children }) => <h4 style={{
            fontSize: "1.25rem",
            fontWeight: 500,
            marginBottom: "0.75rem",
            fontFamily: 'Helvetica', // Add font family here
            lineHeight: 1.6 // Add line height here
        }}>{children}</h4>,
        h5: ({ children }) => <h5 style={{
            fontSize: "1.125rem",
            fontWeight: 500,
            marginBottom: "0.5rem",
            fontFamily: 'Helvetica', // Add font family here
            lineHeight: 1.6 // Add line height here
        }}>{children}</h5>,
        h6: ({ children }) => <h6 style={{
            fontSize: "1rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
            fontFamily: 'Helvetica', // Add font family here
            lineHeight: 1.6 // Add line height here
        }}>{children}</h6>,
        p: ({ children }) => <p style={{
            marginBottom: "1rem",
            fontSize: "0.95rem",
            fontFamily: 'Helvetica', // Add font family here
            lineHeight: 1.6 // Add line height here
        }}>{children}</p>,
        ul: ({ children }) => <ul style={{
            marginLeft: "2rem",
            marginTop: "1rem",
            marginBottom: "1rem",
            listStyleType: "disc",
            fontFamily: 'Helvetica', // Add font family here
            lineHeight: 1.6 // Add line height here
        }}>{children}</ul>,
        ol: ({ children }) => <ol style={{
            marginLeft: "2rem",
            marginTop: "1rem",
            marginBottom: "1rem",
            listStyleType: "decimal",
            fontFamily: 'Helvetica', // Add font family here
            lineHeight: 1.6 // Add line height here
        }}>{children}</ol>,
        li: ({ children }) => <li style={{
            marginBottom: "0.5rem",
            fontFamily: 'Helvetica', // Add font family here
            lineHeight: 1.6 // Add line height here
        }}>{children}</li>,
        a: ({ children, ...props }) => <a style={{
            color: "#007bff",
            textDecoration: "none",
            transition: "color 0.2s ease-in-out",
            fontFamily: 'Helvetica', // Add font family here
            lineHeight: 1.6 // Add line height here
        }} {...props}>{children}</a>,
        img: ({ ...props }) => <img style={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            margin: "1rem 0"
            // Images don't need font styles
        }} {...props} />,
        hr: ({ ...props }) => <hr style={{
            border: "none",
            borderTop: "1px solid #eee",
            margin: "2rem 0"
            // hr doesn't need font styles
        }} {...props} />,
        code: ({ children }) => <code style={{
            fontFamily: "'Courier New', Courier, monospace", // Code gets a specific font
            backgroundColor: "#f5f5f5",
            padding: "0.25rem 0.5rem",
            borderRadius: "4px"
        }}>{children}</code>,
        blockquote: ({ children }) => <blockquote style={{
            margin: "1rem 0",
            padding: "1rem",
            borderLeft: "4px solid #ddd",
            backgroundColor: "#f9f9f9",
            fontFamily: 'Helvetica', // Add font family here
            lineHeight: 1.6 // Add line height here
        }}>{children}</blockquote>
    }
}
