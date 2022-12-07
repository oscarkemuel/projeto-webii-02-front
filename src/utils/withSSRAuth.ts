/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult
} from 'next';

import { parseCookies } from 'nookies';

export function withSSRAuth<P extends { [key: string]: any }>(
  fn: GetServerSideProps<P>
) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    if (!cookies.authtoken) {
      return {
        redirect: {
          destination: '/login',
          permanent: false
        }
      };
    }

    return fn(ctx);
  };
}
