// lib/withStaticGuard.ts

import { GetStaticProps } from "next";

export function withStaticGuard(loader: GetStaticProps): GetStaticProps {
  return async function (ctx) {
    if (process.env.SKIP_STATIC_BUILD === "true") {
      return {
        props: {
          data: {
            users: [],
            tags: [],
          },
          total: { active: 0, views: 0, clicks: 0 },
          today: { users: 0, views: 0, clicks: 0 },
          randomProfile: { username: "", name: "", bio: "" },
          BASE_URL: "",
          alerts: [],
        },
      };
    }

    return loader(ctx);
  };
}
