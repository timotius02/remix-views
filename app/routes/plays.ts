import { ActionFunction } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id") as string;
  await db.playlist.update({
    where: {
      id,
    },
    data: {
      plays: {
        increment: 1,
      },
    },
  });
  return null;
};
