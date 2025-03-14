import { getHoursMinutes } from '~/lib/utils';

type Props = {
  createdAt: Date;
};

export const MessageTime = ({ createdAt }: Props) => {
  const time = getHoursMinutes(createdAt);

  return <span className="cursor-default font-mono text-xs">{time}</span>;
};
