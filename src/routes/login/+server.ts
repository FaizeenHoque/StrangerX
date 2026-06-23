import { HACKCLUB_AUTH_CLIENT_ID } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { HACKCLUB_REDIRECT_URI } from "$env/static/private";

export const GET: RequestHandler = () => {
    const url = new URL("https://auth.hackclub.com/oauth/authorize");
    url.searchParams.set("client_id", HACKCLUB_AUTH_CLIENT_ID);
    url.searchParams.set("redirect_uri", HACKCLUB_REDIRECT_URI);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "email profile");

    throw redirect(302, url.toString());
};