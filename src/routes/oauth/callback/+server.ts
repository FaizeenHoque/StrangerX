import {
    HACKCLUB_AUTH_CLIENT_ID,
    HACKCLUB_AUTH_CLIENT_SECRET,
    HACKCLUB_REDIRECT_URI
} from "$env/static/private";

import { redirect } from "@sveltejs/kit";

export const GET = async ({ url, fetch, cookies }) => {
    const code = url.searchParams.get("code");

    if (!code) {
        throw redirect(302, "/login?error=missing_code");
    }

    const res = await fetch("https://auth.hackclub.com/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client_id: HACKCLUB_AUTH_CLIENT_ID,
            client_secret: HACKCLUB_AUTH_CLIENT_SECRET,
            redirect_uri: HACKCLUB_REDIRECT_URI,
            code,
            grant_type: "authorization_code"
        })
    });

    const data = await res.json();

    if (!res.ok) {
        console.error("OAuth failed:", data);
        throw redirect(302, "/login?error=token_failed");
    }

    cookies.set("access_token", data.access_token, {
        httpOnly: true,
        secure: true, // set true in production (HTTPS)
        path: "/",
        maxAge: data.expires_in
    });

    cookies.set("refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: true,
        path: "/"
    });

    console.log("Token saved.")

    throw redirect(302, "/matchmaking");
};