import { Quote, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
export function AnecdoteCard({
  title,
  text,
  source,
  index = 0,
}: {
  title: string;
  text: string;
  source?: string;
  index?: number;
}) {
  return (
    <Reveal className="anecdote-card" delay={index * 0.08}>
      <span className="anecdote-number">0{index + 1}</span>
      <Quote size={23} strokeWidth={1} />
      <h3>{title}</h3>
      <p>{text}</p>
      {source && (
        <a className="text-link" href={source} target="_blank" rel="noreferrer">
          La petite source <ArrowUpRight size={13} />
        </a>
      )}
    </Reveal>
  );
}
