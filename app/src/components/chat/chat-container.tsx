import { cn } from '~/lib/utils';

type Props = React.PropsWithChildren & {
  className?: string;
};

export const ChatContainer = ({ children, className }: Props) => {
  return (
    <section className={cn('flex h-full items-center justify-center pl-0 lg:pl-4', className)}>
      {children}
    </section>
  );
};
