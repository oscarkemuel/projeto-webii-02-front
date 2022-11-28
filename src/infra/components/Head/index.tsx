import NextHead from 'next/head';

interface Props {
  title: string;
}

export function Head({ title }: Props): JSX.Element {
  return (
    <NextHead>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </NextHead>
  );
}
