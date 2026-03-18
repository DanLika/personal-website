import ReactMarkdown from "react-markdown";

interface BlogContentProps {
  content: string;
}

export const BlogContent = ({ content }: BlogContentProps) => {
  return (
    <div
      className="prose prose-invert prose-lg max-w-none
        prose-headings:font-bold prose-headings:text-white
        prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:mt-12 prose-h1:mb-6 prose-h1:leading-tight
        prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-4
        prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-cyan-400
        prose-p:text-white/80 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base prose-p:md:text-lg
        prose-strong:text-cyan-400 prose-strong:font-semibold
        prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
        prose-ul:text-white/80 prose-ul:my-6 prose-ul:pl-6
        prose-ol:text-white/80 prose-ol:my-6 prose-ol:pl-6
        prose-li:mb-3 prose-li:text-base prose-li:md:text-lg
        prose-img:my-10 prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl
        prose-code:text-cyan-400 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl"
    >
      <ReactMarkdown
        components={{
          img: ({ src, alt }) => {
            // Ensure src starts with / for absolute path from public folder
            const imageSrc = src?.startsWith("/") ? src : `/${src}`;
            return (
              <img
                src={imageSrc}
                alt={alt || ""}
                title={alt || ""}
                width={800}
                height={450}
                loading="lazy"
                decoding="async"
                className="w-full rounded-2xl border border-white/10 shadow-2xl my-10"
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
