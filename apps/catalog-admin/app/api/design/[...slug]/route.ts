import {
  deleteDesignLogo,
  getDesign,
  getDesignLogo,
  patchDesign,
  postDesignLogo,
} from "@catalog-frontend/data-access";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import { NextRequest } from "next/server";

const isLogoPath = (slug: string[] | undefined): slug is string[] =>
  slug?.length === 2 && slug[1] === "logo";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ slug: string[] }> },
) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { slug } = params;
    if (slug?.length === 2 && slug[1] === "design") {
      try {
        const response = await getDesign(slug[0], session.accessToken);
        if (response.status !== 200) {
          throw new Error();
        }
        const jsonResponse = await response.json();
        return new Response(JSON.stringify(jsonResponse), {
          status: response.status,
        });
      } catch (error) {
        return new Response("Failed to get design logo", { status: 500 });
      }
    } else if (isLogoPath(slug)) {
      try {
        const response = await getDesignLogo(slug[0], session.accessToken);
        if (response.status !== 200) {
          return new Response("Failed to get design logo", {
            status: response.status,
          });
        }
        const headers = {
          "Content-Type":
            response.headers.get("Content-Type") ?? "application/json",
          ...(response.headers.has("Content-Disposition")
            ? {
                "Content-Disposition":
                  response.headers.get("Content-Disposition") ?? "",
              }
            : {}),
          ...(response.headers.has("Cache-Control")
            ? { "Cache-Control": response.headers.get("Cache-Control") ?? "" }
            : {}),
        };
        const arrayBufferResponse = await response.arrayBuffer();
        return new Response(arrayBufferResponse, {
          status: response.status,
          headers,
        });
      } catch (error) {
        return new Response("Failed to get design logo", { status: 500 });
      }
    } else {
      return new Response("Unauthorized", { status: 401 });
    }
  });
};

export const PATCH = async (
  req: NextRequest,
  props: { params: Promise<{ slug: string[] }> },
) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { slug } = params;
    const catalogId = slug[0];
    try {
      const diff = await req.json();
      const response = await patchDesign(catalogId, session.accessToken, diff);

      if (response?.status !== 200) {
        throw new Error();
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), {
        status: response.status,
      });
    } catch (error) {
      return new Response("Failed to update design", { status: 500 });
    }
  });
};

export const POST = async (
  req: NextRequest,
  props: { params: Promise<{ slug: string[] }> },
) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { slug } = params;
    if (!isLogoPath(slug)) {
      return new Response("Not found", { status: 404 });
    }
    let logo: FormDataEntryValue | null;
    try {
      logo = (await req.formData()).get("logo");
    } catch (error) {
      return new Response("Invalid form data", { status: 400 });
    }
    if (!(logo instanceof File)) {
      return new Response("Missing logo file", { status: 400 });
    }
    try {
      const response = await postDesignLogo(slug[0], session.accessToken, logo);
      if (!response.ok) {
        console.error(
          "Failed to upload design logo",
          response.status,
          response.statusText,
        );
        return new Response("Failed to upload design logo", {
          status: response.status,
        });
      }
      return new Response(null, { status: response.status });
    } catch (error) {
      console.error("Failed to upload design logo", error);
      return new Response("Failed to upload design logo", { status: 500 });
    }
  });
};

export const DELETE = async (
  req: NextRequest,
  props: { params: Promise<{ slug: string[] }> },
) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { slug } = params;
    if (!isLogoPath(slug)) {
      return new Response("Not found", { status: 404 });
    }
    try {
      const response = await deleteDesignLogo(slug[0], session.accessToken);
      if (!response.ok) {
        console.error(
          "Failed to delete design logo",
          response.status,
          response.statusText,
        );
        return new Response("Failed to delete design logo", {
          status: response.status,
        });
      }
      return new Response(null, { status: response.status });
    } catch (error) {
      console.error("Failed to delete design logo", error);
      return new Response("Failed to delete design logo", { status: 500 });
    }
  });
};
