'use client';

import { ErrorBoundary } from '~/components/global/error-boundary';

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorBoundary error={error} reset={reset} />;
}
