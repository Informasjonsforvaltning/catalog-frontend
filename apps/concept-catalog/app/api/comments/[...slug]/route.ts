import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "@catalog-frontend/data-access";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ slug: string }> },
) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { slug } = params;

    if (slug?.length >= 2 && slug?.length <= 3) {
      const [orgNumber, topicId] = slug;
      try {
        const response = await getComments(
          orgNumber,
          topicId,
          `${session?.accessToken}`,
        );
        if (response.status !== 200) {
          throw new Error();
        }
        const jsonResponse = await response.json();
        return new Response(JSON.stringify(jsonResponse), {
          status: response.status,
        });
      } catch {
        return new Response(
          JSON.stringify({ message: "Failed to get comments" }),
          { status: 500 },
        );
      }
    } else {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
  });
};

export const POST = async (
  req: NextRequest,
  props: { params: Promise<{ slug: string }> },
) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { slug } = params;
    if (slug?.length >= 2 && slug?.length <= 3) {
      const { comment } = await req.json();
      const [orgNumber, topicId] = slug;
      try {
        const response = await createComment(
          orgNumber,
          topicId,
          comment,
          `${session?.accessToken}`,
        );
        if (response.status !== 201) {
          throw new Error();
        }
        return new Response(JSON.stringify({ ok: true }), {
          status: response.status,
        });
      } catch {
        return new Response(
          JSON.stringify({ message: "Failed to create comment" }),
          { status: 500 },
        );
      }
    } else {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
  });
};

export const PUT = async (
  req: NextRequest,
  props: { params: Promise<{ slug: string }> },
) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { slug } = params;
    if (slug?.length >= 2 && slug?.length <= 3) {
      const [orgNumber, topicId, commentId] = slug;
      const { comment } = await req.json();
      try {
        const response = await updateComment(
          orgNumber,
          topicId,
          commentId,
          comment,
          `${session?.accessToken}`,
        );
        if (response.status !== 200) {
          throw new Error();
        }
        const jsonResponse = await response.json();
        return new Response(JSON.stringify(jsonResponse), {
          status: response.status,
        });
      } catch {
        return new Response(
          JSON.stringify({ message: "Failed to update comment" }),
          { status: 500 },
        );
      }
    } else {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
  });
};

export const DELETE = async (
  req: NextRequest,
  props: { params: Promise<{ slug: string }> },
) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { slug } = params;
    if (slug?.length >= 2 && slug?.length <= 3) {
      const [orgNumber, topicId, commentId] = slug;
      try {
        const response = await deleteComment(
          orgNumber,
          topicId,
          commentId,
          `${session?.accessToken}`,
        );
        if (response.status !== 204) {
          throw new Error();
        }
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      } catch {
        return new Response(
          JSON.stringify({ message: "Failed to delete comment" }),
          { status: 500 },
        );
      }
    } else {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
  });
};
