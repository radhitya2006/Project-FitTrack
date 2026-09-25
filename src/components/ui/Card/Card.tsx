import { type HTMLAttributes, type ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  noPadding?: boolean;
  children: ReactNode;
}

export function Card({
  interactive = false,
  noPadding = false,
  className = '',
  children,
  ...props
}: CardProps) {
  const classes = [
    styles.card,
    interactive ? styles.interactive : '',
    noPadding ? styles.noPadding : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
