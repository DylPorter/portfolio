import { LuExternalLink } from "react-icons/lu";
import { Modal } from "./Modal";
import type { Post } from "../data/posts";

export function PostModal({ post, onClose }: { post: Post | undefined; onClose: () => void }) {
  return (
    <Modal open={!!post} onClose={onClose}>
      {post && (
        <article>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-3">
            {post.date} · {post.readingTime}
          </p>
          <h2 className="text-3xl font-bold mb-6">{post.title}</h2>

          <div className="flex flex-col gap-4">
            {post.body.map((block, i) =>
              block.type === "h" ? (
                <h3 key={i} className="text-lg font-semibold mt-4">{block.text}</h3>
              ) : (
                <p key={i} className="text-sm leading-relaxed text-[var(--body)]">{block.text}</p>
              )
            )}
          </div>

          {post.repoUrl && (
            <a href={post.repoUrl} target="_blank" className="inline-flex items-center px-4 py-2 text-sm button gap-2 mt-8">
              <LuExternalLink size={14} />View the repo
            </a>
          )}
        </article>
      )}
    </Modal>
  );
}
