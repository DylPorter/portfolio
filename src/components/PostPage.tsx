import { useParams, Link, Navigate } from "react-router-dom";
import { LuArrowLeft, LuExternalLink } from "react-icons/lu";
import { motion } from "framer-motion";
import { fadeUp } from "./animations";
import { posts } from "../data/posts";

export function PostPage() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return <Navigate to="/" replace />;

  return (
    <main className="max-w-3xl px-6 md:px-8 mx-auto pt-8 pb-20">
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <article>
          <Link to="/#writing" className="link inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium mb-8">
            <LuArrowLeft size={13} /> Writing
          </Link>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-3">{post.date} · {post.readingTime}</p>
          <h1 className="text-3xl md:text-4xl font-medium tracking-[-0.02em] mb-8">{post.title}</h1>
          <div className="flex flex-col gap-4">
            {post.body.map((block, i) =>
              block.type === "h" ? (
                <h2 key={i} className="serif text-xl font-medium text-[var(--ink)] mt-6">{block.text}</h2>
              ) : (
                <p key={i} className="leading-relaxed text-[var(--body)]">{block.text}</p>
              )
            )}
          </div>
          {post.repoUrl && (
            <a href={post.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 text-sm button gap-2 mt-10">
              <LuExternalLink size={14} />View the repo
            </a>
          )}
        </article>
      </motion.div>
    </main>
  );
}
